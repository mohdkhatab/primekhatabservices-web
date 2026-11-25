import Link from "next/link";
import { formatDate, getCategoryNames, getDeals, type Deal } from "@/lib/deals";
import DealsExplorer from "@/components/DealsExplorer";
import AdSlot from "@/components/AdSlot";
import DealCard from "@/components/DealCard";
import TrendingCard from "@/components/TrendingCard";
import VerifiedDeals from "@/components/VerifiedDeals";
import Newsletter from "@/components/Newsletter";
import BrandTile from "@/components/BrandTile";
import CopyCode from "@/components/CopyCode";

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
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-stone-900 md:text-3xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h2>
        {sub && <p className="mt-1 text-sm text-stone-500">{sub}</p>}
      </div>
      {href && linkLabel && (
        <Link href={href} className="font-display text-sm font-bold text-brand-600 transition hover:text-brand-700 hover:underline">
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
  const newArrivals = byNewest.slice(0, 6);
  const trending = [...deals].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0)).slice(0, 8);
  const featured: Deal = deals.find((d) => d.featured) ?? trending[0] ?? deals[0];
  const lastUpdated = byNewest[0]?.created_at;

  // Spotlight: one entry per brand (first deal wins), logo-only grid.
  const brands = new Map<string, Deal>();
  deals.forEach((d) => {
    if (!brands.has(d.brand)) brands.set(d.brand, d);
  });
  const brandList = Array.from(brands.values());

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
      <section className="relative overflow-hidden py-10 md:py-14">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-[85%] animate-float rounded-full bg-pink-200/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -top-10 right-0 h-64 w-64 translate-x-1/3 animate-float rounded-full bg-rose-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-pink-50/80 to-white" />
        <div className="relative animate-fade-up text-center">
          <span className="inline-block rounded-full border border-pink-200 bg-pink-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            Daily Updated · 100% Free to Use
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-stone-900 md:text-6xl">
            Pay Less for the Tools <span className="text-gradient">You Already Love</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-stone-500">
            Software, startup, student and developer deals — free tiers, promo codes, credits and
            discounts, collected from across the internet and checked by hand before they reach this page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-stone-600">
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">{deals.length}+ Live Deals</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">{categories.length} Categories</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">✓ Verified Offers</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">No Login Needed</span>
            {lastUpdated && (
              <span className="rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-3 py-1.5 font-bold text-white shadow-glow">
                Last updated: {formatDate(lastUpdated)}
              </span>
            )}
          </div>
        </div>

        {/* Featured / sponsored hero poster */}
        {featured && (
          <div className="relative mx-auto mt-10 max-w-3xl animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div aria-hidden className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300 opacity-60 blur-lg" />
            <div className="relative overflow-hidden rounded-[2rem] border border-pink-200 bg-white p-6 shadow-lift md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">Featured</span>
                <span className="rounded-full bg-pink-100 px-3 py-1 text-[11px] font-bold text-brand-700">{featured.category}</span>
                {featured.type && <span className="text-xs font-bold text-pink-400">#{featured.type}</span>}
              </div>
              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <BrandTile brand={featured.brand} size="xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-400">{featured.brand}</p>
                  <Link href={`/deal/${featured.id}`} className="mt-1 block font-display text-xl font-extrabold leading-snug text-stone-900 transition hover:text-brand-600 md:text-2xl">
                    {featured.title}
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">{featured.description}</p>
                </div>
                {featured.badge && (
                  <span className="relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 px-4 py-3 text-center font-display text-lg font-extrabold text-white shadow-glow">
                    {featured.badge}
                    <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-shine bg-white/50 blur-[2px]" />
                  </span>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="sm:w-72">
                  <CopyCode code={featured.code} />
                </div>
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-500 via-pink-500 to-rose-500 px-8 py-3 text-center font-display font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Claim This Deal →
                </a>
                <Link href={`/deal/${featured.id}`} className="text-center text-sm font-bold text-brand-600 transition hover:underline sm:text-left">
                  Full details
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============ NEW ARRIVALS ============ */}
      <section id="new-arrivals" className="mt-6 scroll-mt-32">
        <SectionHeading title="New" accent="Arrivals" sub="The freshest deals we have checked and posted." href="#all-deals" linkLabel="Show all deals" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((d, i) => (
            <DealCard key={d.id} deal={d} index={i} />
          ))}
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
              className="group flex animate-fade-up flex-col items-center gap-2 rounded-3xl border border-pink-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lift"
              style={{ animationDelay: `${Math.min(i, 14) * 50}ms` }}
            >
              <BrandTile brand={d.brand} size="lg" className="transition-transform duration-300 group-hover:scale-110" />
              <span className="line-clamp-1 text-center text-xs font-bold text-stone-700 group-hover:text-brand-600">{d.brand}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ TRENDING DEALS ============ */}
      <section className="mt-16">
        <SectionHeading title="Trending" accent="Deals" sub="What everyone is clicking right now." />
        <div className="-mx-4 overflow-x-auto px-4 pb-4">
          <div className="flex snap-x snap-mandatory gap-5">
            {trending.map((d, i) => (
              <TrendingCard key={d.id} deal={d} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <AdSlot placement="top" className="mt-8" />

      {/* ============ RECENTLY VERIFIED ============ */}
      <section className="mt-16">
        <SectionHeading title="Recently" accent="Verified" sub="Rich detail on every deal — views, clicks, status and the code itself." />
        <VerifiedDeals deals={deals} />
      </section>

      {/* ============ ALL DEALS EXPLORER ============ */}
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

      <section className="mt-10 animate-fade-up rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-stone-900 md:text-xl">Know a free offer or promo code?</h2>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-stone-500">
          Share it and help everyone save. Send the deal and it will be checked and posted here.
        </p>
        <a
          href="/submit-deal"
          className="btn-shine relative mt-4 inline-block overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-7 py-2.5 font-display font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          Submit a Deal
        </a>
      </section>
    </>
  );
}
