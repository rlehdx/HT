import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hae - B2B/B2C Ordering Platform",
  description: "Hybrid ordering platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
