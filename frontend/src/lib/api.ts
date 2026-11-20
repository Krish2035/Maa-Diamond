import { Diamond, Inquiry, BusinessProfile, User } from "./types";

export function getApiBaseUrl(): string {
  // 1. If running in browser on a production domain (e.g. Vercel)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      if (
        process.env.NEXT_PUBLIC_API_URL &&
        !process.env.NEXT_PUBLIC_API_URL.includes("localhost") &&
        !process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1")
      ) {
        const trimmed = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
        return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
      }
      return "https://maa-diamond.onrender.com/api";
    }
  }

  // 2. If NEXT_PUBLIC_API_URL is configured in environment
  if (process.env.NEXT_PUBLIC_API_URL) {
    const trimmed = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // 3. Next.js production build / SSR default
  if (process.env.NODE_ENV === "production") {
    return "https://maa-diamond.onrender.com/api";
  }

  // 4. Default for local development
  return "http://localhost:5000/api";
}

export const API_BASE_URL = getApiBaseUrl();

export const FALLBACK_DIAMONDS: Diamond[] = [
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
    imageUrl: "/diamonds/round.jpg",
    videoUrl: "/videos/Round-diamond.mp4",
    description: "Triple Excellent GIA-certified Round Brilliant cut diamond exhibiting flawless symmetry, Hearts & Arrows dispersion, and zero fluorescence on luxury black pedestal.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.126Z",
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
    imageUrl: "/diamonds/pear.jpg",
    videoUrl: "/videos/Pear-diamond.mp4",
    description: "Graceful teardrop Pear cut diamond offering exquisite curvature, radiant shoulder facets, and exceptional table balance on velvet black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/marquise.jpg",
    videoUrl: "/videos/Marquise-diamond.mp4",
    description: "Royal Marquise (Marques) cut diamond showcasing majestic brilliance with minimal bow-tie effect and pointed French tip faceting.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/oval.jpg",
    videoUrl: "/videos/Oval-diamond.mp4",
    description: "Modern Oval cut diamond exhibiting optimal facet fire, zero bow-tie effect, and exceptional optical brilliance on black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/cushion.jpg",
    videoUrl: "/videos/Cushion-diamond.mp4",
    description: "Romantic antique-inspired Cushion modified brilliant cut with pillowed curved corners and crushed-ice scintillation on black.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/princess.jpg",
    videoUrl: "/videos/Princess-diamond.mp4",
    description: "Contemporary square Princess cut with crisp 90-degree corners and intricate cross-brilliant pavilion facets on black backdrop.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
  },
  {
    id: "dia_trp_007",
    stockNumber: "MD-TRP-140",
    shape: "Trapezoid",
    carat: 1.40,
    color: "E",
    clarity: "VVS1",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    lab: "GIA",
    certificateNo: "8821903412",
    dimensions: "7.80 x 5.20 x 3.65 mm",
    pricePerCarat: 6900,
    totalPrice: 9660,
    isAvailable: true,
    isFeatured: true,
    imageUrl: "/diamonds/trapezoid.jpg",
    videoUrl: "/videos/Trapezoid-diamond.mp4",
    description: "Geometric Trapezoid cut diamond offering sleek architectural proportions, tapered symmetry, and mirror-like facet reflection on black.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
  },
  {
    id: "dia_trg_008",
    stockNumber: "MD-TRG-160",
    shape: "Triangle",
    carat: 1.60,
    color: "D",
    clarity: "VVS2",
    cut: "Ideal",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    lab: "IGI",
    certificateNo: "9102834190",
    dimensions: "8.10 x 8.10 x 4.15 mm",
    pricePerCarat: 7200,
    totalPrice: 11520,
    isAvailable: true,
    isFeatured: true,
    imageUrl: "/diamonds/triangle.jpg",
    videoUrl: "/videos/Triangle-diamond.mp4",
    description: "Equilateral Triangle cut diamond delivering sharp vertices, intense internal fire, and exquisite optical dispersion on black velvet.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
  },
  {
    id: "dia_trl_009",
    stockNumber: "MD-TRL-190",
    shape: "Trillion",
    carat: 1.90,
    color: "F",
    clarity: "VS1",
    cut: "Excellent",
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
    imageUrl: "/diamonds/trillion.jpg",
    videoUrl: "/videos/Trillion-diamond.mp4",
    description: "Curved-edge Trillion brilliant diamond with soft contour sides, high crown angle, and brilliant dispersion on luxury dark studio.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/baguette.jpg",
    videoUrl: "/videos/Baguette-diamond.mp4",
    description: "Internally Flawless Baguette step-cut diamond with clean parallel facets, hall-of-mirrors clarity, and timeless elegance on black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
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
    imageUrl: "/diamonds/rosecut.jpg",
    videoUrl: "/videos/Rosecut-diamond.mp4",
    description: "Antique heritage Rose Cut diamond with a flat base and domed faceted top resembling an opening rosebud on deep black luxury velvet.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-17T16:53:39.128Z",
  },
];

