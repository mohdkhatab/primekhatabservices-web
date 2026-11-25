import type { Metadata } from "next";
import Link from "next/link";
import { DEAL_TYPES, categorySlug, getCategoryNames, getDeals } from "@/lib/deals";
import BrandTile from "@/components/BrandTile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories — Topics & Deal Types",
  description:
    "Browse Prime Khatab Deals two ways: by topic (coding, hosting, AI tools, shopping, student offers, startup deals and more) or by deal type (freebies, discounts, trials, credits, promo codes, no credit card).",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Categories — Topics & Deal Types | Prime Khatab Deals",
    description:
      "Browse deals by topic or by deal type — coding, hosting, AI tools, shopping, student offers, startup deals, freebies, credits and promo codes.",
    url: "https://primekhatab.in/categories",
    type: "website",
    images: [{ url: "https://primekhatab.inhttps://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg", width: 1200, height: 630, alt: "Prime Khatab Deals" }],
  },
};

export default async function CategoriesPage() {
  const deals = await getDeals();
  const topics = getCategoryNames().map((name) => {
    const inTopic = deals.filter((d) => d.category === name);
    return { name, count: inTopic.length, sample: inTopic[0] };
  });
  const types = DEAL_TYPES.map((name) => ({
    name,
    count: deals.filter((d) => d.type === name).length,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://primekhatab.in/" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "https://primekhatab.in/categories" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <span className="font-semibold text-slate-900">Categories</span>
      </nav>
      <div className="mt-4 rounded-3xl bg-blue-50 px-6 py-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Browse by <span className="text-gradient">Topic &amp; Type</span>
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Two ways to find your saving: pick a topic you care about, or pick how the deal works.
          Counts are live, from the deals listed right now.
        </p>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold text-slate-900">Topics</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => (
          <Link
            key={t.name}
            href={`/category/${categorySlug(t.name)}`}
            className="group flex animate-fade-up items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lift"
            style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
          >
            {t.sample ? (
              <BrandTile brand={t.sample.brand} logoUrl={t.sample.logoUrl} size="md" />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-display text-lg font-extrabold text-brand-600 ring-1 ring-blue-100">
                #
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-display font-bold text-slate-900 group-hover:text-brand-600">{t.name}</span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {t.count} live deal{t.count === 1 ? "" : "s"}
              </span>
            </span>
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-3 py-1 font-display text-sm font-extrabold text-white shadow-glow">
              {t.count}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-bold text-slate-900">Deal Types</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t, i) => (
          <Link
            key={t.name}
            href={`/?type=${encodeURIComponent(t.name)}#all-deals`}
            className="group flex animate-fade-up items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lift"
            style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
          >
            <span>
              <span className="block font-display font-bold text-brand-700">#{t.name}</span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {t.count} live deal{t.count === 1 ? "" : "s"}
              </span>
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-display text-sm font-extrabold text-brand-600 ring-1 ring-blue-200">
              {t.count}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
