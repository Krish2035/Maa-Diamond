import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { User, Diamond, Inquiry, BusinessProfile, QRScanRecord } from "../types/index.js";

interface DatabaseSchema {
  users: User[];
  diamonds: Diamond[];
  inquiries: Inquiry[];
  profile: BusinessProfile;
  qrScans: QRScanRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.resolve(DATA_DIR, "maadiamond.json");

export class StorageEngine {
  private static instance: StorageEngine;
  private data: DatabaseSchema;

  private constructor() {
    this.ensureDirectoryExists();
    this.data = this.loadData();
  }

  public static getInstance(): StorageEngine {
    if (!StorageEngine.instance) {
      StorageEngine.instance = new StorageEngine();
    }
    return StorageEngine.instance;
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
      } catch (err) {
        console.error("Error reading database file, re-initializing:", err);
      }
    }
    const initialData = this.generateInitialData();
    this.persist(initialData);
    return initialData;
  }

  private persist(data: DatabaseSchema): void {
    try {
      this.ensureDirectoryExists();
      const tempPath = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempPath, DATA_FILE);
    } catch (err) {
      console.error("Failed to persist database file:", err);
    }
  }

  private generateInitialData(): DatabaseSchema {
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync("Admin@MaaDiamond2026", salt);
    const buyerHash = bcrypt.hashSync("Buyer123!", salt);
    const now = new Date().toISOString();

    const users: User[] = [
      {
        id: "usr_admin_001",
        email: "admin@maadiamond.com",
        passwordHash: adminHash,
        name: "Maa Diamond Management",
        companyName: "Maa Diamond",
        phone: "+91 98251 12345",
        role: "ADMIN",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr_buyer_001",
        email: "buyer@jewelers.com",
        passwordHash: buyerHash,
        name: "Rajesh Parekh",
        companyName: "Parekh Heritage Jewels",
        phone: "+91 98980 54321",
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const profile: BusinessProfile = {
      id: "maa_diamond_profile",
      companyName: "Maa Diamond",
      tagline: "Exquisite Craftsmanship, Certified Brilliance",
      directors: [
        {
          name: "Hardik Sorathiya",
          designation: "Director - Manufacturing & Sales",
          phone: "+91 90333 20326",
          whatsapp: "919033320326",
        },
        {
          name: "Sanket Sorathiya",
          designation: "Director - International Trade",
          phone: "+91 80000 45391",
          whatsapp: "918000045391",
        },
      ],
      primaryEmail: "info@maadiamond.com",
      salesEmail: "inquiry@maadiamond.com",
      websiteUrl: "https://maa-diamond.vercel.app",
      cardUrl: "https://maa-diamond.vercel.app/card",
      address: {
        building: "202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha",
        street: "Mini Bazaar, Varachha",
        city: "Surat",
        state: "Gujarat",
        country: "India",
        pincode: "395006",
      },
      googleMapsUrl: "https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat",
      instagramUrl: "https://instagram.com/maadiamond_official",
      facebookUrl: "https://facebook.com/maadiamondofficial",
      linkedinUrl: "https://linkedin.com/company/maa-diamond",
      brochureUrl: "/downloads/Maa_Diamond_Catalog_2026.pdf",
      aboutText:
        "With over three decades of lapidary mastery, Maa Diamond stands as a premier manufacturer and global purveyor of certified natural and high-clarity diamonds. From raw octahedral kimberlite crystal selection to micron-tolerance laser proportioning, every Maa Diamond gem embodies peak optical dispersion, fire, and scintillating brilliance.",
      updatedAt: now,
    };

    const diamonds: Diamond[] = [
      {
        id: "dia_rnd_001",
        stockNumber: "MD-RND-152",
        shape: "Round",
        carat: 1.52,
        color: "D",
        clarity: "VVS1",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "2235914872",
        dimensions: "7.38 x 7.42 x 4.56 mm",
        pricePerCarat: 8200,
        totalPrice: 12464,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        description: "Triple Excellent GIA-certified Round Brilliant cut diamond exhibiting flawless symmetry, Hearts & Arrows dispersion, and zero fluorescence.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_mrq_002",
        stockNumber: "MD-MRQ-204",
        shape: "Marquise",
        carat: 2.04,
        color: "E",
        clarity: "VVS2",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Very Good",
        fluorescence: "Faint",
        lab: "IGI",
        certificateNo: "489201948",
        dimensions: "12.80 x 6.42 x 3.95 mm",
        pricePerCarat: 7100,
        totalPrice: 14484,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        description: "Elongated royal Marquise cut showcasing majestic brilliance with minimal bow-tie effect and pointed French tip faceting.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_pr_003",
        stockNumber: "MD-PEAR-185",
        shape: "Pear",
        carat: 1.85,
        color: "D",
        clarity: "VS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "6224810924",
        dimensions: "10.45 x 6.82 x 4.25 mm",
        pricePerCarat: 6800,
        totalPrice: 12580,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
        description: "Graceful teardrop Pear cut diamond offering exquisite curvature, radiant shoulder facets, and exceptional table balance.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_prn_004",
        stockNumber: "MD-PRN-250",
        shape: "Princess",
        carat: 2.50,
        color: "F",
        clarity: "VVS2",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "5210982341",
        dimensions: "7.45 x 7.41 x 5.22 mm",
        pricePerCarat: 7500,
        totalPrice: 18750,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        description: "Contemporary square Princess cut with crisp 90-degree corners and intricate cross-brilliant pavilion facets.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_emr_005",
        stockNumber: "MD-EMR-310",
        shape: "Emerald",
        carat: 3.10,
        color: "D",
        clarity: "IF",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "1198472910",
        dimensions: "9.85 x 6.95 x 4.70 mm",
        pricePerCarat: 11500,
        totalPrice: 35650,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
        description: "Museum-grade Internally Flawless Emerald cut stone with hall-of-mirrors step faceting and pristine transparency.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_csh_006",
        stockNumber: "MD-CSH-175",
        shape: "Cushion",
        carat: 1.75,
        color: "E",
        clarity: "VS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "Faint",
        lab: "IGI",
        certificateNo: "748920193",
        dimensions: "7.15 x 6.98 x 4.60 mm",
        pricePerCarat: 6200,
        totalPrice: 10850,
        isAvailable: true,
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
        description: "Romantic antique-inspired Cushion modified brilliant cut with pillowed curved corners and crushed-ice scintillation.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_ovl_007",
        stockNumber: "MD-OVL-220",
        shape: "Oval",
        carat: 2.20,
        color: "D",
        clarity: "VVS1",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "2198402915",
        dimensions: "10.35 x 7.15 x 4.45 mm",
        pricePerCarat: 8900,
        totalPrice: 19580,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
        description: "Highly sought-after modern Oval cut diamond with a 1.45 ratio, zero dark bow-tie extinction, and finger-flattering silhouette.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_rad_008",
        stockNumber: "MD-RAD-190",
        shape: "Radiant",
        carat: 1.90,
        color: "F",
        clarity: "VS2",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "IGI",
        certificateNo: "639201847",
        dimensions: "7.85 x 6.40 x 4.30 mm",
        pricePerCarat: 5900,
        totalPrice: 11210,
        isAvailable: true,
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
        description: "Cut-corner rectangular Radiant stone delivering maximum fiery flash combined with the architectural profile of an emerald cut.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_hrt_009",
        stockNumber: "MD-HRT-130",
        shape: "Heart",
        carat: 1.30,
        color: "E",
        clarity: "VVS2",
        cut: "Very Good",
        polish: "Excellent",
        symmetry: "Very Good",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "3389102948",
        dimensions: "6.90 x 7.10 x 4.10 mm",
        pricePerCarat: 6400,
        totalPrice: 8320,
        isAvailable: true,
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
        description: "Precision-sculpted Heart shape gem featuring a distinct romantic cleft, identical rounded lobes, and sharp point.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_asc_010",
        stockNumber: "MD-ASC-215",
        shape: "Asscher",
        carat: 2.15,
        color: "D",
        clarity: "VVS1",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "4491028471",
        dimensions: "7.30 x 7.28 x 4.95 mm",
        pricePerCarat: 9400,
        totalPrice: 20210,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        description: "Square Royal Asscher cut with windmill pavilion pattern, high crown angles, and hypnotic geometric symmetry.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const inquiries: Inquiry[] = [
      {
        id: "inq_1001",
        inquiryNumber: "INQ-2026-001",
        userId: "usr_buyer_001",
        customerName: "Rajesh Parekh",
        customerPhone: "+91 98980 54321",
        customerEmail: "buyer@jewelers.com",
        status: "QUOTED",
        targetCarat: 1.52,
        targetShape: "Round",
        targetBudget: "$12,000 - $13,000",
        diamondId: "dia_rnd_001",
        diamondStockNumber: "MD-RND-152",
        notes: "Interested in export batch of Triple-Ex D VVS1 Round diamonds with GIA dossier.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: now,
      },
      {
        id: "inq_1002",
        inquiryNumber: "INQ-2026-002",
        customerName: "Amit Shah (Dubai Gems)",
        customerPhone: "+971 50 123 4567",
        customerEmail: "amit@dubaigems.ae",
        status: "NEW",
        targetCarat: 2.2,
        targetShape: "Oval",
        targetBudget: "$18,000 - $20,000",
        diamondId: "dia_ovl_007",
        diamondStockNumber: "MD-OVL-220",
        notes: "Need fast quotation for Dubai shipment with Kimberley certification.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: now,
      },
    ];

    const qrScans: QRScanRecord[] = [
      {
        id: "scn_001",
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        ipAddress: "127.0.0.1",
        deviceType: "mobile",
        userAgent: "iPhone 15 Pro / Safari",
      },
      {
        id: "scn_002",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        ipAddress: "127.0.0.1",
        deviceType: "mobile",
        userAgent: "Samsung Galaxy S24 / Chrome",
      },
      {
        id: "scn_003",
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        ipAddress: "127.0.0.1",
        deviceType: "desktop",
        userAgent: "MacBook Pro / Chrome",
      },
    ];

    return {
      users,
      diamonds,
      inquiries,
      profile,
      qrScans,
    };
  }

  // --- USER OPERATIONS ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.users.push(newUser);
    this.persist(this.data);
    return newUser;
  }

  // --- DIAMOND INVENTORY OPERATIONS ---
  public getDiamonds(filters?: {
    shape?: string;
    minCarat?: number;
    maxCarat?: number;
    color?: string;
    clarity?: string;
    search?: string;
    featuredOnly?: boolean;
  }): Diamond[] {
    let result = [...this.data.diamonds];

    if (filters) {
      if (filters.shape && filters.shape !== "All") {
        result = result.filter(
          (d) => d.shape.toLowerCase() === filters.shape!.toLowerCase()
        );
      }
      if (filters.minCarat !== undefined) {
        result = result.filter((d) => d.carat >= filters.minCarat!);
      }
      if (filters.maxCarat !== undefined) {
        result = result.filter((d) => d.carat <= filters.maxCarat!);
      }
      if (filters.color && filters.color !== "All") {
        result = result.filter((d) => d.color.toUpperCase() === filters.color!.toUpperCase());
      }
      if (filters.clarity && filters.clarity !== "All") {
        result = result.filter(
          (d) => d.clarity.toUpperCase() === filters.clarity!.toUpperCase()
        );
      }
      if (filters.featuredOnly) {
        result = result.filter((d) => d.isFeatured);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (d) =>
            d.stockNumber.toLowerCase().includes(q) ||
            d.shape.toLowerCase().includes(q) ||
            d.certificateNo.toLowerCase().includes(q) ||
            d.color.toLowerCase().includes(q) ||
            d.clarity.toLowerCase().includes(q)
        );
      }
    }

    return result;
  }

  public getDiamondById(id: string): Diamond | undefined {
    return this.data.diamonds.find((d) => d.id === id);
  }

  public createDiamond(diamond: Omit<Diamond, "id" | "createdAt" | "updatedAt">): Diamond {
    const now = new Date().toISOString();
    const newDiamond: Diamond = {
      ...diamond,
      id: `dia_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.diamonds.unshift(newDiamond);
    this.persist(this.data);
    return newDiamond;
  }

  public updateDiamond(id: string, updates: Partial<Diamond>): Diamond | null {
    const index = this.data.diamonds.findIndex((d) => d.id === id);
    if (index === -1) return null;

    this.data.diamonds[index] = {
      ...this.data.diamonds[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist(this.data);
    return this.data.diamonds[index];
  }

  public deleteDiamond(id: string): boolean {
    const initialLen = this.data.diamonds.length;
    this.data.diamonds = this.data.diamonds.filter((d) => d.id !== id);
    if (this.data.diamonds.length !== initialLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- INQUIRY OPERATIONS ---
  public getInquiries(userId?: string): Inquiry[] {
    if (userId) {
      return this.data.inquiries.filter((inq) => inq.userId === userId);
    }
    return [...this.data.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getInquiryById(id: string): Inquiry | undefined {
    return this.data.inquiries.find((inq) => inq.id === id);
  }

  public findInquiryByIdempotency(key: string): Inquiry | undefined {
    if (!key) return undefined;
    return this.data.inquiries.find((inq) => inq.idempotencyKey === key);
  }

  public createInquiry(inquiry: Omit<Inquiry, "id" | "inquiryNumber" | "createdAt" | "updatedAt">): Inquiry {
    const now = new Date().toISOString();
    const seq = this.data.inquiries.length + 1;
    const inquiryNumber = `INQ-2026-${seq.toString().padStart(3, "0")}`;

    const newInq: Inquiry = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      inquiryNumber,
      createdAt: now,
      updatedAt: now,
    };

    this.data.inquiries.unshift(newInq);
    this.persist(this.data);
    return newInq;
  }

  public updateInquiryStatus(id: string, status: Inquiry["status"]): Inquiry | null {
    const index = this.data.inquiries.findIndex((inq) => inq.id === id);
    if (index === -1) return null;

    this.data.inquiries[index].status = status;
    this.data.inquiries[index].updatedAt = new Date().toISOString();
    this.persist(this.data);
    return this.data.inquiries[index];
  }

  // --- BUSINESS PROFILE OPERATIONS ---
  public getProfile(): BusinessProfile {
    return this.data.profile;
  }

  public updateProfile(updates: Partial<BusinessProfile>): BusinessProfile {
    this.data.profile = {
      ...this.data.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist(this.data);
    return this.data.profile;
  }

  // --- QR SCANS & ANALYTICS ---
  public recordQRScan(record: Omit<QRScanRecord, "id" | "timestamp">): QRScanRecord {
    const scan: QRScanRecord = {
      ...record,
      id: `scn_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.qrScans.push(scan);
    this.persist(this.data);
    return scan;
  }

  public getStats() {
    const totalDiamonds = this.data.diamonds.length;
    const totalInquiries = this.data.inquiries.length;
    const pendingInquiries = this.data.inquiries.filter((i) => i.status === "NEW").length;
    const totalScans = this.data.qrScans.length;

    // Group inquiries by shape
    const shapeBreakdown: Record<string, number> = {};
    for (const inq of this.data.inquiries) {
      const shape = inq.targetShape || "Custom";
      shapeBreakdown[shape] = (shapeBreakdown[shape] || 0) + 1;
    }

    return {
      totalDiamonds,
      totalInquiries,
      pendingInquiries,
      totalScans,
      shapeBreakdown,
      recentScans: this.data.qrScans.slice(-10).reverse(),
    };
  }
}

