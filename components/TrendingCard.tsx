import Link from "next/link";
import { formatCount, type Deal } from "@/lib/deals";
import BrandTile from "./BrandTile";

/** Compact card for the Trending horizontal carousel. */
export default function TrendingCard({ deal, rank }: { deal: Deal; rank: number }) {
  return (
    <article className="group flex w-[270px] shrink-0 snap-start flex-col rounded-3xl border border-pink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-300 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <BrandTile brand={deal.brand} className="transition-transform duration-300 group-hover:scale-110" />
        <span className="rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-2.5 py-0.5 font-display text-xs font-extrabold text-white shadow-glow">
          #{rank} Trending
        </span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400">{deal.brand} · {deal.category}</p>
      <Link href={`/deal/${deal.id}`} className="mt-1 line-clamp-2 font-display font-bold leading-snug text-stone-900 transition group-hover:text-brand-600">
        {deal.title}
      </Link>
      <div className="mt-3 flex items-center gap-3 border-t border-pink-50 pt-3 text-xs font-semibold text-stone-500">
        <span>⚡ {formatCount(deal.clicks ?? 0)} clicks</span>
        <span className="text-brand-600">Popular this week</span>
      </div>
      <Link
        href={`/deal/${deal.id}`}
        className="btn-shine relative mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 via-pink-500 to-rose-500 py-2 text-center font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        View Deal →
      </Link>
    </article>
  );
}
