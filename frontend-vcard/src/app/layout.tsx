import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maa Diamond | Digital Business Card & Trade Desk",
  description:
    "Official Digital vCard of Maa Diamond - Certified Diamond Manufacturers at Akshar Diamond Market, Varachha, Surat. Direct factory quotes, WhatsApp trade desk, and contact sync.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Maa Diamond - Digital Business Card",
    description: "Certified Natural & Lab Grown Diamond Manufacturers at Surat Diamond Bourse.",
    type: "profile",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
        <main>{children}</main>
      </body>
    </html>
  );
}
