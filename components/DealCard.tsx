import Link from "next/link";
import { categorySlug, daysLeft, type Deal } from "@/lib/deals";
import CopyCode from "./CopyCode";
import BrandTile from "./BrandTile";

/**
 * DealCard — plain directory card (UI_SPEC): white, 1px border #e2e8f0,
 * radius 8px, padding 16px, no shadow/gradient/animation. Real logo image,
 * flat badge, title, description, one CTA in the footer.
 */
export default function DealCard({
  deal,
  className = "",
}: {
  deal: Deal;
  index?: number;
  className?: string;
}) {
  const left = daysLeft(deal);
  return (
    <article
      className={`flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} />
        {deal.badge && (
          <span className="rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
            {deal.badge}
          </span>
        )}
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {deal.brand}
      </p>
      <Link
        href={`/deal/${deal.id}`}
        className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 hover:text-brand-600"
      >
        {deal.title}
      </Link>
      <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-slate-500">
        {deal.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Link
          href={`/category/${categorySlug(deal.category)}`}
          className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:text-brand-600"
        >
          #{deal.category}
        </Link>
        {deal.type && (
          <Link
            href={`/?type=${encodeURIComponent(deal.type)}`}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:text-brand-600"
          >
            #{deal.type}
          </Link>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {deal.code ? (
          <CopyCode code={deal.code} variant="button" />
        ) : (
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get Deal
          </a>
        )}
        <span className="text-right text-xs text-slate-400">
          {left <= 45 && left > 0 ? `${left}d left` : `Expires ${deal.expiry}`}
        </span>
      </div>
    </article>
  );
}
