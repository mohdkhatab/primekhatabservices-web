import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getDeals } from "@/lib/deals";

// Premium fonts, self-hosted/optimized by next/font (no layout shift, fast).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://primekhatab.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prime Khatab Deals — Free Offers, Promo Codes & Deals in India",
    template: "%s | Prime Khatab Deals",
  },
  description:
    "Daily checked free offers, promo codes and deals: coding platforms, hosting, AI tools, shopping, student offers, startup deals, finance apps, travel, food and recharge offers. No login — copy the code and go.",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Prime Khatab Deals",
    title: "Prime Khatab Deals — Free Offers, Promo Codes & Deals",
    description:
      "Free offers, promo codes & deals across coding, hosting, AI tools, shopping, students, startups and more. Daily updated, no login.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Khatab Deals — Free Offers, Promo Codes & Deals",
    description:
      "Free offers, promo codes & deals — coding, hosting, AI tools, shopping, student & startup deals. No login.",
  },
  robots: { index: true, follow: true },
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const deals = await getDeals();
  const featuredDeal = deals.find((d) => d.featured) ?? deals[0];
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="bg-white font-sans text-stone-800 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Ad network scripts go here when approved, e.g. Google AdSense:
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossOrigin="anonymous" />
            HilltopAds: paste the site verification / zone script here. */}
        {featuredDeal && <AnnouncementBar deal={featuredDeal} />}
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
