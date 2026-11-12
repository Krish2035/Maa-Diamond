export type UserRole = "USER" | "ADMIN";

export type DiamondShape =
  | "Round"
  | "Marquise"
  | "Pear"
  | "Princess"
  | "Emerald"
  | "Cushion"
  | "Oval"
  | "Radiant"
  | "Heart"
  | "Asscher";

export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "IN_NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  companyName?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Diamond {
  id: string;
  stockNumber: string;
  shape: DiamondShape;
  carat: number;
  color: string; // D, E, F, G, H, I, J
  clarity: string; // FL, IF, VVS1, VVS2, VS1, VS2, SI1
  cut: string; // Ideal, Excellent, Very Good
  polish: string;
  symmetry: string;
  fluorescence: string;
  lab: "GIA" | "IGI" | "HRD" | "None";
  certificateNo: string;
  dimensions: string; // e.g., 6.50 x 6.52 x 4.01 mm
  pricePerCarat: number; // in USD
  totalPrice: number; // in USD
  isAvailable: boolean;
  isFeatured: boolean;
  imageUrl: string;
  videoUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  inquiryNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: InquiryStatus;
  targetCarat?: number;
  targetShape?: DiamondShape;
  targetBudget?: string;
  diamondId?: string;
  diamondStockNumber?: string;
  notes?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  tagline: string;
  directors: {
    name: string;
    designation: string;
    phone: string;
    whatsapp: string;
  }[];
  primaryEmail: string;
  salesEmail: string;
  websiteUrl: string;
  cardUrl: string;
  address: {
    street: string;
    building: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  brochureUrl?: string;
  aboutText: string;
  updatedAt: string;
}

export interface QRScanRecord {
  id: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: "mobile" | "tablet" | "desktop" | "other";
}

export interface DiamondFilter {
  shape?: string;
  minCarat?: number;
  maxCarat?: number;
  color?: string;
  clarity?: string;
  search?: string;
  featuredOnly?: boolean;
}


