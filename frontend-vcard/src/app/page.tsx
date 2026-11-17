"use client";

import React, { useState, useEffect } from "react";
import {
  Gem,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Share2,
  Download,
  QrCode,
  ShieldCheck,
  Instagram,
  FileText,
  X,
  Copy,
  Check,
} from "lucide-react";
import QRCode from "qrcode";
import { api, FALLBACK_PROFILE } from "@/lib/api";
import { BusinessProfile } from "@/lib/types";
import InquiryModal from "@/components/InquiryModal";

export default function DigitalVCardPage() {
  const [profile, setProfile] = useState<BusinessProfile>(FALLBACK_PROFILE);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    loadProfileAndQR();
    api.logQRScan();
  }, []);

  const loadProfileAndQR = async () => {
    try {
      const prof = await api.getProfile();
      if (prof) {
        setProfile(prof);
      }
      const currentUrl = typeof window !== "undefined" ? window.location.href : FALLBACK_PROFILE.cardUrl;
      const qr = await QRCode.toDataURL(currentUrl, {
        margin: 1,
        width: 360,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      setQrCodeDataUrl(qr);
    } catch {
      // Graceful fallback
    }
  };

  const handleSaveContact = async () => {
    const vcardText = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.companyName} (Hardik Sorathiya & Sanket Sorathiya)`,
      `ORG:${profile.companyName}`,
      `TITLE:${profile.tagline}`,
      `TEL;TYPE=WORK,VOICE:+919033320326`,
      `TEL;TYPE=CELL,VOICE:+918000045391`,
      `EMAIL;TYPE=PREF,INTERNET:${profile.primaryEmail}`,
      `URL:${profile.websiteUrl}`,
      `ADR;TYPE=WORK:;;217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha;Surat;Gujarat;395006;India`,
      `NOTE:Certified Diamonds Manufacturer at Akshar Diamond Market, Varachha, Surat.`,
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Maa_Diamond_Contact.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof window !== "undefined") {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#d97706", "#2563eb", "#10b981"],
        });
      } catch {}
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Maa Diamond - Digital Business Card",
        text: "Maa Diamond: Certified Diamonds Manufacturer at Surat Diamond Bourse.",
        url: window.location.href,
      });
    } else {
      setShareModalOpen(true);
    }
  };

  const copyCardLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-2.5 sm:p-4 md:p-6 lg:p-8">
      {/* 
        Standalone Digital vCard Container:
        - Mobile: Fits comfortably on phone screen
        - Tablet, Laptop & Desktop: Proportionately scales (sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl)
      */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col justify-between">

        {/* 1. Header Hero Section */}
        <div className="bg-gradient-to-b from-slate-50 to-white pt-5 sm:pt-6 md:pt-7 pb-3 sm:pb-4 px-5 sm:px-6 md:px-8 text-center border-b border-slate-100">
          {/* Logo Tile */}
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md mb-2 sm:mb-2.5 border-2 border-amber-400/70">
            <Gem className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-amber-400" />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-slate-900 leading-tight">
            MAA DIAMOND
          </h1>
          <div className="text-center text-[11px] sm:text-xs md:text-sm mt-1.5 sm:mt-2">
            <p className="text-slate-500 font-medium">Director name:</p>
            <p className="text-slate-900 font-bold leading-snug">Hardik Sorathiya</p>
            <p className="text-slate-900 font-bold leading-snug">Sanket Sorathiya</p>
          </div>
        </div>

        {/* 2. 12-Action Grid (4 Columns x 3 Rows - Responsive Scaling) */}
        <div className="px-3 sm:px-5 md:px-8 py-3 sm:py-4 md:py-5 bg-white">
          <div className="grid grid-cols-4 gap-y-3 sm:gap-y-4 md:gap-y-5 gap-x-1.5 sm:gap-x-3 md:gap-x-4 text-center">

            {/* Row 1: Quick Calls & WhatsApp */}
            {/* 1. Call Hardik */}
            <a
              href="tel:+919033320326"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:bg-rose-600 transition">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Hardik S.</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Call</span>
            </a>

            {/* 2. Call Sanket */}
            <a
              href="tel:+918000045391"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:bg-rose-600 transition">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Sanket S.</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Call</span>
            </a>

            {/* 3. WhatsApp Hardik */}
            <a
              href="https://wa.me/919033320326?text=Hello%20Hardik%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs group-hover:bg-emerald-600 transition">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Hardik S.</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold leading-none">WhatsApp</span>
            </a>

            {/* 4. WhatsApp Sanket */}
            <a
              href="https://wa.me/918000045391?text=Hello%20Sanket%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs group-hover:bg-emerald-600 transition">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Sanket S.</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold leading-none">WhatsApp</span>
            </a>

            {/* Row 2: Save, Website, Inquiry, Location */}
            {/* 5. Save Contact */}
            <button
              onClick={handleSaveContact}
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs group-hover:bg-amber-400 transition">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-extrabold text-slate-900 leading-tight">Save Contact</span>
              <span className="text-[9px] sm:text-[10px] text-amber-700 font-bold leading-none">1-Tap Sync</span>
            </button>

            {/* 6. Website (Full Live Vault) */}
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs group-hover:bg-sky-600 transition">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Website</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Live Vault</span>
            </a>

            {/* 7. Stone Inquiry Modal */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-violet-600 text-white shadow-xs group-hover:bg-violet-700 transition">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Inquiry</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Get Quote</span>
            </button>

            {/* 8. Office Location (Google Maps) */}
            <a
              href={profile.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Location</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Google Map</span>
            </a>

            {/* Row 3: Email, Instagram, QR Code, Share */}
            {/* 9. Email */}
            <a
              href="mailto:info@maadiamond.com"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs group-hover:bg-blue-600 transition">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Email</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Official</span>
            </a>

            {/* 10. Instagram */}
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs group-hover:opacity-90 transition">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Instagram</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Follow</span>
            </a>

            {/* 11. QR Code Modal */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-slate-800 text-white shadow-xs group-hover:bg-slate-900 transition">
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">QrCode</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Scan</span>
            </button>

            {/* 12. Share */}
            <button
              onClick={handleShare}
              className="group flex flex-col items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs group-hover:bg-rose-700 transition">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Share</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Send</span>
            </button>

          </div>
        </div>

        {/* 3. Primary 1-Tap Save Action Bar */}
        <div className="px-4 sm:px-6 md:px-8 pb-3 pt-1 bg-white">
          <button
            onClick={handleSaveContact}
            className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 sm:py-3.5 text-xs sm:text-sm md:text-base font-bold shadow-md shadow-slate-900/10 transition active:scale-98 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 text-amber-400" />
            <span>Save Contact to Phone (.vcf)</span>
          </button>
        </div>

        {/* 4. Company Address & Info (Compact Footer) */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs md:text-sm text-slate-600 space-y-1.5 sm:space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug text-slate-700">
              <span className="font-bold text-slate-900">Address:</span> 217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat - 395006
            </p>
          </div>

          <div className="flex items-center justify-between text-[10.5px] sm:text-xs pt-0.5">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 shrink-0" />
              <a href="mailto:info@maadiamond.com" className="text-blue-600 hover:underline font-medium">
                info@maadiamond.com
              </a>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>Certified Diamonds</span>
            </div>
          </div>
        </div>

        {/* 5. Minimal Sub-footer */}
        <div className="bg-slate-100 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs text-slate-400 border-t border-slate-200">
          © {new Date().getFullYear()} Maa Diamond • All Rights Reserved
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 text-center">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">Scan Digital vCard</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mb-3">
              Scan with phone camera to view &amp; save contact
            </p>

            {qrCodeDataUrl && (
              <div className="mx-auto my-2 w-48 sm:w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <img src={qrCodeDataUrl} alt="Maa Diamond QR Code" className="w-full h-auto" />
              </div>
            )}

            <p className="text-[10px] text-slate-400 mb-2">
              https://maa-diamond-vcard.vercel.app/
            </p>

            <button
              onClick={copyCardLink}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Link Copied!" : "Copy vCard Link"}
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 text-center">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Share Digital Card</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mb-3">
              Send this card directly to clients &amp; merchants
            </p>

            <button
              onClick={copyCardLink}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Link Copied to Clipboard!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}
