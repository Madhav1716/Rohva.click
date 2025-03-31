import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohva – Capture, Edit & Share Stunning Photos",
  description:
    "Rohva is a powerful online photo booth app built with Next.js. Capture, edit, and share your photos effortlessly with stunning effects.",
  keywords: [
    "Rohva",
    "photo booth",
    "online photo editing",
    "Next.js",
    "image capture",
    "photo effects",
  ],
  authors: [{ name: "Your Name", url: "https://rohva.com" }],
  robots: "index, follow",
  openGraph: {
    title: "Rohva – The Ultimate Online Photo Booth",
    description:
      "Capture, edit, and share amazing photos instantly with Rohva, your go-to online photo booth.",
    url: "https://rohva.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
