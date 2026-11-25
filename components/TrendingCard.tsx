import Link from "next/link";
import { daysLeft, type Deal } from "@/lib/deals";
import BrandTile from "./BrandTile";

/**
 * TrendingCard — compact card for the Trending rail.
 * Order comes from real fields only (newest / strongest badge first);
 * no click or view counts are displayed anywhere.
 */
export default function TrendingCard({ deal, rank }: { deal: Deal; rank: number }) {
  const left = daysLeft(deal);
  return (
    <article className="group flex w-[270px] shrink-0 snap-start flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <BrandTile
          brand={deal.brand}
          logoUrl={deal.logoUrl}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <span className="rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-2.5 py-0.5 font-display text-xs font-extrabold text-white shadow-glow">
          #{rank}
        </span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {deal.brand} · {deal.category}
      </p>
      <Link
        href={`/deal/${deal.id}`}
        className="mt-1 line-clamp-2 font-display font-bold leading-snug text-slate-900 transition group-hover:text-brand-600"
      >
        {deal.title}
      </Link>
      <div className="mt-3 flex items-center gap-2 border-t border-blue-50 pt-3 text-xs font-semibold text-slate-500">
        {deal.badge && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-brand-700 ring-1 ring-blue-100">
            {deal.badge}
          </span>
        )}
        <span>{left <= 45 && left > 0 ? `⏳ ${left} days left` : `Valid until ${deal.expiry}`}</span>
      </div>
      <Link
        href={`/deal/${deal.id}`}
        className="btn-shine relative mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-blue-700 py-2 text-center font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        View Deal →
      </Link>
    </article>
  );
}
