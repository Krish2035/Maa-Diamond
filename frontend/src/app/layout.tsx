import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import FloatingDock from "@/components/FloatingDock";

export const metadata: Metadata = {
  title: "Maa Diamond | Certified Natural & Lab-Grown Diamond Manufacturers",
  description:
    "Maa Diamond - Premier diamond merchant and lapidary manufacturer based in Surat Diamond Bourse. GIA & IGI certified diamonds, direct factory pricing, and global export.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "Maa Diamond",
    "Surat Diamond Bourse",
    "G.B Brothers",
    "Loose Diamonds",
    "GIA Certified Diamonds",
    "Diamond Manufacturer Surat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-white">{children}</main>
          <FloatingDock />
        </AuthProvider>
      </body>
    </html>
  );
}
