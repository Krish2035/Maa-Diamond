"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gem,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Filter,
  Search,
  MessageCircle,
  FileText,
  MapPin,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Send,
  Building2,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api";
import { Diamond, DiamondShape } from "@/lib/types";
import DiamondCard from "@/components/DiamondCard";
import InquiryModal from "@/components/InquiryModal";
import Footer from "@/components/Footer";

const SHAPES: { shape: DiamondShape; label: string; icon: string }[] = [
  { shape: "Round", label: "Round Diamond", icon: "💎" },
  { shape: "Marquise", label: "Marquise Diamond", icon: "✨" },
  { shape: "Pear", label: "Pear Diamond", icon: "💧" },
  { shape: "Princess", label: "Princess Diamond", icon: "🔷" },
  { shape: "Emerald", label: "Emerald Diamond", icon: "🏛️" },
  { shape: "Cushion", label: "Cushion Diamond", icon: "🛋️" },
  { shape: "Oval", label: "Oval Diamond", icon: "🥚" },
  { shape: "Radiant", label: "Radiant Diamond", icon: "🌟" },
  { shape: "Heart", label: "Heart Diamond", icon: "❤️" },
  { shape: "Asscher", label: "Asscher Diamond", icon: "💠" },
];

export default function HomePage() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShape, setSelectedShape] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [selectedClarity, setSelectedClarity] = useState<string>("All");
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [activeDiamondForInquiry, setActiveDiamondForInquiry] = useState<Diamond | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Quick Inline Inquiry Form State (at bottom of page, matching competitor)
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formShape, setFormShape] = useState("Round");
  const [formMessage, setFormMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchDiamonds();
  }, [selectedShape, selectedColor, selectedClarity]);

  const fetchDiamonds = async () => {
    setLoading(true);
    try {
      const res = await api.getDiamonds({
        shape: selectedShape !== "All" ? selectedShape : undefined,
        color: selectedColor !== "All" ? selectedColor : undefined,
        clarity: selectedClarity !== "All" ? selectedClarity : undefined,
        search: searchQuery || undefined,
      });
      setDiamonds(res.diamonds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInquire = (diamond: Diamond) => {
    setActiveDiamondForInquiry(diamond);
    setInquiryModalOpen(true);
  };

  const handleGeneralInquiry = () => {
    setActiveDiamondForInquiry(null);
    setInquiryModalOpen(true);
  };

  const handleInlineInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      alert("Please enter your name and phone number");
      return;
    }
    try {
      await api.submitInquiry({
        customerName: formName,
        customerPhone: formPhone,
        customerEmail: formEmail || undefined,
        targetShape: formShape as DiamondShape,
        notes: formMessage,
      });
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 5000);
      setFormName("");
      setFormPhone("");
      setFormEmail("");
      setFormMessage("");
    } catch (e: any) {
      alert(e.message || "Failed to submit inquiry");
    }
  };

  const displayedDiamonds = showAllProducts ? diamonds : diamonds.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO BANNER (100% Clean White Background for Diamond Dealers & Traditional Businessmen) */}
      <section id="home" className="relative bg-white text-slate-900 border-b border-slate-200 pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900 mb-5 shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="tracking-wide">MAA DIAMOND • LAB GROWN DIAMOND MANUFACTURER AND SELLER</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Precision Diamond Manufacturing & Global Trading
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Direct manufacturers of IGI certified lab grown diamond, CVD and natural loose diamonds. Delivering highest standards of brilliance, fire, and wholesale value to diamond merchants worldwide.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products"
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-7 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm transition-all"
            >
              <span>View Diamond Products</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://wa.me/919033320326?text=Hello%20Maa%20Diamond%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20certified%20diamonds."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Trade Desk</span>
            </a>

            <Link
              href="/card"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 transition-all shadow-xs"
            >
              <span>Digital Business Card</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION (Matching competitor's About section) */}
      <section id="about-us" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Description */}
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-2">
                Surat Diamond Bourse Legacy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                About Maa Diamond
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Maa Diamond</strong> is a trusted name in the world of fine diamonds, specializing in precision manufacturing and global diamond trading. With a foundation built on integrity, master craftsmanship, and innovation, we are committed to delivering diamonds that meet the highest international standards of brilliance, beauty, and value.
                </p>
                <p>
                  From rough kimberlite crystal sourcing to skilled laser planning, 57-facet blocking, high-precision polishing, optical grading, and final accredited certification (GIA & IGI), every step is executed with microscopic precision at our Surat manufacturing facility.
                </p>
                <p>
                  Led by experienced directors <strong>Hardik Sorathiya</strong> and <strong>Sanket Sorathiya</strong>, we supply wholesale diamond parcels and single investment stones to jewelers across India, Antwerp, Dubai, and Hong Kong.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Conflict-Free Diamonds</h4>
                    <p className="text-xs text-slate-500 mt-0.5">100% compliant with the United Nations Kimberley Process.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <Award className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Certified Grading</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Verified with authentic GIA, IGI & HRD dossier certificates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Diamond Craftsmanship Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
                alt="Diamond Polishing Craftsmanship"
                className="h-[360px] w-full object-cover"
              />
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900 block">Surat Diamond Bourse Headquarters</span>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat, 395006 • Direct Factory Wholesale Pricing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION (Exact Elevated Layout of Screenshot 4 & 5) */}
      <section id="products" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
              Direct Wholesale Inventory
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
              Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Browse our certified diamond cuts. Inquire directly or connect instantly on WhatsApp.
            </p>
          </div>

          {/* Diamond Cut Shape Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedShape("All")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedShape === "All"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Diamond Cuts
            </button>
            {SHAPES.map((s) => (
              <button
                key={s.shape}
                onClick={() => setSelectedShape(s.shape)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedShape === s.shape
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Filter Bar (Search, Color, Clarity) */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock #, carat, shape..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchDiamonds()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 uppercase">Color:</span>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="All">All Colors (D-J)</option>
                  <option value="D">D (Colorless)</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 uppercase">Clarity:</span>
                <select
                  value={selectedClarity}
                  onChange={(e) => setSelectedClarity(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
                >
                  <option value="All">All Clarity</option>
                  <option value="IF">IF (Flawless)</option>
                  <option value="VVS1">VVS1</option>
                  <option value="VVS2">VVS2</option>
                  <option value="VS1">VS1</option>
                </select>
              </div>

              <button
                onClick={fetchDiamonds}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Product Cards Grid (Matching Screenshot 5) */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
              <p className="mt-3 text-xs text-slate-500 font-medium">Loading diamond inventory...</p>
            </div>
          ) : displayedDiamonds.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDiamonds.map((dia) => (
                  <DiamondCard key={dia.id} diamond={dia} onInquire={handleInquire} />
                ))}
              </div>

              {/* "Show All" Button (Exact button seen in Screenshot 5!) */}
              {diamonds.length > 6 && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
                  >
                    <span>{showAllProducts ? "Show Less" : "Show All Products"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Gem className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">No Matching Diamonds Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                We manufacture bespoke diamond parcels on demand. Contact our Surat trade desk with your specific requirement.
              </p>
              <button
                onClick={handleGeneralInquiry}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black"
              >
                Submit Custom RFQ
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. INLINE INQUIRY FORM SECTION (Matching competitor's Inquiry section) */}
      <section id="inquiry" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-md">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
                Direct B2B Inquiry
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-slate-900 mb-2">
                Send Diamond Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Submit your diamond requirements below. Our team at Surat Diamond Bourse will reply with official factory rates.
              </p>
            </div>

            {formSuccess && (
              <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 text-center">
                ✓ Thank you! Your inquiry has been submitted. Our team will contact you shortly.
              </div>
            )}

            <form onSubmit={handleInlineInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rajesh Parekh"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98250 XXXXX"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="jeweler@company.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Desired Diamond Cut
                  </label>
                  <select
                    value={formShape}
                    onChange={(e) => setFormShape(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  >
                    {SHAPES.map((s) => (
                      <option key={s.shape} value={s.shape}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Message / Carat Size / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Specify carat weight, color, clarity, GIA/IGI cert requirements, etc."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <Send className="h-4 w-4 text-amber-400" />
                  <span>Submit Inquiry</span>
                </button>

                <a
                  href={`https://wa.me/919033320326?text=${encodeURIComponent(
                    `Hello Maa Diamond! Name: ${formName || "Buyer"} | Cut: ${formShape} | Requirement: ${formMessage || "General diamond inquiry"}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Instantly</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 6. CONTACT DETAILS & SHOWROOM SECTION */}
      <section id="contact" className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
              Surat Diamond Bourse
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-slate-900 mb-2">
              Contact Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Visit our trading office at Varachha or contact our directors directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-slate-900 mb-2">Our Trading Office</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                202, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat, 395006
              </p>
              <a
                href="https://maps.google.com/?q=Akshar+Diamond+Market+Mangadh+Chowk+Mini+Bazaar+Varachha+Surat"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
              >
                <span>View Google Maps</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>

            {/* Phone & WhatsApp */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-slate-900 mb-2">Call & WhatsApp</h4>
              <div className="space-y-1 text-xs text-slate-700">
                <p>Hardik Sorathiya: <a href="tel:+919033320326" className="font-bold hover:underline">+91 90333 20326</a></p>
                <p>Sanket Sorathiya: <a href="tel:+918000045391" className="font-bold hover:underline">+91 80000 45391</a></p>
              </div>
              <a
                href="https://wa.me/919033320326"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>Chat on WhatsApp</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>

            {/* Email & Web */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-slate-900 mb-2">Official Email</h4>
              <div className="space-y-1 text-xs text-slate-700">
                <p><a href="mailto:info@maadiamond.com" className="font-bold hover:underline">info@maadiamond.com</a></p>
                <p><a href="mailto:inquiry@maadiamond.com" className="font-bold hover:underline">inquiry@maadiamond.com</a></p>
              </div>
              <Link
                href="/card"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
              >
                <span>Open Digital vCard</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY MODAL */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        selectedDiamond={activeDiamondForInquiry}
      />

      <Footer />
    </div>
  );
}
