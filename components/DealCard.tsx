import Link from "next/link";
import {
  categorySlug,
  daysLeft,
  formatCount,
  hasFixedExpiry,
  type Deal,
} from "@/lib/deals";
import CopyCode from "./CopyCode";
import BrandTile from "./BrandTile";

export function EyeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BestChip() {
  return (
    <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-extrabold tracking-wide text-slate-900">
      ★ BEST
    </span>
  );
}

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
        <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="lg" />
        <div className="flex flex-col items-end gap-1.5">
          {deal.featured && <BestChip />}
          {deal.badge && (
            <span className="rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {deal.badge}
            </span>
          )}
        </div>
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

      <p className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span>
          {hasFixedExpiry(deal)
            ? left > 0
              ? left <= 45
                ? `Only ${left} day${left === 1 ? "" : "s"} left`
                : `Valid until ${deal.expiry}`
              : "Expired"
            : "Ongoing offer · no fixed end date"}
        </span>
        <span className="inline-flex items-center gap-1">
          <EyeIcon />
          {formatCount(deal.views ?? 0)} views
        </span>
      </p>
      <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Link
          href={`/deal/${deal.id}`}
          className="flex h-10 flex-1 items-center justify-center rounded-lg border border-brand-600 px-3 text-sm font-semibold text-brand-600 hover:bg-brand-50"
        >
          View Details
        </Link>
        {deal.code ? (
          <CopyCode code={deal.code} variant="button" />
        ) : (
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex h-10 flex-1 items-center justify-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get Deal
          </a>
        )}
      </div>
    </article>
  );
}
