"use client";

import React, { useState } from "react";
import { Gem, Sparkles, Award, Scale, Check } from "lucide-react";

export default function FourCsVisualizer() {
  const [activeTab, setActiveTab] = useState<"carat" | "cut" | "color" | "clarity">("carat");
  const [caratSize, setCaratSize] = useState<number>(1.5);
  const [selectedColor, setSelectedColor] = useState<string>("D");

  const colors = [
    { grade: "D", desc: "Completely Colorless (Highest Grade)", tint: "bg-white" },
    { grade: "E", desc: "Colorless (Minute traces detected by gemologists only)", tint: "bg-white" },
    { grade: "F", desc: "Colorless (Exceptional brilliance and white fire)", tint: "bg-white" },
    { grade: "G", desc: "Near Colorless (High value for fine jewelry)", tint: "bg-amber-50" },
    { grade: "H", desc: "Near Colorless (Warm sparkle in yellow gold)", tint: "bg-amber-100" },
    { grade: "I", desc: "Near Colorless (Slight warm tone)", tint: "bg-amber-200" },
  ];

  const clarities = [
    { grade: "FL / IF", title: "Flawless / Internally Flawless", desc: "No internal inclusions visible under 10x magnification. Extremely rare." },
    { grade: "VVS1 - VVS2", title: "Very Very Slightly Included", desc: "Minute inclusions difficult even for skilled gemologists to see." },
    { grade: "VS1 - VS2", title: "Very Slightly Included", desc: "Minor inclusions not visible to naked eyes (100% Eye-Clean)." },
    { grade: "SI1 - SI2", title: "Slightly Included", desc: "Noticeable inclusions under 10x loop magnification, great commercial price." },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          Buyer&apos;s Diamond Quality Guide
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          The 4Cs of Diamond Grading
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Learn how Maa Diamond evaluates every stone according to international GIA diamond standards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-slate-200 pb-4">
        {[
          { id: "carat", label: "1. Carat (Weight)", icon: Scale },
          { id: "cut", label: "2. Cut (Fire & Sparkle)", icon: Award },
          { id: "color", label: "3. Color (D-Z Scale)", icon: Gem },
          { id: "clarity", label: "4. Clarity (Purity)", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="max-w-3xl mx-auto">
        {/* CARAT */}
        {activeTab === "carat" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div
                className="relative flex items-center justify-center rounded-full bg-slate-200 border-2 border-amber-400 p-1 shadow-md transition-all duration-300"
                style={{
                  width: `${Math.max(60, caratSize * 45)}px`,
                  height: `${Math.max(60, caratSize * 45)}px`,
                }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <Gem className="text-amber-500" style={{ width: `${Math.max(24, caratSize * 18)}px`, height: `${Math.max(24, caratSize * 18)}px` }} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="font-serif text-3xl font-extrabold text-slate-900">
                  {caratSize.toFixed(2)} Carat
                </span>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Estimated Diameter: ~{(5.2 + caratSize * 1.5).toFixed(1)} mm (Round Brilliant)
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs text-slate-600 font-semibold mb-2">
                <span>0.50 ct (Delicate)</span>
                <span className="text-slate-900">Drag to Change Carat Weight</span>
                <span>3.00 ct (Solitaire)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={caratSize}
                onChange={(e) => setCaratSize(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </div>
        )}

        {/* CUT */}
        {activeTab === "cut" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                grade: "Ideal / Triple Excellent",
                badge: "Maa Diamond Standard",
                desc: "Maximum optical refraction. All light entering the diamond reflects directly back to your eye with zero leakage.",
                rating: "100% Sparkle",
              },
              {
                grade: "Very Good",
                badge: "Commercial Quality",
                desc: "Reflects almost all light with intense sparkle. Slightly lower contrast or depth variation.",
                rating: "85% Sparkle",
              },
              {
                grade: "Good / Fair",
                badge: "Standard",
                desc: "Shallow or deep cut proportions. Substantial light escapes through the bottom, resulting in a darker center.",
                rating: "60% Sparkle",
              },
            ].map((cut) => (
              <div
                key={cut.grade}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-1">
                    {cut.badge}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-slate-900 mb-2">{cut.grade}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{cut.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Light Return:</span>
                  <span className="text-emerald-700">{cut.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COLOR */}
        {activeTab === "color" && (
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              {colors.map((c) => (
                <button
                  key={c.grade}
                  onClick={() => setSelectedColor(c.grade)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedColor === c.grade
                      ? "border-amber-500 bg-amber-50 ring-2 ring-amber-400 shadow-sm"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="block font-serif text-2xl font-extrabold text-slate-900">{c.grade}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Color</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <span className="font-serif text-2xl font-bold text-slate-900 mb-1 block">
                Grade {selectedColor}
              </span>
              <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                {colors.find((c) => c.grade === selectedColor)?.desc}
              </p>
            </div>
          </div>
        )}

        {/* CLARITY */}
        {activeTab === "clarity" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clarities.map((cl) => (
              <div
                key={cl.grade}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-lg font-bold text-amber-700">{cl.grade}</h4>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{cl.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{cl.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
