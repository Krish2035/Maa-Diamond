"use client";

import React from "react";
import Link from "next/link";
import { Gem, Shield, Award, MapPin, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Gem className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider text-slate-900">MAA </span>
                <span className="text-xl font-bold tracking-wider text-amber-600">DIAMOND</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Trusted name in the world of fine diamonds. Specializing in precision manufacturing and global diamond trading at Surat Diamond Bourse.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold text-amber-800 shadow-xs">
                <Shield className="h-3 w-3 text-amber-600" /> Kimberley Process
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-[10px] font-bold text-blue-700 shadow-xs">
                <Award className="h-3 w-3 text-blue-600" /> GIA & IGI Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase mb-4">
              Diamond Cuts
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Round Diamond</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Marquise Diamond</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Pear Diamond</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Princess Diamond</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Emerald Diamond</Link></li>
              <li><Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Cushion & Oval Diamonds</Link></li>
            </ul>
          </div>

          {/* Omnichannel Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/card" className="flex items-center gap-1 text-amber-700 hover:underline font-bold transition-colors">
                  <span>Digital Business Card (vCard)</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Diamond Inventory Catalog
                </Link>
              </li>
              <li>
                <Link href="/#inquiry" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Wholesale Inquiry Desk
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  B2B Client Portal Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">
                  Admin Inventory Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-900 uppercase mb-4">
              Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>217, Akshar Diamond Market, Mangadh Chowk, Mini Bazaar, Varachha, Surat, Gujarat, 395006</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                <a href="tel:+919033320326" className="text-slate-800 font-bold hover:underline">+91 90333 20326 (Hardik Sorathiya)</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <a href="https://wa.me/918000045391" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">
                  +91 80000 45391 (Sanket Sorathiya - WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a href="mailto:info@maadiamond.com" className="text-slate-800 font-semibold hover:underline">info@maadiamond.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Maa Diamond. All Rights Reserved. Surat Diamond Bourse, Gujarat.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0 text-slate-500">
            <span>Natural Diamonds</span>
            <span>Conflict-Free</span>
            <span>GIA & IGI Dossier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
