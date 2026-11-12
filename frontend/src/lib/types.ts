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
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
}

export interface Diamond {
  id: string;
  stockNumber: string;
  shape: DiamondShape;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  lab: "GIA" | "IGI" | "HRD" | "None";
  certificateNo: string;
  dimensions: string;
  pricePerCarat: number;
  totalPrice: number;
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

