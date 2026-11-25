import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryFromSlug,
  categorySlug,
  getCategoryNames,
  getDealsByCategory,
} from "@/lib/deals";
import DealCard from "@/components/DealCard";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

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
  const description = `Best free offers, promo codes and deals in ${category}. Checked and updated daily on Prime Khatab Deals — no login, copy the code and save.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `https://primekhatab.in/category/${params.slug}`,
      type: "website",
      images: [{ url: "https://primekhatab.inhttps://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg", width: 1200, height: 630, alt: "Prime Khatab Deals" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://primekhatab.inhttps://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg"],
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
      url: `https://primekhatab.in/deal/${d.id}`,
      name: d.title,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://primekhatab.in/" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "https://primekhatab.in/categories" },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `https://primekhatab.in/category/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href="/categories" className="hover:text-brand-600">Categories</Link> /{" "}
        <span className="font-semibold text-slate-900">{category}</span>
      </nav>
      <div className="mt-4 rounded-3xl bg-blue-50 px-6 py-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {category} — <span className="text-gradient">Free Offers &amp; Promo Codes</span>
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          {deals.length} live deal{deals.length === 1 ? "" : "s"} in {category}. Copy the promo code,
          tap Get Deal, and save.
        </p>
      </div>
      <AdSlot placement="top" className="my-6" />
      {deals.length === 0 ? (
        <p className="animate-fade-in rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center text-slate-500">
          No live deals in this category right now — check back soon, new deals are added regularly.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((d, i) => (
            <DealCard key={d.id} deal={d} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
