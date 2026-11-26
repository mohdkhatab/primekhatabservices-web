import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categorySlug,
  daysLeft,
  discountFigure,
  formatDate,
  getDealById,
  getDeals,
  hasFixedExpiry,
} from "@/lib/deals";
import CopyCode from "@/components/CopyCode";
import BrandTile from "@/components/BrandTile";
import ViewPing from "@/components/ViewPing";
import { BestChip, EyeIcon, LimitedTimeChip } from "@/components/DealCard";
import ShareButton from "@/components/ShareButton";
import DealCard from "@/components/DealCard";
import PosterBanner from "@/components/PosterBanner";
import FaqAccordion, { type Faq } from "@/components/FaqAccordion";
import NativeAd from "@/components/NativeAd";

export const revalidate = 60;

const OG_IMAGE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/og-image.jpg";

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
      url: `https://www.primekhatab.in/deal/${deal.id}`,
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Prime Khatab Deals" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: deal.description,
      images: [OG_IMAGE],
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

  const fixedExpiry = hasFixedExpiry(deal);
  const isApplication =
    deal.category === "Startup Deals" || /\bappl(y|ication)\b/i.test(deal.description);

  const steps = deal.code
    ? [
        `Tap "Get Deal" to open the official ${deal.brand} website.`,
        `Choose the plan or product this offer applies to.`,
        `Copy the code from this page — ${deal.code} — and paste it in the promo / coupon field at signup or checkout.`,
        `Confirm the discount is applied, then finish. If the code fails, tell us via "Report expired" below.`,
      ]
    : isApplication
      ? [
          `Tap "Get Deal" to open the official ${deal.brand} program page.`,
          `Check the eligibility first — who can apply (for example startup stage, funding, or a business email) is written in the offer details above. ${deal.brand} checks this themselves; approval is not instant.`,
          `Click Apply on their page and fill the short form with your real details and business / work email.`,
          `If ${deal.brand} approves you, they email you and the credits or free plan are added to your ${deal.brand} account. The exact amount and how long it lasts are confirmed in that approval email.`,
        ]
      : [
          `Tap "Get Deal" to open the official ${deal.brand} website.`,
          `Sign up for a free account — this offer needs no promo code and no card.`,
          `The free plan / credits are active on your account right after signup, exactly as described above.`,
          `Any paid upgrade is optional and happens only on the official ${deal.brand} website — you never pay anything on Prime Khatab Deals.`,
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
      a: fixedExpiry
        ? `This listing is valid until ${formatDate(deal.expiry)}${left <= 45 && left > 0 ? ` — that is about ${left} day${left === 1 ? "" : "s"} from now` : ""}. Brands can change or end offers early, so the date on the official website is final.`
        : `This is an ongoing offer with no fixed end date published by ${deal.brand}. They can change or end it at any time, so the terms on the official website are final.`,
    },
  ];

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: deal.title,
    description: deal.description,
    url: `https://www.primekhatab.in/deal/${deal.id}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.primekhatab.in/" },
      {
        "@type": "ListItem",
        position: 2,
        name: deal.category,
        item: `https://www.primekhatab.in/category/${categorySlug(deal.category)}`,
      },
      { "@type": "ListItem", position: 3, name: deal.brand, item: `https://www.primekhatab.in/deal/${deal.id}` },
    ],
  };

  return (
    <>
      <ViewPing dealId={deal.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb: Home / Category / Brand */}
      <nav className="text-[13px] text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href={`/category/${categorySlug(deal.category)}`} className="hover:text-brand-600">
          {deal.category}
        </Link>{" "}
        / <span className="font-medium text-slate-900">{deal.brand}</span>
      </nav>

      {/* Poster banner (real image_url) */}
      <PosterBanner deal={deal} />

      {/* Header block */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight text-slate-900">{deal.title}</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
            {deal.brand} · {deal.category}
            {deal.code ? (
              <>
                {" "}· Use code <span className="font-mono font-bold text-slate-900">{deal.code}</span>
              </>
            ) : (
              " · No code needed"
            )}{" "}
            · {fixedExpiry ? `Valid until ${formatDate(deal.expiry)}` : "Ongoing offer"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {deal.featured && <BestChip />}
            {deal.badge && (
              <span className="rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
                {deal.badge}
              </span>
            )}
            {deal.limitedTime !== false && <LimitedTimeChip />}
            {deal.verified && (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                Verified{listed ? ` · ${listed}` : ""}
              </span>
            )}
            {deal.type && (
              <Link
                href={`/?type=${encodeURIComponent(deal.type)}`}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:text-brand-600"
              >
                #{deal.type}
              </Link>
            )}
            <Link
              href={`/category/${categorySlug(deal.category)}`}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:text-brand-600"
            >
              #{deal.category}
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-slate-500">
            {listed && (
              <span>
                Listed <span className="font-medium text-slate-700">{listed}</span>
              </span>
            )}
            <span>
              {fixedExpiry ? (
                <>
                  <span className="font-medium text-slate-700">
                    {left > 0 ? `${left} day${left === 1 ? "" : "s"} left` : "Expired"}
                  </span>{" "}
                  · until {formatDate(deal.expiry)}
                </>
              ) : (
                <>
                  <span className="font-medium text-slate-700">Ongoing offer</span> · no fixed
                  end date
                </>
              )}
            </span>
            {deal.verified && (
              <span>
                <span className="font-medium text-slate-700">Verified</span> by our team
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <EyeIcon />
              <span className="font-medium text-slate-700">
                {(deal.views ?? 0).toLocaleString("en-IN")}
              </span>{" "}
              views
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Visit {deal.brand}
          </a>
          <ShareButton title={deal.title} />
        </div>
      </div>

      {/* Main deal block */}
      <article className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col items-center justify-center gap-1 border-b border-slate-200 bg-slate-50 px-6 py-6 text-center md:w-52 md:border-b-0 md:border-r">
            <span className="text-[32px] font-extrabold leading-none text-slate-900">{figure}</span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Saving
            </span>
            {deal.verified && (
              <span className="mt-3 rounded bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                Verified by our team
              </span>
            )}
          </div>
          <div className="flex-1 p-5 md:p-6">
            <p className="text-sm leading-relaxed text-slate-600">{deal.description}</p>
            <p className="mb-2 mt-5 text-sm font-semibold text-slate-900">Promo code</p>
            <div className="max-w-md">
              <CopyCode code={deal.code} large />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex h-10 items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Get Deal
              </a>
              <span className="text-[13px] text-slate-500">
                {fixedExpiry
                  ? `Valid until ${formatDate(deal.expiry)}${left <= 45 && left > 0 ? ` (${left} day${left === 1 ? "" : "s"} left)` : ""}`
                  : "Ongoing offer — no fixed end date"}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Code not working?{" "}
              <a
                href={`mailto:startup@primekhatab.in?subject=${encodeURIComponent(`Expired deal report: ${deal.brand} — ${deal.title}`)}&body=${encodeURIComponent(`Hi, the deal "${deal.title}" (${deal.id}) seems expired / the code did not work.`)}`}
                className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700"
              >
                Report expired
              </a>{" "}
              and we will re-check it.
            </p>
          </div>
        </div>
      </article>

      {/* Key Benefits + How to Redeem */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Key Benefits</h2>
          <ul className="mt-3 space-y-2">
            {benefits.map((b, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-slate-900">How to Get This Deal</h2>
          <ol className="mt-3 space-y-2">
            {steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Good to know */}
      <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-base font-semibold text-slate-900">Good to know</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          <li>
            You pay nothing on Prime Khatab Deals — signup, application and payment (if any) all
            happen only on the official {deal.brand} website.
          </li>
          <li>
            Who can get this offer — for example students only, startups only, or a business
            email — is checked by {deal.brand} on their site. The eligibility written in the
            offer details above comes from their official program page.
          </li>
          <li>
            If an offer is limited to another country, its description says so — users outside
            that country may need a VPN to open the official page.
          </li>
          <li>
            Found a better or expired deal? Send it from the Submit a Deal page and we will check
            and list it.
          </li>
        </ul>
      </section>

      {/* Native banner — small framed slot mid-page */}
      <div className="mt-10">
        <NativeAd />
      </div>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
        <FaqAccordion faqs={faqs} />
      </section>

      {/* Similar deals */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Similar Deals</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href={`/category/${categorySlug(deal.category)}`} className="font-semibold text-brand-600 hover:underline">
              More {deal.category} deals →
            </Link>
          </p>
        </section>
      )}
    </>
  );
}
