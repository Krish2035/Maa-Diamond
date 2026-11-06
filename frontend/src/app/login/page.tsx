"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gem, ShieldCheck, User, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async (role: "ADMIN" | "USER") => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await quickDemoLogin(role);
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in with demo account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-16">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-slate-900">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white mb-3 shadow-md">
              <Gem className="h-7 w-7 text-amber-400" />
            </div>
            <h1 className="font-serif text-2xl font-extrabold text-slate-900">
              Sign In to Maa Diamond
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              B2B Jeweler Portal & Admin Management Suite
            </p>
          </div>

          {/* Quick 1-Click Demo Testing */}
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-2.5 text-center">
              ⚡ Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo("ADMIN")}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Admin Suite</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo("USER")}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 py-2.5 px-3 text-xs font-bold text-slate-800 transition-all shadow-xs"
              >
                <User className="h-4 w-4 text-slate-600" />
                <span>Buyer Portal</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maadiamond.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            <span>Don&apos;t have a buyer account? </span>
            <Link href="/register" className="text-amber-700 hover:underline font-bold">
              Register New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
