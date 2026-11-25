import type { Metadata } from "next";
import Link from "next/link";
import { DEAL_TYPES, categorySlug, getCategoryNames, getDeals } from "@/lib/deals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories — Topics & Deal Types",
  description:
    "Browse Prime Khatab Deals two ways: by topic (coding, hosting, AI tools, shopping, student offers, startup deals and more) or by deal type (freebies, discounts, trials, credits, promo codes, no credit card).",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const deals = await getDeals();
  const topics = getCategoryNames().map((name) => ({
    name,
    count: deals.filter((d) => d.category === name).length,
  }));
  const types = DEAL_TYPES.map((name) => ({
    name,
    count: deals.filter((d) => d.type === name).length,
  }));

  return (
    <>
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <span className="font-semibold text-stone-900">Categories</span>
      </nav>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-stone-900 md:text-4xl">
        Browse by <span className="text-gradient">Topic &amp; Type</span>
      </h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        Two ways to find your saving: pick a topic you care about, or pick how the deal works.
      </p>

      <h2 className="mt-10 font-display text-xl font-bold text-stone-900">Topics</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => (
          <Link
            key={t.name}
            href={`/category/${categorySlug(t.name)}`}
            className="group flex animate-fade-up items-center justify-between rounded-3xl border border-pink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:bg-gradient-to-b hover:from-white hover:to-pink-50 hover:shadow-lift"
            style={{ animationDelay: `${Math.min(i, 11) * 50}ms` }}
          >
            <span>
              <span className="block font-display font-bold text-stone-900 group-hover:text-brand-600">{t.name}</span>
              <span className="mt-0.5 block text-sm text-stone-500">
                {t.count} live deal{t.count === 1 ? "" : "s"}
              </span>
            </span>
            <span className="rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-3 py-1 font-display text-sm font-extrabold text-white shadow-glow">
              {t.count}
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-bold text-stone-900">Deal Types</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t, i) => (
          <Link
            key={t.name}
            href={`/?type=${encodeURIComponent(t.name)}#all-deals`}
            className="group flex animate-fade-up items-center justify-between rounded-3xl border border-pink-100 bg-pink-50/50 p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50 hover:shadow-lift"
            style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
          >
            <span>
              <span className="block font-display font-bold text-brand-700">#{t.name}</span>
              <span className="mt-0.5 block text-sm text-stone-500">
                {t.count} live deal{t.count === 1 ? "" : "s"}
              </span>
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-display text-sm font-extrabold text-brand-600 ring-1 ring-pink-200">
              {t.count}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
