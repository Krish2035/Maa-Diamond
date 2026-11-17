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
  ExternalLink,
  ChevronRight,
  X,
  Copy,
  Check,
  Award,
  Building2,
  Sparkles,
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
        width: 320,
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
    <div className="min-h-screen bg-slate-100 py-6 sm:py-12 px-3 sm:px-6 flex flex-col items-center justify-center">

      {/* Top Header Status Bar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between px-1">
        <a
          href={profile.websiteUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
          <span>Visit Main Website</span>
        </a>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Verified Digital vCard
        </span>
      </div>

      {/* Main Digital Card Container */}
      <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">

        {/* Header Hero Banner with Diamond Graphic */}
        <div className="relative bg-slate-50 border-b border-slate-200 text-slate-900 pt-8 pb-6 px-6 text-center">
          {/* Circular Diamond Logo Tile */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md mb-3 border-2 border-amber-400">
            <Gem className="h-10 w-10 text-amber-400" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-wider text-slate-900">
            MAA DIAMOND
          </h1>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">
            Certified Natural &amp; Lab-Grown Diamonds
          </p>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Directors: <span className="text-slate-900 font-bold">Hardik Sorathiya &amp; Sanket Sorathiya</span>
          </p>

          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
            <Building2 className="h-3 w-3 text-amber-500" />
            <span>Surat Diamond Bourse Traders</span>
          </div>
        </div>

        {/* 12-Action Grid */}
        <div className="px-6 py-5 bg-white">
          <div className="grid grid-cols-3 gap-y-6 gap-x-3 text-center">

            {/* 1. Call Hardik Sorathiya */}
            <a
              href="tel:+919033320326"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/20 group-hover:bg-rose-600">
                <Phone className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Hardik S.</span>
              <span className="text-[10px] text-slate-500">Call</span>
            </a>

            {/* 2. Call Sanket Sorathiya */}
            <a
              href="tel:+918000045391"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/20 group-hover:bg-rose-600">
                <Phone className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Sanket S.</span>
              <span className="text-[10px] text-slate-500">Call</span>
            </a>

            {/* 3. Email */}
            <a
              href="mailto:info@maadiamond.com"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Email</span>
              <span className="text-[10px] text-slate-500">Official</span>
            </a>

            {/* 4. WhatsApp Hardik Sorathiya */}
            <a
              href="https://wa.me/919033320326?text=Hello%20Hardik%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:bg-emerald-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Hardik S.</span>
              <span className="text-[10px] text-emerald-700 font-semibold">WhatsApp</span>
            </a>

            {/* 5. WhatsApp Sanket Sorathiya */}
            <a
              href="https://wa.me/918000045391?text=Hello%20Sanket%20Bhai%2C%20I%20scanned%20your%20Maa%20Diamond%20visiting%20card."
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:bg-emerald-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Sanket S.</span>
              <span className="text-[10px] text-emerald-700 font-semibold">WhatsApp</span>
            </a>

            {/* 6. Website (Full Catalog) */}
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/20 group-hover:bg-sky-600">
                <Globe className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Website</span>
              <span className="text-[10px] text-slate-500">Live Vault</span>
            </a>

            {/* 7. QR Code Modal */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-md group-hover:bg-slate-900">
                <QrCode className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">QrCode</span>
              <span className="text-[10px] text-slate-500">Scan</span>
            </button>

            {/* 8. Save Contact (.vcf) */}
            <button
              onClick={handleSaveContact}
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 group-hover:bg-amber-400">
                <Download className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-900 font-extrabold">Save Contact</span>
              <span className="text-[10px] text-amber-700 font-bold">1-Tap Sync</span>
            </button>

            {/* 9. Share */}
            <button
              onClick={handleShare}
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/20 group-hover:bg-rose-700">
                <Share2 className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Share</span>
              <span className="text-[10px] text-slate-500">Send Card</span>
            </button>

            {/* 10. Inquiry */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-md shadow-violet-600/20 group-hover:bg-violet-700">
                <FileText className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Inquiry</span>
              <span className="text-[10px] text-slate-500">Get Quote</span>
            </button>

            {/* 11. Instagram */}
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md group-hover:opacity-90">
                <Instagram className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Instagram</span>
              <span className="text-[10px] text-slate-500">Official</span>
            </a>

            {/* 12. Office Location */}
            <a
              href={profile.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Direction</span>
              <span className="text-[10px] text-slate-500">Google Map</span>
            </a>
          </div>
        </div>

        {/* Primary Save Contact Action Bar */}
        <div className="px-6 pb-5 pt-1 bg-white">
          <button
            onClick={handleSaveContact}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800 transition transform active:scale-98"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>Save Contact to Phone (.vcf)</span>
          </button>
        </div>

        {/* Company Details & Address Info */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-xs text-slate-600 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Headquarters / Trade Office:</p>
              <p className="mt-0.5 leading-relaxed">
                217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat - 395006
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Official Correspondence:</p>
              <a href="mailto:info@maadiamond.com" className="text-blue-600 hover:underline">
                info@maadiamond.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-slate-500">
              100% Certified Natural &amp; Lab Grown Diamonds • GIA &amp; IGI Certification Standard
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-slate-100 py-3 text-center text-[11px] text-slate-500 border-t border-slate-200">
          © {new Date().getFullYear()} Maa Diamond. Surat Diamond Bourse Traders.
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Scan Digital vCard</h3>
            <p className="text-xs text-slate-500 mb-4">Scan with any phone camera to save contact</p>

            {qrCodeDataUrl && (
              <div className="mx-auto my-3 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
                <img src={qrCodeDataUrl} alt="Maa Diamond QR Code" className="w-full h-auto" />
              </div>
            )}

            <button
              onClick={copyCardLink}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link Copied!" : "Copy vCard Link"}
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Share Digital Card</h3>
            <p className="text-xs text-slate-500 mb-4">Send this card directly to merchants or clients</p>

            <button
              onClick={copyCardLink}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link Copied to Clipboard!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}

      {/* Direct Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}
