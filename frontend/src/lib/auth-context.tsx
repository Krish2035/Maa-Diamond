"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "./types";

export type Currency = "USD" | "INR" | "EUR" | "AED";

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD (1 USD = rate * Currency)
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  INR: { code: "INR", symbol: "₹", rate: 86.8 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92 },
  AED: { code: "AED", symbol: "AED ", rate: 3.67 },
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; companyName?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  wishlist: string[];
  toggleWishlist: (diamondId: string) => void;
  isInWishlist: (diamondId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    // Restore session and preferences
    try {
      const savedToken = localStorage.getItem("maa_token");
      const savedUser = localStorage.getItem("maa_user");
      const savedCurrency = localStorage.getItem("maa_currency") as Currency;
      const savedWishlist = localStorage.getItem("maa_wishlist");

      if (savedToken && savedUser && savedUser !== "undefined") {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && typeof parsed === "object") {
            setToken(savedToken);
            setUser(parsed);
          }
        } catch {
          localStorage.removeItem("maa_user");
          localStorage.removeItem("maa_token");
        }
      }
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrencyState(savedCurrency);
      }
      if (savedWishlist && savedWishlist !== "undefined") {
        try {
          const parsedWish = JSON.parse(savedWishlist);
          if (Array.isArray(parsedWish)) {
            setWishlist(parsedWish);
          }
        } catch {
          localStorage.removeItem("maa_wishlist");
        }
      }
    } catch (e) {
      console.error("Failed to restore session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("maa_currency", c);
  };

  const formatPrice = (usdPrice: number): string => {
    const curr = CURRENCIES[currency];
    const converted = usdPrice * curr.rate;
    if (currency === "INR") {
      return `${curr.symbol}${converted.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    }
    return `${curr.symbol}${converted.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }

    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("maa_token", data.token);
    localStorage.setItem("maa_user", JSON.stringify(data.user));
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    companyName?: string;
    phone?: string;
  }) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Registration failed");
    }

    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("maa_token", data.token);
    localStorage.setItem("maa_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("maa_token");
    localStorage.removeItem("maa_user");
  };

  const quickDemoLogin = async (role: UserRole) => {
    if (role === "ADMIN") {
      await login("admin@maadiamond.com", "Admin@MaaDiamond2026");
    } else {
      await login("buyer@jewelers.com", "Buyer123!");
    }
  };

  const toggleWishlist = (diamondId: string) => {
    let updated: string[];
    if (wishlist.includes(diamondId)) {
      updated = wishlist.filter((id) => id !== diamondId);
    } else {
      updated = [...wishlist, diamondId];
    }
    setWishlist(updated);
    localStorage.setItem("maa_wishlist", JSON.stringify(updated));
  };

  const isInWishlist = (diamondId: string): boolean => {
    return wishlist.includes(diamondId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        currency,
        setCurrency,
        formatPrice,
        login,
        register,
        logout,
        quickDemoLogin,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

