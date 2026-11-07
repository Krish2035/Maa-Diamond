"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gem,
  Heart,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ExternalLink,
  MessageCircle,
  Building,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Diamond, Inquiry } from "@/lib/types";
import DiamondCard from "@/components/DiamondCard";
import InquiryModal from "@/components/InquiryModal";

export default function BuyerPortalPage() {
  const router = useRouter();
  const { user, logout, wishlist, formatPrice } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [wishlistDiamonds, setWishlistDiamonds] = useState<Diamond[]>([]);
  const [activeTab, setActiveTab] = useState<"inquiries" | "wishlist">("inquiries");
  const [isLoading, setIsLoading] = useState(true);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedDiamond, setSelectedDiamond] = useState<Diamond | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const inqs = await api.getInquiries();
      setInquiries(inqs);

      const res = await api.getDiamonds();
      const favs = res.diamonds.filter((d) => wishlist.includes(d.id));
      setWishlistDiamonds(favs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Inquiry["status"]) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
            <Clock className="h-3 w-3" /> Under Review
          </span>
        );
      case "CONTACTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            <AlertCircle className="h-3 w-3" /> Representative Assigned
          </span>
        );
      case "QUOTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
            <Gem className="h-3 w-3 text-emerald-600" /> Official Quote Ready
          </span>
        );
      case "CLOSED_WON":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
            <CheckCircle2 className="h-3 w-3" /> Order Confirmed
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
            {status}
          </span>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Top Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Main Website</span>
          </Link>
        </div>

        {/* User Welcome Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
              <User className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-extrabold text-slate-900">
                  Welcome, {user.name}
                </h1>
                <span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                {user.companyName && (
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Building className="h-3.5 w-3.5 text-amber-600" /> {user.companyName}
                  </span>
                )}
                <span>• {user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "inquiries"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>My Submitted Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "wishlist"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "inquiries" && (
          <div>
            {inquiries.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">No Active Inquiries Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Browse our certified diamond cuts or send a request.
                </p>
                <Link
                  href="/#products"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  <span>Browse Diamond Products</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {inq.inquiryNumber}
                        </span>
                        {getStatusBadge(inq.status)}
                        <span className="text-[11px] text-slate-500 font-medium">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-slate-900">
                        {inq.targetShape || "Custom"} Diamond Parcel • {inq.targetCarat || "Any"} Carat
                      </h4>
                      {inq.notes && (
                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                          {inq.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/919033320326?text=Inquiring%20about%20my%20order%20${inq.inquiryNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp Desk</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            {wishlistDiamonds.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Heart className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Your Wishlist is Empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Tap the heart icon on any diamond in our catalog to save it for quick comparison.
                </p>
                <Link
                  href="/#products"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  <span>Explore Diamond Cuts</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistDiamonds.map((dia) => (
                  <DiamondCard
                    key={dia.id}
                    diamond={dia}
                    onInquire={(d) => {
                      setSelectedDiamond(d);
                      setInquiryModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <InquiryModal
          isOpen={inquiryModalOpen}
          onClose={() => setInquiryModalOpen(false)}
          selectedDiamond={selectedDiamond}
        />
      </div>
    </div>
  );
}
