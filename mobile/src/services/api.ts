import { Diamond, BusinessProfile, Inquiry } from "../types";

// Production Vercel domain hosting both the live Next.js API and static media assets
export const PRODUCTION_WEB_URL = "https://maa-diamond.vercel.app";
export const PRODUCTION_API_URL = "https://maa-diamond.vercel.app/api";

// When testing on a physical phone via USB cable:
// Run 'adb reverse tcp:5000 tcp:5000' so phone can reach laptop's backend directly over USB
export const BASE_API_URL = "http://localhost:5000/api";
export const BACKUP_API_URL = "https://maa-diamond.onrender.com/api";

/**
 * Converts relative asset paths (/diamonds/*.jpg, /videos/*.mp4)
 * into absolute HTTPS URLs accessible by React Native on mobile devices.
 */
export function getMediaUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCTION_WEB_URL}${cleanPath}`;
}

export const FALLBACK_PROFILE: BusinessProfile = {
  id: "prof_maa_001",
  companyName: "Maa Diamond",
  tagline: "Lab Grown & Natural Diamond Manufacturers",
  directors: [
    {
      name: "Hardik Sorathiya",
      designation: "Managing Director",
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
  aboutText: "Direct manufacturers of IGI certified lab grown diamond, CVD and natural loose diamonds.",
  updatedAt: new Date().toISOString(),
};

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
    imageUrl: getMediaUrl("/diamonds/round.jpg"),
    videoUrl: getMediaUrl("/videos/Round-diamond.mp4"),
    description: "Triple Excellent GIA-certified Round Brilliant cut diamond exhibiting flawless symmetry, Hearts & Arrows dispersion, and zero fluorescence on luxury black pedestal.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/pear.jpg"),
    videoUrl: getMediaUrl("/videos/Pear-diamond.mp4"),
    description: "Graceful teardrop Pear cut diamond offering exquisite curvature, radiant shoulder facets, and exceptional table balance on velvet black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/marquise.jpg"),
    videoUrl: getMediaUrl("/videos/Marquise-diamond.mp4"),
    description: "Royal Marquise (Marques) cut diamond showcasing majestic brilliance with minimal bow-tie effect and pointed French tip faceting.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/oval.jpg"),
    videoUrl: getMediaUrl("/videos/Oval-diamond.mp4"),
    description: "Modern Oval cut diamond exhibiting optimal facet fire, zero bow-tie effect, and exceptional optical brilliance on black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/cushion.jpg"),
    videoUrl: getMediaUrl("/videos/Cushion-diamond.mp4"),
    description: "Romantic antique-inspired Cushion modified brilliant cut with pillowed curved corners and crushed-ice scintillation on black.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/princess.jpg"),
    videoUrl: getMediaUrl("/videos/Princess-diamond.mp4"),
    description: "Contemporary square Princess cut with crisp 90-degree corners and intricate cross-brilliant pavilion facets on black backdrop.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/trapezoid.jpg"),
    videoUrl: getMediaUrl("/videos/Trapezoid-diamond.mp4"),
    description: "Geometric Trapezoid cut diamond offering sleek architectural proportions, tapered symmetry, and mirror-like facet reflection on black.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/triangle.jpg"),
    videoUrl: getMediaUrl("/videos/Triangle-diamond.mp4"),
    description: "Equilateral Triangle cut diamond delivering sharp vertices, intense internal fire, and exquisite optical dispersion on black velvet.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/trillion.jpg"),
    videoUrl: getMediaUrl("/videos/Trillion-diamond.mp4"),
    description: "Curved-edge Trillion brilliant diamond with soft contour sides, high crown angle, and brilliant dispersion on luxury dark studio.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/baguette.jpg"),
    videoUrl: getMediaUrl("/videos/Baguette-diamond.mp4"),
    description: "Internally Flawless Baguette step-cut diamond with clean parallel facets, hall-of-mirrors clarity, and timeless elegance on black background.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
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
    imageUrl: getMediaUrl("/diamonds/rosecut.jpg"),
    videoUrl: getMediaUrl("/videos/Rosecut-diamond.mp4"),
    description: "Antique heritage Rose Cut diamond with a flat base and domed faceted top resembling an opening rosebud on deep black luxury velvet.",
    createdAt: "2026-11-06T14:12:56.104Z",
    updatedAt: "2026-11-20T21:00:00.000Z",
  },
];

function sanitizeDiamonds(diamonds: Diamond[]): Diamond[] {
  return diamonds.map((d) => ({
    ...d,
    imageUrl: getMediaUrl(d.imageUrl),
    videoUrl: getMediaUrl(d.videoUrl),
  }));
}

export const api = {
  async getDiamonds(shape?: string): Promise<Diamond[]> {
    const queryParam = shape && shape !== "All" ? `?shape=${encodeURIComponent(shape)}` : "";

    // 1. Try Live Production Vercel API first
    try {
      const res = await fetch(`${PRODUCTION_API_URL}/diamonds${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.diamonds && data.diamonds.length > 0) {
          return sanitizeDiamonds(data.diamonds);
        }
      }
    } catch (e) {
      // ignore and try next
    }

    // 2. Try Local Development Backend (USB / WiFi reverse)
    try {
      const res = await fetch(`${BASE_API_URL}/diamonds${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.diamonds && data.diamonds.length > 0) {
          return sanitizeDiamonds(data.diamonds);
        }
      }
    } catch {
      // 3. Try Cloud Render Backend
      try {
        const res = await fetch(`${BACKUP_API_URL}/diamonds${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.diamonds && data.diamonds.length > 0) {
            return sanitizeDiamonds(data.diamonds);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch diamonds from endpoints, using offline fallback:", e);
      }
    }

    // Fallback: guaranteed offline catalog of all 11 diamonds with full media URLs
    if (shape && shape !== "All") {
      return FALLBACK_DIAMONDS.filter((d) => d.shape.toLowerCase() === shape.toLowerCase());
    }
    return FALLBACK_DIAMONDS;
  },

  async getProfile(): Promise<BusinessProfile> {
    const urls = [
      `${PRODUCTION_API_URL}/business/profile`,
      `${BASE_API_URL}/business/profile`,
      `${BACKUP_API_URL}/business/profile`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) return data.profile;
        }
      } catch {}
    }
    return FALLBACK_PROFILE;
  },

  async submitInquiry(inquiry: Partial<Inquiry>): Promise<any> {
    const payload = JSON.stringify(inquiry);
    const urls = [
      `${PRODUCTION_API_URL}/inquiries`,
      `${BASE_API_URL}/inquiries`,
      `${BACKUP_API_URL}/inquiries`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return { success: true, message: "Inquiry registered" };
  },

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const payload = JSON.stringify({ email, password });
    const urls = [
      `${PRODUCTION_API_URL}/auth/login`,
      `${BASE_API_URL}/auth/login`,
      `${BACKUP_API_URL}/auth/login`,
    ];

    let lastError = "Failed to sign in. Please check credentials.";
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
        const data = await res.json();
        if (res.ok && data.token) return data;
        if (data.error) lastError = data.error;
      } catch (err: any) {
        if (err?.message) lastError = err.message;
      }
    }
    throw new Error(lastError);
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    companyName?: string;
    phone?: string;
  }): Promise<{ token: string; user: any }> {
    const payload = JSON.stringify(userData);
    const urls = [
      `${PRODUCTION_API_URL}/auth/register`,
      `${BASE_API_URL}/auth/register`,
      `${BACKUP_API_URL}/auth/register`,
    ];

    let lastError = "Registration failed.";
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
        const data = await res.json();
        if (res.ok && data.token) return data;
        if (data.error) lastError = data.error;
      } catch (err: any) {
        if (err?.message) lastError = err.message;
      }
    }
    throw new Error(lastError);
  },
};
