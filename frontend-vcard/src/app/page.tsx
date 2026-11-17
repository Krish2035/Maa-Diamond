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
  Building2,
  ExternalLink,
  Smartphone,
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      {/* 
        Responsive Container:
        - Mobile: Single-column sleek executive card (< md)
        - Tablet, Laptop & Desktop: Split 2-column luxury card showcase (md:flex-row)
      */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden md:flex md:flex-row md:items-stretch">

        {/* ======================================================== */}
        {/* LEFT PANEL: Executive Brand, Identity & Contacts         */}
        {/* ======================================================== */}
        <div className="w-full md:w-5/12 lg:w-4/12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 lg:p-7 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
          
          {/* Top Brand Identity */}
          <div>
            {/* Logo Badge */}
            <div className="flex items-center gap-3 md:block text-left md:text-left">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-slate-800 text-amber-400 shadow-md border-2 border-amber-400/70 shrink-0 md:mb-3">
                <Gem className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-amber-400" />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-wider text-white leading-tight">
                  MAA DIAMOND
                </h1>
                <p className="text-[10px] sm:text-[11px] lg:text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                  Certified Natural &amp; Lab-Grown
                </p>
              </div>
            </div>

            {/* Directors & Badge */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                Directors: <span className="text-white font-bold">Hardik Sorathiya &amp; Sanket Sorathiya</span>
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-800/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-amber-300 border border-amber-400/30">
                <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
                <span>Surat Diamond Bourse Traders</span>
              </div>
            </div>

            {/* Direct Phone Numbers on Desktop */}
            <div className="hidden md:block mt-4 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Hardik S.: <a href="tel:+919033320326" className="text-white font-semibold hover:underline">+91 90333 20326</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Sanket S.: <a href="tel:+918000045391" className="text-white font-semibold hover:underline">+91 80000 45391</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <a href="mailto:info@maadiamond.com" className="text-slate-200 hover:underline">info@maadiamond.com</a>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet: Embedded Scannable QR Code Box */}
          <div className="hidden md:flex flex-col items-center bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/60 my-4 text-center">
            {qrCodeDataUrl ? (
              <div className="w-32 h-32 lg:w-36 lg:h-36 bg-white rounded-xl p-2 shadow-inner">
                <img src={qrCodeDataUrl} alt="Maa Diamond QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                <QrCode className="h-8 w-8" />
              </div>
            )}
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Smartphone className="h-3 w-3" />
              <span>Scan with Phone Camera</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Open instantly on mobile or sync contact
            </p>
          </div>

          {/* Bottom Action: Save Contact */}
          <div className="mt-3 md:mt-0">
            <button
              onClick={handleSaveContact}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 transition active:scale-98 cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-950" />
              <span>Save Contact to Phone (.vcf)</span>
            </button>
            <p className="hidden md:block text-center text-[10px] text-slate-400 mt-2">
              1-Tap VCF Card • Direct phone address book sync
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: 12 Interactive Actions & Digital Services   */}
        {/* ======================================================== */}
        <div className="w-full md:w-7/12 lg:w-8/12 bg-white p-4 sm:p-5 lg:p-7 flex flex-col justify-between">
          
          {/* Header on Tablet/Desktop */}
          <div className="hidden md:flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-wide">
                Direct Merchant Connect
              </h2>
              <p className="text-xs text-slate-500">
                1-Tap calls, WhatsApp, inventory vault, and direct stone inquiry
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Trade Desk
            </span>
          </div>

          {/* 12-Action Grid */}
          <div className="my-auto py-2 sm:py-3">
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-y-3.5 sm:gap-y-4 md:gap-y-5 gap-x-2 sm:gap-x-3 text-center">

              {/* 1. Call Hardik */}
              <a
                href="tel:+919033320326"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:bg-rose-600 transition">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Hardik S.</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Call</span>
              </a>

              {/* 2. Call Sanket */}
              <a
                href="tel:+918000045391"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs group-hover:bg-rose-600 transition">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Sanket S.</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Call</span>
              </a>

              {/* 3. WhatsApp Hardik */}
              <a
                href="https://wa.me/919033320326?text=Hello%20Hardik%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs group-hover:bg-emerald-600 transition">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Hardik S.</span>
                <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold leading-none">WhatsApp</span>
              </a>

              {/* 4. WhatsApp Sanket */}
              <a
                href="https://wa.me/918000045391?text=Hello%20Sanket%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs group-hover:bg-emerald-600 transition">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Sanket S.</span>
                <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold leading-none">WhatsApp</span>
              </a>

              {/* 5. Save Contact */}
              <button
                onClick={handleSaveContact}
                className="group flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs group-hover:bg-amber-400 transition">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-extrabold text-slate-900 leading-tight">Save Contact</span>
                <span className="text-[9px] sm:text-[10px] text-amber-700 font-bold leading-none">1-Tap Sync</span>
              </button>

              {/* 6. Website (Full Live Vault) */}
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs group-hover:bg-sky-600 transition">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Website</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Live Vault</span>
              </a>

              {/* 7. Stone Inquiry Modal */}
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="group flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-violet-600 text-white shadow-xs group-hover:bg-violet-700 transition">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Inquiry</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Get Quote</span>
              </button>

              {/* 8. Office Location (Google Maps) */}
              <a
                href={profile.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Location</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Google Maps</span>
              </a>

              {/* 9. Email */}
              <a
                href="mailto:info@maadiamond.com"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs group-hover:bg-blue-600 transition">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Email</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Official</span>
              </a>

              {/* 10. Instagram */}
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center transition-transform hover:scale-105"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs group-hover:opacity-90 transition">
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Instagram</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Follow</span>
              </a>

              {/* 11. QR Code Modal */}
              <button
                onClick={() => setQrModalOpen(true)}
                className="group flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-slate-800 text-white shadow-xs group-hover:bg-slate-900 transition">
                  <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">QrCode</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Scan</span>
              </button>

              {/* 12. Share Card */}
              <button
                onClick={handleShare}
                className="group flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 lg:h-13 lg:w-13 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs group-hover:bg-rose-700 transition">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">Share</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 leading-none">Send</span>
              </button>

            </div>
          </div>

          {/* Bottom Info: Address, Certified Badge, Copyright */}
          <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
            <div className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <span className="font-bold text-slate-900">Office:</span> 217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat - 395006
              </p>
            </div>

            <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-500 pt-1 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Certified Natural &amp; Lab-Grown Diamonds</span>
              </div>
              <div className="text-slate-400">
                © {new Date().getFullYear()} Maa Diamond
              </div>
            </div>
          </div>

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
              Scan with any phone camera to view &amp; save contact
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
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
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
              Send this digital card directly to clients &amp; merchants
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
