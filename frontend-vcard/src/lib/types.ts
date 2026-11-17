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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
}

export interface Inquiry {
  id?: string;
  inquiryNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  targetShape: DiamondShape;
  targetCarat?: string;
  targetBudget?: string;
  notes?: string;
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
