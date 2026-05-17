import type { Metadata, Viewport } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { MobileNav } from "@/components/ui/MobileNav";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { TabNav } from "@/components/ui/TabNav";
import { MobileTabBar } from "@/components/ui/MobileTabBar";
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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-surface flex flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-0 h-16">
              {/* 로고 */}
              <a href="/" className="font-display text-2xl font-bold tracking-tight text-primary flex-shrink-0">
                HAETAE
              </a>
              {/* 탭 네비게이션 — 로고 바로 옆 */}
              <TabNav />
              {/* 우측: 인증/카트 */}
              <div className="ml-auto flex-shrink-0">
                <HeaderNav />
              </div>
              <MobileNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileTabBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
