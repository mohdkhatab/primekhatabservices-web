import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categorySlug, getDealById, getDealsByCategory } from "@/lib/deals";
import CopyCode from "@/components/CopyCode";
import DealCard from "@/components/DealCard";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const deal = await getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  const title = `${deal.title} — ${deal.brand}`;
  return {
    title,
    description: deal.description,
    alternates: { canonical: `/deal/${deal.id}` },
    openGraph: { title, description: deal.description, url: `https://primekhatab.in/deal/${deal.id}` },
  };
}

export default async function DealPage({ params }: { params: { id: string } }) {
  const deal = await getDealById(params.id);
  if (!deal) notFound();
  const related = (await getDealsByCategory(deal.category)).filter((d) => d.id !== deal.id).slice(0, 3);

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: deal.title,
    description: deal.description,
    url: `https://primekhatab.in/deal/${deal.id}`,
    category: deal.category,
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    validThrough: deal.expiry,
    seller: { "@type": "Organization", name: deal.brand },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href={`/category/${categorySlug(deal.category)}`} className="hover:text-brand-600">
          {deal.category}
        </Link>{" "}
        / <span className="font-semibold text-stone-900">{deal.brand}</span>
      </nav>

      <article className="mt-5 animate-fade-up rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50/60 p-6 shadow-card md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          {deal.badge && <span className="rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-3 py-1 text-xs font-bold text-white shadow-[0_0_18px_-4px_rgba(236,72,153,0.8)]">{deal.badge}</span>}
          {deal.verified && <span className="text-sm font-semibold text-rose-600">✓ Verified deal</span>}
          <span className="text-sm text-stone-500">Expires: {deal.expiry}</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-stone-900 md:text-4xl">{deal.title}</h1>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-stone-500">{deal.brand} · {deal.category}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone-600">{deal.description}</p>

        <div className="mt-6 max-w-md">
          <p className="mb-2 text-sm font-bold text-stone-900">Promo code</p>
          <CopyCode code={deal.code} large />
        </div>
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="btn-shine relative mt-6 inline-block overflow-hidden rounded-full bg-gradient-to-r from-brand-500 via-pink-500 to-rose-500 px-8 py-3 font-display font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
        >
          Get This Deal on {deal.brand} →
        </a>
        <p className="mt-3 text-xs text-stone-500">
          You will go to the official {deal.brand} website. Always check the final price and code there before paying.
        </p>
      </article>

      <AdSlot placement="banner" className="my-8" />

      {related.length > 0 && (
        <>
          <h2 className="font-display text-xl font-bold text-stone-900">More {deal.category} deals</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((d, i) => (
              <DealCard key={d.id} deal={d} index={i} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
