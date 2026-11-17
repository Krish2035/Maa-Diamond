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
        building: "217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha",
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
        imageUrl: "/diamonds/round-black-bg.png",
        videoUrl: "/videos/round-360.webm",
        description: "Triple Excellent GIA-certified Round Brilliant loose diamond on luxury black display, showing flawless symmetry and Hearts & Arrows dispersion.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_pr_002",
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
        imageUrl: "/diamonds/pear-black-bg.png",
        videoUrl: "/videos/pear-360.webm",
        description: "Graceful teardrop Pear cut loose diamond with radiant shoulder facets and scintillating fire on velvet black background.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_mrq_003",
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
        imageUrl: "/diamonds/marquise-black-bg.png",
        videoUrl: "/videos/marquise-360.webm",
        description: "Royal Marquise (Marques) cut diamond showcasing elongated brilliance with pointed French tip faceting on pure black studio pedestal.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_ovl_004",
        stockNumber: "MD-OVL-170",
        shape: "Oval",
        carat: 1.70,
        color: "D",
        clarity: "VVS1",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "2198402915",
        dimensions: "9.85 x 6.95 x 4.35 mm",
        pricePerCarat: 7800,
        totalPrice: 13260,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/oval-black-bg.png",
        videoUrl: "/videos/oval-360.webm",
        description: "Modern Oval cut diamond exhibiting optimal facet fire, zero bow-tie effect, and exceptional optical brilliance on black background.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_csh_005",
        stockNumber: "MD-CSH-210",
        shape: "Cushion",
        carat: 2.10,
        color: "E",
        clarity: "VS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "Faint",
        lab: "IGI",
        certificateNo: "748920193",
        dimensions: "7.85 x 7.60 x 5.10 mm",
        pricePerCarat: 6500,
        totalPrice: 13650,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/cushion-black-bg.png",
        videoUrl: "/videos/cushion-360.webm",
        description: "Romantic antique-inspired Cushion modified brilliant cut with pillowed curved corners and crushed-ice scintillation on black.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_prn_006",
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
        imageUrl: "/diamonds/princess-black-bg.png",
        videoUrl: "/videos/princess-360.webm",
        description: "Contemporary square Princess cut with crisp 90-degree corners, cross-brilliant pavilion facets, and sharp sparkle.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_tpz_007",
        stockNumber: "MD-TPZ-160",
        shape: "Trapezoid",
        carat: 1.60,
        color: "D",
        clarity: "VVS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "IGI",
        certificateNo: "8821940192",
        dimensions: "8.10 x 5.20 x 3.60 mm",
        pricePerCarat: 6900,
        totalPrice: 11040,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/trapezoid-black-bg.png",
        videoUrl: "/videos/trapezoid-360.webm",
        description: "Precision-faceted Trapezoid cut diamond ideal as distinctive side stone or striking center solitaire with tapered step facets on black.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_tri_008",
        stockNumber: "MD-TRI-145",
        shape: "Triangle",
        carat: 1.45,
        color: "E",
        clarity: "VS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "9102847192",
        dimensions: "7.60 x 7.60 x 3.80 mm",
        pricePerCarat: 6200,
        totalPrice: 8990,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/triangle-black-bg.png",
        videoUrl: "/videos/triangle-360.webm",
        description: "Sharp straight-edge equilateral Triangle cut diamond delivering bold geometry, crisp angles, and extraordinary brilliance on black.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_trl_009",
        stockNumber: "MD-TRL-190",
        shape: "Trillion",
        carat: 1.90,
        color: "D",
        clarity: "VVS2",
        cut: "Ideal",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "7721098432",
        dimensions: "8.90 x 8.75 x 4.40 mm",
        pricePerCarat: 6700,
        totalPrice: 12730,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/trillion-black-bg.png",
        videoUrl: "/videos/trillion-360.webm",
        description: "Curved-edge Trillion brilliant diamond with soft contour sides, high crown angle, and brilliant dispersion on luxury dark studio.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_bgt_010",
        stockNumber: "MD-BGT-125",
        shape: "Baguette",
        carat: 1.25,
        color: "D",
        clarity: "IF",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "GIA",
        certificateNo: "6612984109",
        dimensions: "7.95 x 4.10 x 2.85 mm",
        pricePerCarat: 8100,
        totalPrice: 10125,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/baguette-black-bg.png",
        videoUrl: "/videos/baguette-360.webm",
        description: "Internally Flawless Baguette step-cut diamond with clean parallel facets, hall-of-mirrors clarity, and timeless elegance on black background.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "dia_rse_011",
        stockNumber: "MD-RSE-175",
        shape: "Rose Cut",
        carat: 1.75,
        color: "E",
        clarity: "VVS1",
        cut: "Excellent",
        polish: "Excellent",
        symmetry: "Excellent",
        fluorescence: "None",
        lab: "IGI",
        certificateNo: "5519820391",
        dimensions: "8.40 x 8.40 x 3.10 mm",
        pricePerCarat: 7400,
        totalPrice: 12950,
        isAvailable: true,
        isFeatured: true,
        imageUrl: "/diamonds/rosecut-black-bg.png",
        videoUrl: "/videos/rosecut-360.webm",
        description: "Antique heritage Rose Cut diamond with a flat base and domed faceted top resembling an opening rosebud on deep black luxury velvet.",
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

