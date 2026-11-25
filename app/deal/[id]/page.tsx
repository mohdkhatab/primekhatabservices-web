import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categorySlug,
  daysLeft,
  dealStatus,
  discountFigure,
  formatDate,
  getDealById,
  getDeals,
} from "@/lib/deals";
import CopyCode from "@/components/CopyCode";
import AdSlot from "@/components/AdSlot";
import BrandTile from "@/components/BrandTile";
import ShareButton from "@/components/ShareButton";
import DealCard from "@/components/DealCard";
import PosterBanner from "@/components/PosterBanner";
import FaqAccordion, { type Faq } from "@/components/FaqAccordion";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const deal = await getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  const title = `${deal.title} — ${deal.brand}`;
  return {
    title,
    description: deal.description,
    alternates: { canonical: `/deal/${deal.id}` },
    openGraph: {
      title,
      description: deal.description,
      url: `https://primekhatab.in/deal/${deal.id}`,
      type: "website",
      images: [{ url: "https://primekhatab.inhttps://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg", width: 1200, height: 630, alt: "Prime Khatab Deals" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: deal.description,
      images: ["https://primekhatab.inhttps://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg"],
    },
  };
}

export default async function DealPage({ params }: { params: { id: string } }) {
  const deal = await getDealById(params.id);
  if (!deal) notFound();

  const all = await getDeals();
  const similar = all
    .filter((d) => d.id !== deal.id)
    .sort((a, b) => {
      const aSame = a.category === deal.category ? 0 : 1;
      const bSame = b.category === deal.category ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    })
    .slice(0, 6);

  const status = dealStatus(deal);
  const left = daysLeft(deal);
  const figure = discountFigure(deal);
  const listed = deal.created_at ? formatDate(deal.created_at) : "";

  const benefits =
    deal.benefits && deal.benefits.length > 0
      ? deal.benefits
      : [
          deal.description,
          "Checked and listed by the Prime Khatab Deals team",
          "Final price and terms confirmed on the official website before you pay",
        ];

  const steps = deal.code
    ? [
        `Tap "Get Deal" to open the official ${deal.brand} website.`,
        `Choose the plan or product this offer applies to.`,
        `Copy the code from this page — ${deal.code} — and paste it in the promo / coupon field at signup or checkout.`,
        `Confirm the discount is applied, then finish. If the code fails, tell us via "Report expired" below.`,
      ]
    : [
        `Tap "Get Deal" to open the official ${deal.brand} website.`,
        `Sign up or open the pricing page — this offer needs no promo code.`,
        `The free tier / discount is applied automatically by ${deal.brand}.`,
        `Confirm the final price shows as expected before you pay anything.`,
      ];

  const faqs: Faq[] = [
    {
      q: `Is this ${deal.brand} deal really free?`,
      a:
        (deal.badge ?? "").toUpperCase() === "FREE" || !deal.code
          ? `Yes — this listing is a free offer from ${deal.brand}. You do not pay Prime Khatab Deals anything; any paid upgrade is optional and happens only on the official ${deal.brand} website.`
          : `This deal gives you ${figure} at ${deal.brand}. You pay only the reduced price on the official website — Prime Khatab Deals never charges you anything.`,
    },
    {
      q: deal.code ? `How do I use the code ${deal.code}?` : `Do I need a promo code for this ${deal.brand} deal?`,
      a: deal.code
        ? `Open the official ${deal.brand} page from the Get Deal button, then paste ${deal.code} into the promo / coupon field during signup or checkout. The saving should appear before you pay.`
        : `No code is needed. The offer is applied automatically when you sign up or buy through the official ${deal.brand} page linked here.`,
    },
    {
      q: `When does this ${deal.brand} deal expire?`,
      a: `This listing is valid until ${formatDate(deal.expiry)}${left <= 45 && left > 0 ? ` — that is about ${left} day${left === 1 ? "" : "s"} from now` : ""}. Brands can change or end offers early, so the date on the official website is final.`,
    },
  ];

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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://primekhatab.in/" },
      {
        "@type": "ListItem",
        position: 2,
        name: deal.category,
        item: `https://primekhatab.in/category/${categorySlug(deal.category)}`,
      },
      { "@type": "ListItem", position: 3, name: deal.brand, item: `https://primekhatab.in/deal/${deal.id}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb: Home / Category / Brand */}
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href={`/category/${categorySlug(deal.category)}`} className="hover:text-brand-600">
          {deal.category}
        </Link>{" "}
        / <span className="font-semibold text-slate-900">{deal.brand}</span>
      </nav>

      {/* Poster banner (real image_url) */}
      <PosterBanner deal={deal} />

      {/* Header block */}
      <div className="mt-6 flex animate-fade-up flex-col gap-5 sm:flex-row sm:items-start">
        <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            {deal.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {deal.brand} · {deal.category}
            {deal.code ? (
              <>
                {" "}· Use code <span className="font-mono font-bold text-brand-700">{deal.code}</span>
              </>
            ) : (
              " · No code needed"
            )}{" "}
            · Valid until {formatDate(deal.expiry)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-3 py-1 text-xs font-bold text-white shadow-glow">
              {status === "Active" ? "● Active" : status}
            </span>
            {deal.verified && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-blue-200">
                ✓ Verified{listed ? ` · ${listed}` : ""}
              </span>
            )}
            {deal.type && (
              <Link
                href={`/?type=${encodeURIComponent(deal.type)}#all-deals`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-500 ring-1 ring-blue-100 transition hover:text-brand-700"
              >
                #{deal.type}
              </Link>
            )}
            <Link
              href={`/category/${categorySlug(deal.category)}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-500 ring-1 ring-blue-100 transition hover:text-brand-700"
            >
              #{deal.category}
            </Link>
          </div>
          {/* Stats — real fields only */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-slate-500">
            {listed && (
              <span>
                🗓 Listed <strong className="text-slate-800">{listed}</strong>
              </span>
            )}
            <span>
              ⏳{" "}
              <strong className="text-slate-800">
                {left > 0 ? `${left} day${left === 1 ? "" : "s"} left` : "Expired"}
              </strong>{" "}
              · until {formatDate(deal.expiry)}
            </span>
            {deal.verified && (
              <span>
                ✓ <strong className="text-slate-800">Verified</strong> by our team
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-6 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Visit {deal.brand}
          </a>
          <ShareButton title={deal.title} />
        </div>
      </div>

      {/* Main deal card */}
      <article
        className="mt-8 animate-fade-up overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/60 shadow-card"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100 px-8 py-8 text-center md:w-56">
            <span className="text-gradient font-display text-4xl font-extrabold leading-none md:text-5xl">
              {figure}
            </span>
            <span className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Saving</span>
            {deal.verified && (
              <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-blue-200">
                ✓ Verified by our team
              </span>
            )}
          </div>
          <div className="flex-1 p-6 md:p-8">
            <p className="leading-relaxed text-slate-600">{deal.description}</p>
            <p className="mb-2 mt-6 text-sm font-bold text-slate-900">Promo code</p>
            <div className="max-w-md">
              <CopyCode code={deal.code} large />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-8 py-3 font-display font-bold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
              >
                Get Deal →
              </a>
              <span className="text-sm font-medium text-slate-500">
                {status === "Limited Time" && left > 0
                  ? `⏳ Hurry — expires in ${left} day${left === 1 ? "" : "s"} (${formatDate(deal.expiry)})`
                  : `Valid until ${formatDate(deal.expiry)}`}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Code not working?{" "}
              <a
                href={`mailto:startup@primekhatab.in?subject=${encodeURIComponent(`Expired deal report: ${deal.brand} — ${deal.title}`)}&body=${encodeURIComponent(`Hi, the deal "${deal.title}" (${deal.id}) seems expired / the code did not work.`)}`}
                className="font-bold text-brand-600 underline decoration-blue-300 underline-offset-2 transition hover:text-brand-700"
              >
                Report expired
              </a>{" "}
              and we will re-check it.
            </p>
          </div>
        </div>
      </article>

      <AdSlot placement="banner" className="my-8" />

      {/* Key Benefits + How to Redeem */}
      <div className="grid gap-8 md:grid-cols-2">
        <section className="animate-fade-up">
          <h2 className="font-display text-xl font-bold text-slate-900">Key Benefits</h2>
          <ul className="mt-4 space-y-2.5">
            {benefits.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-card"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-blue-700 text-xs font-extrabold text-white">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>
        <section className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h2 className="font-display text-xl font-bold text-slate-900">How to Redeem</h2>
          <ol className="mt-4 space-y-2.5">
            {steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-card"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-display text-xs font-extrabold text-brand-700 ring-1 ring-blue-200">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* FAQ */}
      <section className="mt-12 animate-fade-up">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-900">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <FaqAccordion faqs={faqs} />
      </section>

      {/* Similar deals */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Similar <span className="text-gradient">Deals</span>
          </h2>
          <div className="rail-scroll -mx-4 mt-5 overflow-x-auto px-4 pb-2">
            <div className="flex snap-x snap-mandatory gap-5">
              {similar.map((d, i) => (
                <DealCard key={d.id} deal={d} index={i} className="w-[300px] shrink-0 snap-start sm:w-[330px]" />
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm">
            <Link
              href={`/category/${categorySlug(deal.category)}`}
              className="font-display font-bold text-brand-600 transition hover:underline"
            >
              More {deal.category} deals →
            </Link>
          </p>
        </section>
      )}
    </>
  );
}