class ApiClient {
  public get baseUrl(): string {
    return getApiBaseUrl();
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("maa_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // --- DIAMONDS ---
  async getDiamonds(params?: {
    shape?: string;
    minCarat?: number;
    maxCarat?: number;
    color?: string;
    clarity?: string;
    search?: string;
    featured?: boolean;
  }): Promise<{ total: number; diamonds: Diamond[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.shape) query.append("shape", params.shape);
      if (params?.minCarat !== undefined) query.append("minCarat", params.minCarat.toString());
      if (params?.maxCarat !== undefined) query.append("maxCarat", params.maxCarat.toString());
      if (params?.color) query.append("color", params.color);
      if (params?.clarity) query.append("clarity", params.clarity);
      if (params?.search) query.append("search", params.search);
      if (params?.featured) query.append("featured", "true");

      // In browser, load diamonds instantly from local Next.js route (/api/diamonds) which serves the 11 verified black-background diamond cuts
      const targetUrl = typeof window !== "undefined" ? "/api/diamonds" : `${this.baseUrl}/diamonds`;
      const res = await fetch(`${targetUrl}?${query.toString()}`, {
        headers: this.getHeaders(),
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch diamonds");
      const data = await res.json();
      if (data && Array.isArray(data.diamonds) && data.diamonds.length > 0) {
        const validShapes = new Set(FALLBACK_DIAMONDS.map((d) => d.shape.toLowerCase()));
        const cleanDiamonds = data.diamonds
          .filter((d: Diamond) => validShapes.has(d.shape.toLowerCase()))
          .map((d: Diamond) => {
            const fallback = FALLBACK_DIAMONDS.find((fb) => fb.shape.toLowerCase() === d.shape.toLowerCase());
            return {
              ...d,
              imageUrl: fallback ? fallback.imageUrl : d.imageUrl,
              videoUrl: fallback ? fallback.videoUrl : d.videoUrl,
            };
          });
        return { total: cleanDiamonds.length, diamonds: cleanDiamonds };
      }
      return data;
    } catch (err) {
      console.warn("Backend API offline or unreachable, using FALLBACK_DIAMONDS store:", err);
      let list = [...FALLBACK_DIAMONDS];
      if (params?.shape && params.shape !== "All") {
        list = list.filter((d) => d.shape.toLowerCase() === params.shape!.toLowerCase());
      }
      if (params?.color && params.color !== "All") {
        list = list.filter((d) => d.color.toUpperCase() === params.color!.toUpperCase());
      }
      if (params?.clarity && params.clarity !== "All") {
        list = list.filter((d) => d.clarity.toUpperCase() === params.clarity!.toUpperCase());
      }
      if (params?.minCarat !== undefined) {
        list = list.filter((d) => d.carat >= params.minCarat!);
      }
      if (params?.maxCarat !== undefined) {
        list = list.filter((d) => d.carat <= params.maxCarat!);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (d) =>
            d.stockNumber.toLowerCase().includes(q) ||
            d.shape.toLowerCase().includes(q) ||
            d.certificateNo.toLowerCase().includes(q)
        );
      }
      if (params?.featured) {
        list = list.filter((d) => d.isFeatured);
      }
      return { total: list.length, diamonds: list };
    }
  }

  async getDiamondById(id: string): Promise<Diamond | null> {
    try {
      const res = await fetch(`${this.baseUrl}/diamonds/${id}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load diamond");
      const data = await res.json();
      return data.diamond;
    } catch {
      return FALLBACK_DIAMONDS.find((d) => d.id === id || d.stockNumber === id) || null;
    }
  }

  async createDiamond(diamond: Partial<Diamond>): Promise<Diamond> {
    const res = await fetch(`${this.baseUrl}/diamonds`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(diamond),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create diamond");
    }
    const data = await res.json();
    return data.diamond;
  }

  async updateDiamond(id: string, updates: Partial<Diamond>): Promise<Diamond> {
    const res = await fetch(`${this.baseUrl}/diamonds/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update diamond");
    }
    const data = await res.json();
    return data.diamond;
  }

  async deleteDiamond(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/diamonds/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return res.ok;
  }

  // --- BUSINESS PROFILE & VCARD ---
  async getProfile(): Promise<BusinessProfile | null> {
    try {
      const res = await fetch(`${this.baseUrl}/profile`, {
        headers: this.getHeaders(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      return data.profile;
    } catch {
      // Fallback default profile
      return {
        id: "default",
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
        aboutText:
          "With over three decades of lapidary mastery, Maa Diamond stands as a premier manufacturer and global purveyor of certified natural and high-clarity diamonds.",
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async updateProfile(updates: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch(`${this.baseUrl}/profile`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const data = await res.json();
    return data.profile;
  }

  async getQRCodeDataUrl(targetUrl?: string): Promise<string> {
    try {
      const query = targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : "";
      const res = await fetch(`${this.baseUrl}/vcard/qr${query}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.dataUrl;
    } catch {
      // Return empty or fallback
      return "";
    }
  }

  async logQRScan(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/vcard/scan`, {
        method: "POST",
        headers: this.getHeaders(),
      });
    } catch {}
  }

  // --- INQUIRIES & RFQs ---
  async submitInquiry(inquiry: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    targetCarat?: number;
    targetShape?: string;
    targetBudget?: string;
    diamondId?: string;
    diamondStockNumber?: string;
    notes?: string;
    idempotencyKey?: string;
    userId?: string;
  }): Promise<Inquiry> {
    const res = await fetch(`${this.baseUrl}/inquiries`, {
      method: "POST",
      headers: this.getHeaders({
        ...(inquiry.idempotencyKey ? { "X-Idempotency-Key": inquiry.idempotencyKey } : {}),
      }),
      body: JSON.stringify(inquiry),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit inquiry");
    }
    const data = await res.json();
    return data.inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const res = await fetch(`${this.baseUrl}/inquiries`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load inquiries");
    const data = await res.json();
    return data.inquiries;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const res = await fetch(`${this.baseUrl}/inquiries/${id}/status`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    const data = await res.json();
    return data.inquiry;
  }

  // --- STATS ---
  async getStats(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load analytics");
    return await res.json();
  }
}

export const api = new ApiClient();

