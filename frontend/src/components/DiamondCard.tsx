"use client";

import React, { useState } from "react";
import { MessageCircle, FileText, Heart, ShieldCheck, Eye, Film, Image as ImageIcon } from "lucide-react";
import { Diamond } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface DiamondCardProps {
  diamond: Diamond;
  onInquire: (diamond: Diamond) => void;
}

export default function DiamondCard({ diamond, onInquire }: DiamondCardProps) {
  const { isInWishlist, toggleWishlist } = useAuth();
  const inWish = isInWishlist(diamond.id);

  const hasVideo = Boolean(diamond.videoUrl);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Maa Diamond team! I am interested in inquiring about ${diamond.shape} Diamond (${diamond.stockNumber}, Color: ${diamond.color}, Clarity: ${diamond.clarity}, Lab: ${diamond.lab} ${diamond.certificateNo}). Is this available?`
    );
    window.open(`https://wa.me/919033320326?text=${text}`, "_blank");
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {diamond.shape} Cut
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(diamond.id)}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            inWish
              ? "bg-rose-50 text-rose-500 border border-rose-200"
              : "bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200"
          }`}
          title={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${inWish ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Diamond Cut Image or Video Showcase */}
      <div className="relative mb-3 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3">
        {hasVideo && activeMedia === "video" ? (
          <video
            src={diamond.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="relative z-10 max-h-40 max-w-full object-contain rounded-lg shadow-xs"
          />
        ) : (
          <img
            src={diamond.imageUrl || "/favicon.svg"}
            alt={`${diamond.shape} Diamond`}
            className="relative z-10 max-h-40 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Interactive Photo / Video Mode Toggle Pill */}
        {hasVideo && (
          <div className="absolute top-2 right-2 z-20 flex items-center rounded-lg bg-white/90 p-0.5 border border-slate-200 shadow-xs backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setActiveMedia("image")}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                activeMedia === "image"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="View Diamond Photo"
            >
              <ImageIcon className="h-3 w-3" />
              <span>Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMedia("video")}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold transition-all ${
                activeMedia === "video"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
              title="View 360° Video"
            >
              <Film className="h-3 w-3" />
              <span>360° Video</span>
            </button>
          </div>
        )}

        {/* Certificate Tag */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-xs">
          <ShieldCheck className="h-3 w-3 text-blue-600" />
          <span>{diamond.lab} {diamond.certificateNo}</span>
        </div>
      </div>

      {/* Title & 4Cs Info */}
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            {diamond.shape} Diamond
          </h3>
          <span className="text-xs font-mono font-medium text-slate-500">
            {diamond.stockNumber}
          </span>
        </div>

        {/* 4Cs Metric Bar */}
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-50 p-2 mb-3 text-center border border-slate-200">
          <div>
            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Color</span>
            <span className="text-xs font-bold text-slate-800">{diamond.color}</span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Clarity</span>
            <span className="text-xs font-bold text-slate-800">{diamond.clarity}</span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Cut</span>
            <span className="text-xs font-bold text-slate-800">{diamond.cut.split(" ")[0]}</span>
          </div>
          <div>
            <span className="block text-[9px] text-slate-500 uppercase font-semibold">Polish</span>
            <span className="text-xs font-bold text-slate-800">{diamond.polish.substring(0, 4)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Exact elevated layout of Screenshot 5: Inquiry + WhatsApp) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onInquire(diamond)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-800 transition-all hover:bg-slate-50 hover:border-slate-400"
        >
          <FileText className="h-4 w-4 text-slate-600" />
          <span>Inquiry</span>
        </button>

        <button
          onClick={openWhatsApp}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-500 shadow-sm"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
