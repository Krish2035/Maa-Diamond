import { Diamond, Inquiry, BusinessProfile, User } from "./types";

const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = rawUrl.endsWith("/api")
  ? rawUrl
  : `${rawUrl.replace(/\/$/, "")}/api`;

class ApiClient {
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

      const res = await fetch(`${API_BASE_URL}/diamonds?${query.toString()}`, {
        headers: this.getHeaders(),
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch diamonds");
      return await res.json();
    } catch (err) {
      console.warn("Backend API offline or unreachable, using local mock store:", err);
      return { total: 0, diamonds: [] };
    }
  }

  async getDiamondById(id: string): Promise<Diamond | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/diamonds/${id}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.diamond;
    } catch {
      return null;
    }
  }

  async createDiamond(diamond: Partial<Diamond>): Promise<Diamond> {
    const res = await fetch(`${API_BASE_URL}/diamonds`, {
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
    const res = await fetch(`${API_BASE_URL}/diamonds/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/diamonds/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return res.ok;
  }

  // --- BUSINESS PROFILE & VCARD ---
  async getProfile(): Promise<BusinessProfile | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
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
            name: "Haresh Bhai Patel",
            designation: "Founder & Master Craftsman",
            phone: "+91 98250 88991",
            whatsapp: "919825088991",
          },
          {
            name: "Ketan Patel",
            designation: "Director - International Trade",
            phone: "+91 98790 11223",
            whatsapp: "919879011223",
          },
        ],
        primaryEmail: "info@maadiamond.com",
        salesEmail: "inquiry@maadiamond.com",
        websiteUrl: "http://localhost:3000",
        cardUrl: "http://localhost:3000/card",
        address: {
          building: "Tower-D, Office 602, Surat Diamond Bourse",
          street: "Khajod",
          city: "Surat",
          state: "Gujarat",
          country: "India",
          pincode: "395007",
        },
        googleMapsUrl: "https://maps.google.com/?q=Surat+Diamond+Bourse+Gujarat",
        instagramUrl: "https://instagram.com/maadiamond_official",
        aboutText:
          "With over three decades of lapidary mastery, Maa Diamond stands as a premier manufacturer and global purveyor of certified natural and high-clarity diamonds.",
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async updateProfile(updates: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
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
      const res = await fetch(`${API_BASE_URL}/vcard/qr${query}`);
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
      await fetch(`${API_BASE_URL}/vcard/scan`, {
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
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
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
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load inquiries");
    const data = await res.json();
    return data.inquiries;
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
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
    const res = await fetch(`${API_BASE_URL}/stats`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load analytics");
    return await res.json();
  }
}

export const api = new ApiClient();

