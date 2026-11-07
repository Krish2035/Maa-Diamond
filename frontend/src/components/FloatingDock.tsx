"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  MapPin,
  QrCode,
  ArrowUp,
  Share2,
} from "lucide-react";

export default function FloatingDock() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: "Maa Diamond - Surat Diamond Bourse",
        text: "Certified natural and lab-grown diamonds from Maa Diamond.",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside aria-label="Quick contact dock" className="fixed right-3 sm:right-5 bottom-6 z-40 flex flex-col items-center gap-2.5">
      {/* WhatsApp Quick Chat (Signature Green Button) */}
      <a
        href="https://wa.me/919033320326?text=Hello%20Maa%20Diamond%20Team%2C%20I%20am%20interested%20in%20inquiring%20about%20certified%20diamonds."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-emerald-600"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          WhatsApp B2B Chat
        </span>
      </a>

      {/* Phone Call */}
      <a
        href="tel:+919033320326"
        aria-label="Call Hardik Sorathiya"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-transform hover:scale-110 hover:bg-slate-800"
      >
        <Phone className="h-5 w-5 text-amber-400" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Call: +91 90333 20326
        </span>
      </a>

      {/* Showroom Directions */}
      <a
        href="https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat"
        target="_blank"
        rel="noreferrer"
        aria-label="Akshar Diamond Market Location"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-rose-600"
      >
        <MapPin className="h-5 w-5" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Akshar Diamond Market GPS
        </span>
      </a>

      {/* Digital vCard shortcut */}
      <Link
        href="/card"
        aria-label="View digital vCard"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-sky-600"
      >
        <QrCode className="h-5 w-5" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Digital Visiting Card
        </span>
      </Link>

      {/* Share Button */}
      <button
        onClick={shareWebsite}
        aria-label="Share website"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 shadow-md transition-transform hover:scale-110 hover:bg-slate-50"
      >
        <Share2 className="h-5 w-5" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {copied ? "Link Copied!" : "Share Website"}
        </span>
      </button>

      {/* Scroll to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition-transform hover:scale-110 hover:bg-slate-900"
        >
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}
    </aside>
  );
}
