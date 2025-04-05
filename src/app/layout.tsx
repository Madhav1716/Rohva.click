import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohva – Vintage Photo Booth & Memory Maker",
  description: "Transform your photos into timeless memories with Rohva's vintage photo booth. Create, customize, and share beautiful vintage-style photos instantly. No account needed, free to use!",
  keywords: [
    "Rohva",
    "vintage photo booth",
    "online photo editing",
    "retro photo effects",
    "vintage photo filters",
    "photo sharing",
    "nostalgic photos",
    "vintage photography",
    "photo customization",
    "instant photo effects",
    "free photo editor",
    "vintage memories"
  ],
  authors: [{ name: "Maddy", url: "https://rohva.click" }],
  robots: "index, follow",
  openGraph: {
    title: "Rohva – Create Timeless Vintage Photos Instantly",
    description: "Transform your moments into beautiful vintage memories. Free online photo booth with artistic filters, easy sharing, and instant downloads.",
    url: "https://rohva.click",
    siteName: "Rohva",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Rohva Vintage Photo Booth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohva – Vintage Photo Booth & Memory Maker",
    description: "Create beautiful vintage-style photos instantly. No account needed!",
    images: ["/twitter-image.jpg"], // You'll need to add this image
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f8f1e4",
  manifest: "/manifest.json", // You'll need to create this
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // You'll need to add this
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://rohva.click" />
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning>
        <JsonLd />
        <GoogleAnalytics ga_id="G-6XDZ53773G" />
        {children}
      </body>
    </html>
  );
}
