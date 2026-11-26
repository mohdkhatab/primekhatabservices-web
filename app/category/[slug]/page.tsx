import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryFromSlug,
  categorySlug,
  getCategoryNames,
  getDealsByCategory,
} from "@/lib/deals";
import DealCard from "@/components/DealCard";
import EmptyState from "@/components/EmptyState";
import NativeAd from "@/components/NativeAd";

export const dynamic = "force-dynamic";

const OG_IMAGE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg";

export function generateStaticParams() {
  return getCategoryNames().map((c) => ({ slug: categorySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = categoryFromSlug(params.slug);
  if (!category) return { title: "Category not found" };
  const title = `${category} — Free Offers & Promo Codes`;
  const description = `Free offers, promo codes and deals in ${category}. Updated on Prime Khatab Deals — no login, copy the code and save.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.primekhatab.in/category/${params.slug}`,
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Prime Khatab Deals" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryFromSlug(params.slug);
  if (!category) notFound();
  const deals = await getDealsByCategory(category);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} deals on Prime Khatab Deals`,
    itemListElement: deals.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.primekhatab.in/deal/${d.id}`,
      name: d.title,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.primekhatab.in/" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "https://www.primekhatab.in/categories" },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `https://www.primekhatab.in/category/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="text-[13px] text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href="/categories" className="hover:text-brand-600">Categories</Link> /{" "}
        <span className="font-medium text-slate-900">{category}</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">{category}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Free offers, promo codes and deals in {category}.
      </p>

      {deals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <Fragment key={d.id}>
              <DealCard deal={d} />
              <NativeAd variant="grid" />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
