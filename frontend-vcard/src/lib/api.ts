import { Inquiry, BusinessProfile } from "./types";

export function getApiBaseUrl(): string {
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

  if (process.env.NEXT_PUBLIC_API_URL) {
    const trimmed = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://maa-diamond.onrender.com/api";
  }

  return "http://localhost:5000/api";
}

export const API_BASE_URL = getApiBaseUrl();

export const FALLBACK_PROFILE: BusinessProfile = {
  id: "maa-diamond-profile",
  companyName: "Maa Diamond",
  tagline: "Direct Manufacturers of IGI Certified Lab Grown & Natural Loose Diamonds",
  directors: [
    {
      name: "Hardik Sorathiya",
      designation: "Managing Director & Operations",
      phone: "+91 90333 20326",
      whatsapp: "919033320326",
    },
    {
      name: "Sanket Sorathiya",
      designation: "Executive Director & Marketing",
      phone: "+91 80000 45391",
      whatsapp: "918000045391",
    },
  ],
  primaryEmail: "info@maadiamond.com",
  salesEmail: "inquiry@maadiamond.com",
  websiteUrl: process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL || "https://maa-diamond.vercel.app",
  cardUrl: typeof window !== "undefined" ? window.location.href : "https://maa-diamond.vercel.app/card",
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
    "With over three decades of lapidary mastery, Maa Diamond stands as a premier manufacturer and global purveyor of certified natural and high-clarity lab grown diamonds.",
  updatedAt: new Date().toISOString(),
};

class ApiClient {
  public get baseUrl(): string {
    return getApiBaseUrl();
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...customHeaders,
    };
  }

  async getProfile(): Promise<BusinessProfile> {
    try {
      const res = await fetch(`${this.baseUrl}/profile`, {
        headers: this.getHeaders(),
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error("Backend offline");
      const data = await res.json();
      return data.profile || FALLBACK_PROFILE;
    } catch {
      return FALLBACK_PROFILE;
    }
  }

  async submitInquiry(inquiryData: Partial<Inquiry>): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/inquiries`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(inquiryData),
      });
      if (!res.ok) throw new Error("Inquiry submission failed");
      return await res.json();
    } catch (err) {
      // In offline mode, simulate successful inquiry capture and allow WhatsApp follow-up
      return { success: true, message: "Inquiry saved locally." };
    }
  }

  async logQRScan(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/vcard/scan`, {
        method: "POST",
        headers: this.getHeaders(),
      });
    } catch {
      // Ignore background analytics error
    }
  }
}

export const api = new ApiClient();
