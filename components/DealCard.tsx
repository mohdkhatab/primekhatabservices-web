import Link from "next/link";
import { categorySlug, daysLeft, dealStatus, type Deal } from "@/lib/deals";
import CopyCode from "./CopyCode";
import BrandTile from "./BrandTile";

/**
 * DealCard — white rounded-2xl card with the brand's real logo image,
 * offer badge, hashtag chips and a Copy Code / Get Deal footer.
 * Only real data is shown: expiry countdown comes from the deal itself.
 */
export default function DealCard({
  deal,
  index = 0,
  className = "",
}: {
  deal: Deal;
  index?: number;
  className?: string;
}) {
  const status = dealStatus(deal);
  const left = daysLeft(deal);
  return (
    <article
      className={`group flex animate-fade-up flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-lift ${className}`}
      style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <BrandTile
          brand={deal.brand}
          logoUrl={deal.logoUrl}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="flex flex-col items-end gap-1.5">
          {deal.badge && (
            <span className="relative overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-2.5 py-0.5 text-xs font-bold text-white shadow-glow">
              {deal.badge}
              <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-shine bg-white/50 blur-[2px]" />
            </span>
          )}
          {status === "New" && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-700">
              New
            </span>
          )}
          {status === "Limited Time" && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
              Limited Time
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{deal.brand}</p>
      <Link
        href={`/deal/${deal.id}`}
        className="mt-1 font-display font-bold leading-snug text-slate-900 transition group-hover:text-brand-600"
      >
        {deal.title}
      </Link>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{deal.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Link
          href={`/category/${categorySlug(deal.category)}`}
          className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
        >
          #{deal.category}
        </Link>
        {deal.type && (
          <Link
            href={`/?type=${encodeURIComponent(deal.type)}#all-deals`}
            className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-brand-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
          >
            #{deal.type}
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-blue-50 pt-3.5">
        {deal.code ? (
          <CopyCode code={deal.code} variant="button" />
        ) : (
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-4 py-2 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-95"
          >
            Get Deal →
          </a>
        )}
        <span className="text-right text-xs font-medium text-slate-400">
          {left <= 45 && left > 0 ? (
            <span className="font-bold text-brand-600">⏳ {left}d left</span>
          ) : (
            <>Expires {deal.expiry}</>
          )}
        </span>
      </div>
    </article>
  );
}
