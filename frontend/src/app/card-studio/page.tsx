"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gem,
  QrCode,
  Download,
  Printer,
  Palette,
  Check,
  Eye,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import QRCode from "qrcode";

type CardTheme = "white" | "obsidian" | "platinum";
type CardOrientation = "portrait" | "landscape";

export default function CardStudioPage() {
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [theme, setTheme] = useState<CardTheme>("white");
  const [companyName, setCompanyName] = useState("MAA DIAMOND");
  const [directors, setDirectors] = useState("Hardik Sorathiya & Sanket Sorathiya");
  const [websiteUrl, setWebsiteUrl] = useState("maa-diamond.vercel.app");
  const [phone, setPhone] = useState("+91 90333 20326");
  const [secondaryPhone, setSecondaryPhone] = useState("+91 80000 45391");
  const [targetQrUrl, setTargetQrUrl] = useState("https://maa-diamond.vercel.app");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTargetQrUrl(window.location.origin);
      setWebsiteUrl(window.location.host);
    }
  }, []);

  useEffect(() => {
    generateQR();
  }, [targetQrUrl, theme]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(targetQrUrl, {
        margin: 1,
        width: 500,
        errorCorrectionLevel: "H",
        color: {
          dark: theme === "obsidian" ? "#ffffff" : "#0f172a",
          light: theme === "obsidian" ? "#0f172a" : "#ffffff",
        },
      });
      setQrCodeDataUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadPrintReadySvg = async () => {
    const isDark = theme === "obsidian";
    const bgColor = isDark ? "#0f172a" : "#ffffff";
    const textColor = isDark ? "#ffffff" : "#0f172a";
    const subColor = isDark ? "#f59e0b" : "#d97706";
    const strokeColor = isDark ? "#f59e0b" : "#334155";
    const qrColor = isDark ? "#ffffff" : "#0f172a";

    // Generate raw SVG string of QR code
    const rawQrSvg = await QRCode.toString(targetQrUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: qrColor,
        light: bgColor,
      },
    });

    const viewBoxMatch = rawQrSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
    const vbSize = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 35;
    const qrInner = rawQrSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "").trim();

    let svgContent = "";

    if (orientation === "portrait") {
      // Portrait CR80 (638 x 1012 px)
      svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="638" height="1012" viewBox="0 0 638 1012">
  <defs>
    <filter id="cardShadow" x="-5%" y="-3%" width="110%" height="108%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>
    </filter>
  </defs>

  <!-- PVC Card Base (Clean White with Rounded Corners R=40) -->
  <rect x="8" y="8" width="622" height="996" rx="40" ry="40" fill="${bgColor}" stroke="#E2E8F0" stroke-width="2.5" filter="url(#cardShadow)"/>

  <!-- TOP SECTION: BRAND & DIAMOND EMBLEM -->
  <g transform="translate(60, 60)">
    
    <!-- Left: Brand Name & Details -->
    <g transform="translate(0, 50)">
      <text x="0" y="45" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="900" fill="${textColor}" letter-spacing="3">${companyName}</text>
      <text x="0" y="88" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="15" font-weight="600" fill="#64748B" letter-spacing="0.5">${directors}</text>
      <text x="0" y="116" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">${phone}</text>
      <text x="0" y="136" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="600" fill="#334155">${secondaryPhone}</text>
    </g>

    <!-- Right: Geometric Diamond Emblem -->
    <g transform="translate(370, 40)">
      <polygon points="65,10 130,55 65,150 0,55" fill="none" stroke="${strokeColor}" stroke-width="4.5" stroke-linejoin="round"/>
      <line x1="32" y1="55" x2="98" y2="55" stroke="${strokeColor}" stroke-width="3"/>
      <line x1="65" y1="10" x2="65" y2="150" stroke="${strokeColor}" stroke-width="3"/>
      <polygon points="65,10 32,55 65,150" fill="${strokeColor}" fill-opacity="0.12" stroke="${strokeColor}" stroke-width="2"/>
      <polygon points="65,10 98,55 65,150" fill="${subColor}" fill-opacity="0.25" stroke="${strokeColor}" stroke-width="2"/>
      <polygon points="0,55 32,55 65,150" fill="${strokeColor}" fill-opacity="0.88" stroke="${strokeColor}" stroke-width="2"/>
      <polygon points="130,55 98,55 65,150" fill="${strokeColor}" fill-opacity="0.88" stroke="${strokeColor}" stroke-width="2"/>
    </g>
  </g>

  <!-- HORIZONTAL DIVIDING LINE -->
  <line x1="60" y1="320" x2="578" y2="320" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round"/>

  <!-- BOTTOM SECTION: FULL-SIZE CRISP QR CODE (Centered) -->
  <g transform="translate(139, 380)">
    <rect x="-16" y="-16" width="392" height="392" rx="20" fill="${bgColor}" stroke="#F1F5F9" stroke-width="2"/>
    <svg x="0" y="0" width="360" height="360" viewBox="0 0 ${vbSize} ${vbSize}" shape-rendering="crispEdges">
      ${qrInner}
    </svg>
  </g>

  <!-- Bottom Captions -->
  <text x="319" y="865" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="14" font-weight="800" fill="${textColor}" text-anchor="middle" letter-spacing="3">SCAN TO OPEN WEBSITE</text>
  <text x="319" y="905" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="middle">202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat - 395006</text>
  <text x="319" y="935" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="700" fill="${subColor}" text-anchor="middle" letter-spacing="1.5">${websiteUrl}</text>
</svg>`;
    } else {
      // Landscape CR80 (1012 x 638 px) - Matching Exactly the Reference Card
      svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1012" height="638" viewBox="0 0 1012 638">
  <defs>
    <filter id="cardShadow" x="-3%" y="-4%" width="106%" height="108%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect x="8" y="8" width="996" height="622" rx="38" ry="38" fill="${bgColor}" stroke="#E2E8F0" stroke-width="2.5" filter="url(#cardShadow)"/>
  <rect x="22" y="22" width="968" height="594" rx="28" ry="28" fill="none" stroke="#F1F5F9" stroke-width="2"/>

  <!-- Left Half: Diamond Emblem & Brand Details -->
  <g transform="translate(253, 0)">
    <g transform="translate(-80, 145)">
      <polygon points="30,15 130,15 155,56 80,145 5,56" fill="none" stroke="${strokeColor}" stroke-width="4.5" stroke-linejoin="round"/>
      <line x1="5" y1="56" x2="155" y2="56" stroke="${strokeColor}" stroke-width="3.5"/>
      <polygon points="55,15 105,15 80,56" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="2.5"/>
      <line x1="30" y1="15" x2="80" y2="56" stroke="${strokeColor}" stroke-width="2.5"/>
      <line x1="130" y1="15" x2="80" y2="56" stroke="${strokeColor}" stroke-width="2.5"/>
      <line x1="80" y1="56" x2="80" y2="145" stroke="${strokeColor}" stroke-width="3"/>
      <polygon points="5,56 46,56 80,145" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="2"/>
      <polygon points="155,56 114,56 80,145" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="2"/>
    </g>

    <text x="0" y="360" font-family="'Cinzel', 'Playfair Display', Calibri, 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="900" fill="${textColor}" text-anchor="middle" letter-spacing="4">${companyName}</text>
    <text x="0" y="400" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="1">${directors}</text>
    <text x="0" y="428" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12.5" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="0.5">${phone}</text>
    <text x="0" y="454" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12.5" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="0.5">${secondaryPhone}</text>
  </g>

  <!-- Center Vertical Divider Line -->
  <line x1="506" y1="140" x2="506" y2="500" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Right Half: Full-Size Scannable QR Code -->
  <g transform="translate(614, 140)">
    <rect x="-10" y="-10" width="290" height="290" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <svg x="0" y="0" width="270" height="270" viewBox="0 0 ${vbSize} ${vbSize}" shape-rendering="crispEdges">
      ${qrInner}
    </svg>
  </g>

  <text x="749" y="475" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="13" font-weight="900" fill="${textColor}" text-anchor="middle" letter-spacing="2">SCAN TO OPEN WEBSITE</text>
  <text x="749" y="502" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="11.5" font-weight="600" fill="#64748B" text-anchor="middle">202, Akshar Diamond Market, Varachha, Surat</text>
  <text x="749" y="526" font-family="Calibri, 'Segoe UI', Arial, sans-serif" font-size="12.5" font-weight="800" fill="${subColor}" text-anchor="middle" letter-spacing="1">${websiteUrl}</text>
</svg>`;
    }

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Maa_Diamond_Card_${orientation}_${theme}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    if (typeof window !== "undefined") {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            ● Print-Ready 300 DPI Vector Generator
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 mb-2">
            <Printer className="h-3.5 w-3.5 text-amber-600" />
            <span>Visiting Card & QR Studio</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Maa Diamond Business Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Replaces the competitor &quot;G.B Brothers&quot; card with Maa Diamond&apos;s clean white PVC card. Live scannable QR code linking to your digital vCard.
          </p>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left Col) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4 text-amber-600" />
                <span>Card Customization</span>
              </h3>

              {/* 1. Orientation Toggle (Portrait matches Screenshot 1!) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Card Orientation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      orientation === "landscape"
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <RotateCcw className="h-4 w-4 rotate-90" />
                    <span>Horizontal (Screenshot 2)</span>
                  </button>

                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                      orientation === "portrait"
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Vertical (Portrait)</span>
                  </button>
                </div>
              </div>

              {/* 2. Theme Picker (Default White) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Material Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "white", label: "Classic White", color: "bg-white border-slate-300" },
                    { id: "platinum", label: "Platinum", color: "bg-slate-100 border-slate-300" },
                    { id: "obsidian", label: "Obsidian", color: "bg-slate-900 border-amber-400" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as CardTheme)}
                      className={`rounded-xl border p-2.5 text-xs font-bold text-center transition-all ${
                        theme === t.id
                          ? "border-slate-900 ring-2 ring-slate-900 shadow-xs"
                          : "border-slate-200 bg-slate-50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`h-4 w-full rounded mb-1.5 border ${t.color}`} />
                      <span className="block truncate text-slate-800">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Text Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Company Brand Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Owners / Directors
                  </label>
                  <input
                    type="text"
                    value={directors}
                    onChange={(e) => setDirectors(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    QR Scan Destination (Links to your Live Card)
                  </label>
                  <input
                    type="text"
                    value={targetQrUrl}
                    onChange={(e) => setTargetQrUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 font-mono focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={downloadPrintReadySvg}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-white shadow-md transition-all"
                >
                  <Download className="h-4 w-4 text-amber-400" />
                  <span>Download Print-Ready Vector (.SVG)</span>
                </button>

                <div className="flex gap-2">
                  <a
                    href="/maa-diamond-website-qr.png"
                    download="Maa_Diamond_Website_QR.png"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 py-2.5 text-xs font-bold text-emerald-900 transition-colors shadow-xs"
                  >
                    <QrCode className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Download QR (.PNG)</span>
                  </a>

                  <a
                    href="/maa-diamond-card-horizontal.png"
                    download="Maa_Diamond_Card_300DPI.png"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 py-2.5 text-xs font-bold text-amber-900 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5 text-amber-700" />
                    <span>Card High-Res (.PNG)</span>
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                  >
                    <Printer className="h-3.5 w-3.5 text-slate-600" />
                    <span>Print Card</span>
                  </button>

                  <a
                    href={orientation === "landscape" ? "/maa-diamond-card-horizontal.svg" : "/maa-diamond-card-portrait.svg"}
                    download={orientation === "landscape" ? "Maa_Diamond_Card_Horizontal.svg" : "Maa_Diamond_Card_Portrait.svg"}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-bold text-slate-700 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-600" />
                    <span>Vector (.SVG)</span>
                  </a>
                </div>

                {downloadSuccess && (
                  <p className="mt-2 text-center text-xs text-emerald-700 font-bold animate-fadeIn">
                    ✓ Print-ready SVG file downloaded successfully!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas (Right Col) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                1:1 Physical CR80 Card Mockup
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                54mm × 85.6mm (Standard PVC)
              </span>
            </div>

            {/* MOCKUP 1: PORTRAIT CARD (Screenshot 1 Exact Layout) */}
            {orientation === "portrait" ? (
              <div
                className={`relative w-[320px] sm:w-[350px] min-h-[520px] sm:min-h-[560px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl ${
                  theme === "obsidian"
                    ? "bg-slate-900 border border-amber-400/40 text-white"
                    : theme === "platinum"
                    ? "bg-slate-100 border-2 border-slate-300 text-slate-900"
                    : "bg-white border-2 border-slate-300 text-slate-900"
                }`}
              >
                {/* TOP HALF: Logo + Brand Name + Geometric Facet Diamond */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-black tracking-widest leading-none">
                        {companyName}
                      </h2>
                      <p className="text-[11px] font-bold opacity-80 mt-2">
                        {directors}
                      </p>
                      <p className="text-[10px] opacity-60 font-medium">
                        Diamond Manufacturers &amp; Exporters
                      </p>
                    </div>

                    {/* Geometric Diamond Emblem (Exact matching Screenshot 1!) */}
                    <div className="shrink-0 ml-2">
                      <svg viewBox="0 0 130 150" className="h-16 w-14 drop-shadow-xs">
                        <polygon
                          points="65,10 130,55 65,150 0,55"
                          fill="none"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="32"
                          y1="55"
                          x2="98"
                          y2="55"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="3"
                        />
                        <line
                          x1="65"
                          y1="10"
                          x2="65"
                          y2="150"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="3"
                        />
                        <polygon
                          points="65,10 32,55 65,150"
                          fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          fillOpacity="0.12"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="2"
                        />
                        <polygon
                          points="65,10 98,55 65,150"
                          fill="#D97706"
                          fillOpacity="0.25"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="2"
                        />
                        <polygon
                          points="0,55 32,55 65,150"
                          fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          fillOpacity="0.88"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="2"
                        />
                        <polygon
                          points="130,55 98,55 65,150"
                          fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          fillOpacity="0.88"
                          stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="text-[10px] opacity-75 font-semibold mt-2">
                    {phone} • info@maadiamond.com
                  </p>
                </div>

                {/* HORIZONTAL DIVIDER RULE (Exact matching Screenshot 1!) */}
                <div className={`w-full h-0.5 my-3 rounded-full ${theme === "obsidian" ? "bg-amber-400/40" : "bg-slate-700"}`} />

                {/* BOTTOM HALF: Crisp Large Centered QR Code */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="Live QR Code" className="w-44 h-44 object-contain" />
                    ) : (
                      <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-xl" />
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest mt-3 text-center">
                    Scan for Digital Card &amp; Inventory
                  </span>
                  <span className="text-[10px] opacity-75 font-medium mt-0.5 text-center">
                    202, Akshar Diamond Market, Varachha, Surat
                  </span>
                </div>

                {/* Card Footer URL */}
                <div className="text-center pt-2 border-t border-current/20 text-[11px] font-bold text-amber-600 tracking-wider">
                  {websiteUrl}
                </div>
              </div>
            ) : (
              /* MOCKUP 2: HORIZONTAL LANDSCAPE CARD (Exact Replica of Screenshot 2) */
              <div
                className={`relative w-full max-w-[530px] h-[300px] sm:h-[320px] rounded-3xl p-6 sm:p-8 flex items-center justify-between transition-all duration-300 shadow-2xl ${
                  theme === "obsidian"
                    ? "bg-slate-900 border border-amber-400/40 text-white"
                    : theme === "platinum"
                    ? "bg-slate-100 border-2 border-slate-300 text-slate-900"
                    : "bg-white border-2 border-slate-300 text-slate-900"
                }`}
              >
                {/* LEFT HALF: Diamond Emblem + Brand Name (Centered horizontally) */}
                <div className="flex-1 flex flex-col items-center justify-center text-center pr-3">
                  {/* Geometric Diamond Emblem (Exact matching Screenshot 2) */}
                  <svg viewBox="0 0 160 150" className="h-16 w-16 sm:h-20 sm:w-20 mb-2.5 drop-shadow-xs">
                    <polygon
                      points="30,15 130,15 155,56 80,140 5,56"
                      fill="none"
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="5"
                      y1="56"
                      x2="155"
                      y2="56"
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="3.5"
                    />
                    <polygon
                      points="55,15 105,15 80,56"
                      fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="2.5"
                    />
                    <line
                      x1="30"
                      y1="15"
                      x2="80"
                      y2="56"
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="2.5"
                    />
                    <line
                      x1="130"
                      y1="15"
                      x2="80"
                      y2="56"
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="2.5"
                    />
                    <line
                      x1="80"
                      y1="56"
                      x2="80"
                      y2="140"
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="3"
                    />
                    <polygon
                      points="5,56 46,56 80,140"
                      fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="2"
                    />
                    <polygon
                      points="155,56 114,56 80,140"
                      fill={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      stroke={theme === "obsidian" ? "#f59e0b" : "#0F172A"}
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Company Name */}
                  <h2 className="font-serif text-lg sm:text-xl font-black tracking-widest leading-tight">
                    {companyName}
                  </h2>
                  <p className="text-[9px] opacity-70 font-semibold mt-1">
                    {directors}
                  </p>
                  <p className="text-[9px] font-bold mt-1 text-slate-800">
                    {phone}
                  </p>
                  <p className="text-[9px] font-bold text-slate-800">
                    {secondaryPhone}
                  </p>
                </div>

                {/* CENTER VERTICAL DIVIDER LINE (Exact Replica of Screenshot 2) */}
                <div
                  className={`w-0.5 h-36 sm:h-44 rounded-full ${
                    theme === "obsidian" ? "bg-amber-400/40" : "bg-slate-700"
                  }`}
                />

                {/* RIGHT HALF: Centered High-Resolution QR Code */}
                <div className="flex-1 flex flex-col items-center justify-center pl-3">
                  <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Live QR Code"
                        className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                      />
                    ) : (
                      <div className="w-32 h-32 sm:w-36 sm:h-36 bg-slate-100 animate-pulse rounded-xl" />
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest mt-2 text-center text-slate-900">
                    Scan to Open Website
                  </span>
                  <span className="text-[9px] font-bold text-blue-600 text-center tracking-wide">
                    {websiteUrl}
                  </span>
                </div>
              </div>
            )}

            {/* Test Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/card"
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-sm"
              >
                <span>Test Live QR Destination</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <a
                href={orientation === "landscape" ? "/maa-diamond-card-horizontal.svg" : "/maa-diamond-card-portrait.svg"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition-all shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                <span>Open {orientation === "landscape" ? "Horizontal" : "Portrait"} Vector SVG</span>
              </a>

              <a
                href="/maa-diamond-card-horizontal.png"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 transition-all shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                <span>Open High-Res PNG</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
