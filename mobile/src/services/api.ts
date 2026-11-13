import { Diamond, BusinessProfile, Inquiry } from "../types";

// When testing on a physical phone via USB cable:
// Run 'adb reverse tcp:5000 tcp:5000' in Antigravity so phone can reach laptop's backend directly over USB!
// Also supports Render cloud deployment URL as fallback.
export const BASE_API_URL = "http://localhost:5000/api";
export const BACKUP_API_URL = "https://maa-diamond.onrender.com/api";

const FALLBACK_PROFILE: BusinessProfile = {
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

export const api = {
  async getDiamonds(shape?: string): Promise<Diamond[]> {
    const url = shape && shape !== "All"
      ? `${BASE_API_URL}/diamonds?shape=${encodeURIComponent(shape)}`
      : `${BASE_API_URL}/diamonds`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.diamonds || [];
      }
    } catch {
      // Try backup cloud URL if local backend not reachable
      try {
        const backupUrl = shape && shape !== "All"
          ? `${BACKUP_API_URL}/diamonds?shape=${encodeURIComponent(shape)}`
          : `${BACKUP_API_URL}/diamonds`;
        const res = await fetch(backupUrl);
        if (res.ok) {
          const data = await res.json();
          return data.diamonds || [];
        }
      } catch (e) {
        console.warn("Failed to fetch diamonds from both local and cloud backend:", e);
      }
    }
    return [];
  },

  async getProfile(): Promise<BusinessProfile> {
    try {
      const res = await fetch(`${BASE_API_URL}/business/profile`);
      if (res.ok) {
        const data = await res.json();
        return data.profile || FALLBACK_PROFILE;
      }
    } catch {
      try {
        const res = await fetch(`${BACKUP_API_URL}/business/profile`);
        if (res.ok) {
          const data = await res.json();
          return data.profile || FALLBACK_PROFILE;
        }
      } catch {}
    }
    return FALLBACK_PROFILE;
  },

  async submitInquiry(inquiry: Partial<Inquiry>): Promise<any> {
    const payload = JSON.stringify(inquiry);
    try {
      const res = await fetch(`${BASE_API_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      if (res.ok) return await res.json();
    } catch {}

    const res2 = await fetch(`${BACKUP_API_URL}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    return await res2.json();
  },
};
