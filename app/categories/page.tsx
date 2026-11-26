import type { Metadata } from "next";
import Link from "next/link";
import { DEAL_TYPES, categorySlug, getCategoryNames } from "@/lib/deals";

export const revalidate = 60;

const OG_IMAGE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg";

export const metadata: Metadata = {
  title: "Categories — Topics & Deal Types",
  description:
    "Browse Prime Khatab Deals by topic (coding, hosting, AI tools, shopping, student offers, startup deals and more) or by deal type (freebies, discounts, trials, credits, promo codes, no credit card).",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Categories — Topics & Deal Types | Prime Khatab Deals",
    description:
      "Browse deals by topic or by deal type — coding, hosting, AI tools, shopping, student offers, startup deals, freebies, credits and promo codes.",
    url: "https://www.primekhatab.in/categories",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Prime Khatab Deals" }],
  },
};

function PlainRow({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[44px] items-center justify-between border-b border-slate-100 px-1 py-3 text-sm text-slate-700 hover:text-brand-600"
      >
        <span>{label}</span>
        <span aria-hidden className="text-slate-300">
          ›
        </span>
      </Link>
    </li>
  );
}

export default function CategoriesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.primekhatab.in/" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "https://www.primekhatab.in/categories" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="text-[13px] text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <span className="font-medium text-slate-900">Categories</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">Categories</h1>
      <p className="mt-1 text-sm text-slate-500">
        Browse deals by topic, or by how the deal works.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Topics</h2>
      <ul className="mt-2 border-t border-slate-100">
        {getCategoryNames().map((name) => (
          <PlainRow key={name} href={`/category/${categorySlug(name)}`} label={name} />
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Deal Types</h2>
      <ul className="mt-2 border-t border-slate-100">
        {DEAL_TYPES.map((name) => (
          <PlainRow key={name} href={`/?type=${encodeURIComponent(name)}`} label={name} />
        ))}
      </ul>
    </>
  );
}
