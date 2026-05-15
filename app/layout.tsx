import type { Metadata, Viewport } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { MobileNav } from "@/components/ui/MobileNav";
import { HeaderNav } from "@/components/ui/HeaderNav";
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
          <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
              <a href="/" className="font-display text-2xl font-bold tracking-tight text-primary">
                HAETAE
              </a>
              <HeaderNav />
              <MobileNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
