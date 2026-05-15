import type { Metadata, Viewport } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { MobileNav } from "@/components/ui/MobileNav";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "HAETAE — B2B/B2C Ordering Platform",
  description: "Premium goods for discerning B2B and B2C buyers worldwide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
            <a href="/" className="font-display text-2xl font-bold tracking-tight text-primary">
              HAETAE
            </a>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="/products" className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all">
                Products
              </a>
              <a href="/checkout" className="ml-2 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Cart
              </a>
            </nav>
            <MobileNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
