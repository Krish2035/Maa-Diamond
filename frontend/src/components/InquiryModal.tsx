"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Send, Gem } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Diamond, DiamondShape } from "@/lib/types";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDiamond?: Diamond | null;
}

const DIAMOND_SHAPES: DiamondShape[] = [
  "Round",
  "Marquise",
  "Pear",
  "Princess",
  "Emerald",
  "Cushion",
  "Oval",
  "Radiant",
  "Heart",
  "Asscher",
];

export default function InquiryModal({ isOpen, onClose, selectedDiamond }: InquiryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [shape, setShape] = useState<DiamondShape>(selectedDiamond?.shape || "Round");
  const [carat, setCarat] = useState(selectedDiamond?.carat ? selectedDiamond.carat.toString() : "1.50");
  const [budget, setBudget] = useState(selectedDiamond?.totalPrice ? `$${selectedDiamond.totalPrice.toLocaleString()}` : "$5,000 - $10,000");
  const [notes, setNotes] = useState(
    selectedDiamond
      ? `Inquiring about stock ${selectedDiamond.stockNumber} (${selectedDiamond.carat}ct ${selectedDiamond.shape}, Color ${selectedDiamond.color}, Clarity ${selectedDiamond.clarity}, Cert: ${selectedDiamond.lab} ${selectedDiamond.certificateNo})`
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg("Please provide your name and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await api.submitInquiry({
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        targetShape: shape,
        targetCarat: parseFloat(carat) || undefined,
        targetBudget: budget,
        diamondId: selectedDiamond?.id,
        diamondStockNumber: selectedDiamond?.stockNumber,
        notes,
        idempotencyKey,
        userId: user?.id,
      });

      setIsSuccess(true);
      if (typeof window !== "undefined") {
        try {
          const confetti = (await import("canvas-confetti")).default;
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit inquiry. Please try WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `💎 *MAA DIAMOND INQUIRY*\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Shape:* ${shape}\n` +
      `*Carat:* ${carat} ct\n` +
      `*Budget:* ${budget}\n` +
      (selectedDiamond ? `*Stock #:* ${selectedDiamond.stockNumber} (${selectedDiamond.lab} ${selectedDiamond.certificateNo})\n` : "") +
      (notes ? `*Requirement Details:* ${notes}\n` : "")
    );
    window.open(`https://wa.me/919033320326?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Inquiry Received!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
              Thank you for contacting Maa Diamond. Our team at Surat Diamond Bourse will contact you shortly with wholesale quotation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openDirectWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat Now on WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gem className="h-5 w-5 text-amber-500" />
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {selectedDiamond ? `Inquire: ${selectedDiamond.stockNumber}` : "Request Diamond Quotation"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Direct factory pricing from Maa Diamond Surat manufacturing bourse.
            </p>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Parekh"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 90333 XXXXX"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jeweler@company.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Cut Shape
                  </label>
                  <select
                    value={shape}
                    onChange={(e) => setShape(e.target.value as DiamondShape)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  >
                    {DIAMOND_SHAPES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Carat Size
                  </label>
                  <input
                    type="text"
                    value={carat}
                    onChange={(e) => setCarat(e.target.value)}
                    placeholder="e.g. 1.50"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="$5,000 - $10,000"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Specific Requirements / Questions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify GIA/IGI, fluorescence, color, delivery date, etc."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4 text-amber-400" />
                  <span>{isSubmitting ? "Submitting..." : "Send Official Inquiry"}</span>
                </button>
                <button
                  type="button"
                  onClick={openDirectWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 px-5 text-xs font-bold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Instantly</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
