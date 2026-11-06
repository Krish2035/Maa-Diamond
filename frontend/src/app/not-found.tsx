import Link from "next/link";
import { Gem, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-6 shadow-xs">
        <Gem className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 font-medium">
        The page you are looking for does not exist or has been moved. Explore our diamond collection or return to the homepage.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}

