import Link from "next/link";
import { categorySlug, formatDate, getCategoryNames, getDeals, type Deal } from "@/lib/deals";
import DealsExplorer from "@/components/DealsExplorer";
import AdSlot from "@/components/AdSlot";
import DealCard from "@/components/DealCard";
import TrendingCard from "@/components/TrendingCard";
import VerifiedDeals from "@/components/VerifiedDeals";
import Newsletter from "@/components/Newsletter";
import BrandTile from "@/components/BrandTile";
import HeroSearch from "@/components/HeroSearch";
import FeaturedPoster from "@/components/FeaturedPoster";

export const dynamic = "force-dynamic";

function SectionHeading({
  title,
  accent,
  sub,
  href,
  linkLabel,
}: {
  title: string;
  accent?: string;
  sub?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h2>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="font-display text-sm font-bold text-brand-600 transition hover:text-brand-700 hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; type?: string };
}) {
  const deals = await getDeals();
  const categories = getCategoryNames();

  const byNewest = [...deals].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
  const newArrivals = byNewest.slice(0, 8);
  // Trending rail: real fields only — newest first, deals with an offer badge ahead of plain ones.
  const trending = [...deals].sort((a, b) => {
    const badgeDiff = (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    if (badgeDiff !== 0) return badgeDiff;
    return (b.created_at ?? "").localeCompare(a.created_at ?? "");
  });
  const featured: Deal | undefined = deals.find((d) => d.featured) ?? byNewest[0];
  const lastUpdated = byNewest[0]?.created_at;

  // Spotlight: one entry per brand (first deal wins).
  const brands = new Map<string, Deal>();
  deals.forEach((d) => {
    if (!brands.has(d.brand)) brands.set(d.brand, d);
  });
  const brandList = Array.from(brands.values());

  // Popular topics for hero chips: categories with the most live deals (computed).
  const popularTopics = categories
    .map((name) => ({ name, count: deals.filter((d) => d.category === name).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest verified deals on Prime Khatab Deals",
    itemListElement: byNewest.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://primekhatab.in/deal/${d.id}`,
      name: d.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-50 px-5 py-10 sm:px-8 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 translate-x-1/3 animate-float rounded-full bg-blue-200/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 -translate-x-1/3 animate-float rounded-full bg-sky-200/50 blur-3xl"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full border border-blue-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              Daily Updated · Free to Use
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 md:text-5xl">
              Pay Less for the Tools <span className="text-gradient">You Already Love</span>
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-slate-500">
              Software, startup, student and developer deals — free tiers, promo codes, credits and
              discounts, collected from across the internet and checked by hand before they reach this
              page.
            </p>
            <div className="mt-6 max-w-xl">
              <HeroSearch />
            </div>
            {popularTopics.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Popular:</span>
                {popularTopics.map((t) => (
                  <Link
                    key={t.name}
                    href={`/category/${categorySlug(t.name)}`}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-700 ring-1 ring-blue-200 transition hover:bg-blue-100"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-blue-100">
                {deals.length} live deals
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-blue-100">
                {categories.length} categories
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-blue-100">No login needed</span>
              {lastUpdated && (
                <span className="rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-3 py-1.5 font-bold text-white shadow-glow">
                  Last updated: {formatDate(lastUpdated)}
                </span>
              )}
            </div>
          </div>

          {featured && <FeaturedPoster deal={featured} />}
        </div>
      </section>

      {/* ============ NEW ARRIVALS ============ */}
      <section id="new-arrivals" className="mt-14 scroll-mt-32">
        <SectionHeading
          title="New"
          accent="Arrivals"
          sub="The freshest deals we have checked and posted."
          href="#all-deals"
          linkLabel="Show all deals"
        />
        <div className="rail-scroll -mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex snap-x snap-mandatory gap-5">
            {newArrivals.map((d, i) => (
              <DealCard key={d.id} deal={d} index={i} className="w-[300px] shrink-0 snap-start sm:w-[330px]" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEALS IN SPOTLIGHT ============ */}
      <section className="mt-16">
        <SectionHeading title="Deals in" accent="Spotlight" sub="Every brand currently listed — tap a logo to open its deal." />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {brandList.map((d, i) => (
            <Link
              key={d.brand}
              href={`/deal/${d.id}`}
              className="group flex animate-fade-up flex-col items-center gap-2.5 rounded-2xl border border-blue-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lift"
              style={{ animationDelay: `${Math.min(i, 14) * 50}ms` }}
            >
              <BrandTile
                brand={d.brand}
                logoUrl={d.logoUrl}
                size="lg"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className="line-clamp-1 text-center text-xs font-bold text-slate-700 group-hover:text-brand-600">
                {d.brand}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ TRENDING NOW ============ */}
      <section className="mt-16">
        <SectionHeading title="Trending" accent="Now" sub="The newest offers with the strongest savings, first." />
        <div className="rail-scroll -mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex snap-x snap-mandatory gap-5">
            {trending.map((d, i) => (
              <TrendingCard key={d.id} deal={d} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="top" className="mt-10" />

      {/* ============ RECENTLY VERIFIED ============ */}
      <section className="mt-16">
        <SectionHeading title="Recently" accent="Verified" sub="Checked by hand — listed date and expiry on every deal." />
        <VerifiedDeals deals={deals} />
      </section>

      {/* ============ BROWSE ALL DEALS ============ */}
      <section id="all-deals" className="mt-16 scroll-mt-32">
        <SectionHeading title="Browse" accent="All Deals" sub="Search everything, filter by topic or by deal type." />
        <DealsExplorer
          deals={deals}
          categories={categories}
          initialQuery={searchParams?.q ?? ""}
          initialType={searchParams?.type ?? "All"}
        />
      </section>

      <Newsletter />

      <section className="mt-10 animate-fade-up rounded-3xl border border-blue-100 bg-white p-6 text-center shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-slate-900 md:text-xl">Know a free offer or promo code?</h2>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-slate-500">
          Share it and help everyone save. Send the deal and it will be checked and posted here.
        </p>
        <a
          href="/submit-deal"
          className="btn-shine relative mt-4 inline-block overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-7 py-2.5 font-display font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          Submit a Deal
        </a>
      </section>
    </>
  );
}
