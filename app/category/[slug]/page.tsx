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
    openGraph: { title, description, url: `https://primekhatab.in/category/${params.slug}` },
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> / <span className="font-semibold text-stone-900">{category}</span>
      </nav>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-stone-900 md:text-4xl">{category} — <span className="text-gradient">Free Offers &amp; Promo Codes</span></h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        {deals.length} live deal{deals.length === 1 ? "" : "s"} in {category}. Copy the promo code, tap Get Deal, and save.
      </p>
      <AdSlot placement="top" className="my-6" />
      {deals.length === 0 ? (
        <p className="animate-fade-in rounded-2xl border border-pink-100 bg-pink-50/50 p-8 text-center text-stone-500">
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
