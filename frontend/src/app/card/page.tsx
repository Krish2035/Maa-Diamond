"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowLeft,
  X,
  Copy,
  Check,
} from "lucide-react";
import QRCode from "qrcode";
import { api } from "@/lib/api";
import { BusinessProfile } from "@/lib/types";
import InquiryModal from "@/components/InquiryModal";

export default function DigitalCardPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
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
    const prof = await api.getProfile();
    if (prof) {
      setProfile(prof);
      try {
        const qr = await QRCode.toDataURL(typeof window !== "undefined" ? window.location.href : prof.cardUrl, {
          margin: 1,
          width: 320,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        setQrCodeDataUrl(qr);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveContact = async () => {
    if (!profile) return;
    const vcardText = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.companyName} (Hardik Sorathiya & Sanket Sorathiya)`,
      `ORG:${profile.companyName}`,
      `TITLE:${profile.tagline}`,
      `TEL;TYPE=WORK,VOICE:+919033320326`,
      `TEL;TYPE=CELL,VOICE:+918000045391`,
      `EMAIL;TYPE=PREF,INTERNET:${profile.primaryEmail}`,
      `URL:${typeof window !== "undefined" ? window.location.origin : profile.websiteUrl}`,
      `ADR;TYPE=WORK:;;202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha;Surat;Gujarat;395006;India`,
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
      
      {/* Top Navigation */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Main Website</span>
        </Link>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ● Verified Card
        </span>
      </div>

      {/* Main Digital Card Container (Modeled on Screenshot 2 & 3, but Clean & Desktop/Mobile Responsive!) */}
      <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
        
        {/* Header Hero Banner with Diamond Graphic (Clean Light Theme) */}
        <div className="relative bg-slate-50 border-b border-slate-200 text-slate-900 pt-8 pb-6 px-6 text-center">
          {/* Circular Diamond Logo */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white shadow-md mb-3 border-2 border-amber-400">
            <Gem className="h-10 w-10 text-amber-400" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-wider text-slate-900">
            MAA DIAMOND
          </h1>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Owners / Directors: <span className="text-slate-900 font-bold">Hardik Sorathiya & Sanket Sorathiya</span>
          </p>
        </div>

        {/* Action Grid (Directly implementing the 10+ buttons from Screenshots 2 & 3) */}
        <div className="px-6 py-4 bg-white">
          <div className="grid grid-cols-3 gap-y-6 gap-x-3 text-center">
            
            {/* 1. Call Hardik Sorathiya */}
            <a
              href="tel:+919033320326"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/20 group-hover:bg-rose-600">
                <Phone className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Hardik Sorathiya</span>
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
              <span className="mt-2 text-xs font-bold text-slate-800">Sanket Sorathiya</span>
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
              <span className="mt-2 text-xs font-bold text-slate-800">Hardik Sorathiya</span>
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
              <span className="mt-2 text-xs font-bold text-slate-800">Sanket Sorathiya</span>
              <span className="text-[10px] text-emerald-700 font-semibold">WhatsApp</span>
            </a>

            {/* 6. Website */}
            <Link
              href="/"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/20 group-hover:bg-sky-600">
                <Globe className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Website</span>
              <span className="text-[10px] text-slate-500">Full Catalog</span>
            </Link>

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
              href="https://instagram.com"
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

            {/* 12. Location (Akshar Diamond Market, Varachha, Surat) */}
            <a
              href="https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-bold text-slate-800">Location</span>
              <span className="text-[10px] text-slate-500">Varachha, Surat</span>
            </a>
          </div>

          {/* Large 1-Tap Save Button (Prominently placed for businessmen) */}
          <div className="mt-8">
            <button
              onClick={handleSaveContact}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>Save Contact to Phone (.vcf)</span>
            </button>
          </div>

          {/* Physical Address Preview */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              TRADING OFFICE:
            </span>
            <p className="text-xs text-slate-500 mt-1">
              202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat - 395006
            </p>
          </div>
        </div>

        {/* Footer info matching Screenshot 2 bottom */}
        <div className="bg-slate-900 text-slate-300 py-4 px-6 text-center text-xs">
          <p className="font-semibold text-white">Maa Diamond • Certified Diamond Manufacturers</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Diamond Manufacturers &amp; Exporters</p>
        </div>
      </div>

      {/* QR MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Maa Diamond QR Code</h3>
            <p className="text-xs text-slate-500 mb-4">Scan with any phone to open this card</p>
            {qrCodeDataUrl && (
              <div className="mx-auto my-3 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
                <img src={qrCodeDataUrl} alt="Maa Diamond QR Code" className="w-full h-auto" />
              </div>
            )}
            <p className="text-[11px] font-mono text-slate-500 mt-3">www.maadiamond.com/card</p>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">Share Card Link</h3>
            <p className="text-xs text-slate-500 mb-4">Copy and send to your jeweler network</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 font-mono"
              />
              <button
                onClick={copyCardLink}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shrink-0 hover:bg-slate-800"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}
