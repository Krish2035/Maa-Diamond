"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, CURRENCIES, Currency } from "@/lib/auth-context";
import {
  Gem,
  Menu,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  User,
  Heart,
  ChevronDown,
  Globe,
  Phone,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, currency, setCurrency, wishlist } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About Us", href: "/#about-us" },
    { name: "Products", href: "/#products" },
    { name: "4Cs Guide", href: "/#four-cs" },
    { name: "Digital vCard", href: "/card" },
    { name: "Card Studio", href: "/card-studio" },
    { name: "Inquiry", href: "/#inquiry" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
              <Gem className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif text-lg sm:text-xl font-extrabold tracking-wider text-slate-900">
                  MAA
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-amber-600">
                  DIAMOND
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 mt-0.5">
                Surat Diamond Bourse
              </p>
            </div>
          </Link>

          {/* Elegant Divider between Brand and Nav */}
          <div className="hidden lg:block h-6 w-px bg-slate-200 ml-5 xl:ml-8" />
        </div>

        {/* Desktop Navigation with Perfectly Equal Spacing */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-8 2xl:gap-10 px-2 xl:px-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs uppercase tracking-wider font-bold transition-colors hover:text-amber-600 whitespace-nowrap py-1 ${
                  isActive ? "text-amber-600 font-extrabold" : "text-slate-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster with Matching Equal Spacing */}
        <div className="hidden lg:flex items-center shrink-0 gap-3 xl:gap-4">
          {/* Subtle Divider before Actions */}
          <div className="h-6 w-px bg-slate-200 mr-2 xl:mr-3" />

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{CURRENCIES[currency].code}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-xl z-50">
                {(Object.keys(CURRENCIES) as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                      currency === curr
                        ? "bg-amber-50 text-amber-700 font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{curr}</span>
                    <span className="text-slate-500">{CURRENCIES[curr].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Call */}
          <a
            href="tel:+919033320326"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Call Hardik Sorathiya: +91 90333 20326"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xl:inline font-bold">+91 90333 20326</span>
            <span className="xl:hidden font-bold">Call</span>
          </a>

          {/* User Wishlist counter */}
          <Link
            href="/portal"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Wishlist & Inquiries"
          >
            <Heart className="h-4 w-4 text-slate-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Auth Button or User Badge */}
          {user ? (
            user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="flex h-9 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Suite</span>
              </Link>
            ) : (
              <Link
                href="/portal"
                className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-all"
              >
                <User className="h-3.5 w-3.5 text-slate-600" />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
            )
          ) : (
            <Link
              href="/login"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all"
            >
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:text-black"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wide text-slate-800 hover:text-amber-600"
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-medium text-slate-500">Currency:</span>
                <div className="flex gap-1.5">
                  {(Object.keys(CURRENCIES) as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`rounded px-2.5 py-1 text-xs font-bold ${
                        currency === curr
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="text-xs text-slate-500">Signed in as {user.name} ({user.role})</div>
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/portal"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white"
                  >
                    {user.role === "ADMIN" ? "Open Admin Suite" : "Open Buyer Portal"}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white"
                >
                  <User className="h-4 w-4 text-amber-400" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
