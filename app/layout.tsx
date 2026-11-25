import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

// One font only (UI_SPEC): Inter, self-hosted/optimized by next/font.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL = "https://primekhatab.in";
const OG_IMAGE = `https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg`;
const SITE_DESCRIPTION =
  "Daily checked free offers, promo codes and deals: coding platforms, hosting, AI tools, shopping, student offers, startup deals, finance apps, travel, food and recharge offers. No login — copy the code and go.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prime Khatab Deals — Free Offers, Promo Codes & Deals in India",
    template: "%s | Prime Khatab Deals",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "free promo codes india",
    "free offers",
    "coupon codes india",
    "student deals",
    "hosting offers",
    "startup deals",
    "ai tools free",
    "prime khatab deals",
  ],
  authors: [{ name: "Prime Khatab Services", url: SITE_URL }],
  creator: "Prime Khatab Services",
  publisher: "Prime Khatab Services",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon.ico", sizes: "any" },
      { url: "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Prime Khatab Deals",
    title: "Prime Khatab Deals — Free Offers, Promo Codes & Deals",
    description:
      "Free offers, promo codes & deals across coding, hosting, AI tools, shopping, students, startups and more. Daily updated, no login.",
    locale: "en_IN",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Prime Khatab Deals — Free Offers, Promo Codes & Deals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Khatab Deals — Free Offers, Promo Codes & Deals",
    description:
      "Free offers, promo codes & deals — coding, hosting, AI tools, shopping, student & startup deals. No login.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Prime Khatab Deals",
  url: SITE_URL,
  description:
    "Free offers, promo codes and deals in India — coding, hosting, AI tools, shopping, student offers, startup deals and more.",
  publisher: { "@type": "Organization", name: "Prime Khatab Services", url: SITE_URL },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Prime Khatab Services",
  url: SITE_URL,
  logo: `https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/logo.png`,
  brand: { "@type": "Brand", name: "Prime Khatab Deals" },
  email: "startup@primekhatab.in",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Favicon set in public/ — declared explicitly because the app/icon.png
            file convention otherwise replaces the metadata icons output. */}
        <link rel="icon" href="https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/apple-touch-icon.png" />
      </head>
      <body className="bg-white font-sans text-slate-800 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Ad network scripts go here when approved, e.g. Google AdSense:
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossOrigin="anonymous" />
            HilltopAds: paste the site verification / zone script here. */}
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
