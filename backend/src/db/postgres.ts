import { Pool, PoolConfig } from "pg";
import fs from "fs";
import path from "path";
import { Diamond, User, Inquiry, BusinessProfile, DiamondFilter } from "../types";

let pool: Pool | null = null;
let isConnected = false;

export function getPostgresPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString && !process.env.PGHOST) {
    return null;
  }

  const config: PoolConfig = connectionString
    ? {
        connectionString,
        ssl:
          connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
            ? false
            : { rejectUnauthorized: false },
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres",
        database: process.env.PGDATABASE || "maadiamond",
      };

  try {
    pool = new Pool(config);
    return pool;
  } catch (err) {
    console.warn("PostgreSQL Pool initialization warning:", err);
    return null;
  }
}

export async function initPostgresDatabase(): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) return false;

  try {
    const client = await p.connect();
    try {
      const schemaPath = path.join(__dirname, "schema.sql");
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, "utf-8");
        await client.query(sql);
        console.log("✓ PostgreSQL Database connected and schema synchronized successfully.");
        isConnected = true;
        return true;
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("PostgreSQL not active or unreachable, utilizing resilient local storage fallback:", err.message);
    isConnected = false;
  }
  return false;
}

export function isPostgresActive(): boolean {
  return isConnected;
}

// ==========================================
// POSTGRES DIAMONDS CRUD OPERATIONS
// ==========================================

export async function pgGetDiamonds(filter?: DiamondFilter): Promise<{ diamonds: Diamond[]; total: number }> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  let query = "SELECT * FROM diamonds WHERE is_available = true";
  const params: any[] = [];
  let paramIdx = 1;

  if (filter?.shape) {
    query += ` AND shape = $${paramIdx++}`;
    params.push(filter.shape);
  }
  if (filter?.color) {
    query += ` AND color = $${paramIdx++}`;
    params.push(filter.color);
  }
  if (filter?.clarity) {
    query += ` AND clarity = $${paramIdx++}`;
    params.push(filter.clarity);
  }
  if (filter?.search) {
    const s = `%${filter.search.toLowerCase()}%`;
    query += ` AND (LOWER(stock_number) LIKE $${paramIdx} OR LOWER(shape) LIKE $${paramIdx} OR LOWER(certificate_no) LIKE $${paramIdx} OR LOWER(color) LIKE $${paramIdx} OR LOWER(clarity) LIKE $${paramIdx})`;
    params.push(s);
    paramIdx++;
  }

  query += " ORDER BY created_at DESC";

  const res = await p.query(query, params);
  const diamonds: Diamond[] = res.rows.map(mapDiamondRow);
  return { diamonds, total: diamonds.length };
}

export async function pgGetDiamondById(id: string): Promise<Diamond | null> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const res = await p.query("SELECT * FROM diamonds WHERE id = $1 LIMIT 1", [id]);
  if (res.rows.length === 0) return null;
  return mapDiamondRow(res.rows[0]);
}

export async function pgCreateDiamond(data: Omit<Diamond, "id" | "createdAt" | "updatedAt" | "totalPrice">): Promise<Diamond> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const id = `dia_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const totalPrice = Math.round(data.carat * data.pricePerCarat);

  const query = `
    INSERT INTO diamonds (
      id, stock_number, shape, carat, color, clarity, cut, polish, symmetry,
      fluorescence, lab, certificate_no, dimensions, price_per_carat, total_price,
      image_url, description, is_featured, is_available, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
    ) RETURNING *
  `;

  const values = [
    id,
    data.stockNumber,
    data.shape,
    data.carat,
    data.color,
    data.clarity,
    data.cut || "Ideal",
    data.polish || "Excellent",
    data.symmetry || "Excellent",
    data.fluorescence || "None",
    data.lab || "GIA",
    data.certificateNo,
    data.dimensions,
    data.pricePerCarat,
    totalPrice,
    data.imageUrl,
    data.description || "",
    data.isFeatured ?? true,
    data.isAvailable ?? true,
    now,
    now,
  ];

  const res = await p.query(query, values);
  return mapDiamondRow(res.rows[0]);
}

export async function pgUpdateDiamond(id: string, updates: Partial<Diamond>): Promise<Diamond | null> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const existing = await pgGetDiamondById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  if (updates.carat || updates.pricePerCarat) {
    merged.totalPrice = Math.round(merged.carat * merged.pricePerCarat);
  }

  const query = `
    UPDATE diamonds SET
      stock_number = $1, shape = $2, carat = $3, color = $4, clarity = $5,
      cut = $6, polish = $7, symmetry = $8, fluorescence = $9, lab = $10,
      certificate_no = $11, dimensions = $12, price_per_carat = $13, total_price = $14,
      image_url = $15, description = $16, is_featured = $17, is_available = $18, updated_at = $19
    WHERE id = $20
    RETURNING *
  `;

  const values = [
    merged.stockNumber,
    merged.shape,
    merged.carat,
    merged.color,
    merged.clarity,
    merged.cut,
    merged.polish,
    merged.symmetry,
    merged.fluorescence,
    merged.lab,
    merged.certificateNo,
    merged.dimensions,
    merged.pricePerCarat,
    merged.totalPrice,
    merged.imageUrl,
    merged.description,
    merged.isFeatured,
    merged.isAvailable,
    merged.updatedAt,
    id,
  ];

  const res = await p.query(query, values);
  return mapDiamondRow(res.rows[0]);
}

export async function pgDeleteDiamond(id: string): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const res = await p.query("DELETE FROM diamonds WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

// Helper Row Mapper
function mapDiamondRow(row: any): Diamond {
  return {
    id: row.id,
    stockNumber: row.stock_number,
    shape: row.shape,
    carat: Number(row.carat),
    color: row.color,
    clarity: row.clarity,
    cut: row.cut,
    polish: row.polish,
    symmetry: row.symmetry,
    fluorescence: row.fluorescence,
    lab: row.lab,
    certificateNo: row.certificate_no,
    dimensions: row.dimensions,
    pricePerCarat: Number(row.price_per_carat),
    totalPrice: Number(row.total_price),
    imageUrl: row.image_url,
    description: row.description || "",
    isFeatured: Boolean(row.is_featured),
    isAvailable: Boolean(row.is_available),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ==========================================
// POSTGRES USERS AUTH OPERATIONS
// ==========================================

export async function pgFindUserByEmail(email: string): Promise<User | null> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const res = await p.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    companyName: row.company_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function pgFindUserById(id: string): Promise<User | null> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const res = await p.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    companyName: row.company_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function pgCreateUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  const p = getPostgresPool();
  if (!p) throw new Error("PostgreSQL pool not available");

  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const query = `
    INSERT INTO users (id, email, password_hash, name, company_name, phone, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [id, data.email, data.passwordHash, data.name, data.companyName || "", data.phone || "", data.role || "USER", now, now];
  const res = await p.query(query, values);
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    companyName: row.company_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


