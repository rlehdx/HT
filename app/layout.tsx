import type { Metadata, Viewport } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { MobileNav } from "@/components/ui/MobileNav";

export const metadata: Metadata = {
  title: "HAE - B2B/B2C Ordering Platform",
  description: "Premium goods for discerning buyers — B2B and B2C, one seamless experience.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-surface">
        <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
            <a href="/" className="text-xl font-bold text-primary tracking-tight">HAE</a>
            {/* 데스크탑 네비 */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/products" className="text-sm font-medium text-text-sub hover:text-text-main transition-colors">Products</a>
              <a href="/checkout" className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent transition-colors">
                Cart
              </a>
            </nav>
            {/* 모바일 네비 */}
            <MobileNav />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
