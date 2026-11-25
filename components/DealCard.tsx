import Link from "next/link";
import type { Deal } from "@/lib/deals";
import CopyCode from "./CopyCode";

export default function DealCard({ deal, index = 0 }: { deal: Deal; index?: number }) {
  return (
    <article
      className="group flex animate-fade-up flex-col rounded-3xl border border-pink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-300 hover:bg-gradient-to-b hover:from-white hover:to-pink-50 hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-brand-500 to-rose-500 font-display text-lg font-extrabold text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
          {deal.brand.charAt(0).toUpperCase()}
        </span>
        <div className="flex flex-col items-end gap-1.5">
          {deal.badge && (
            <span className="relative overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-[0_0_18px_-4px_rgba(236,72,153,0.8)]">
              {deal.badge}
              <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-shine bg-white/50 blur-[2px]" />
            </span>
          )}
          {deal.verified && <span className="text-xs font-semibold text-rose-600">✓ Verified</span>}
        </div>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400">{deal.brand} · {deal.category}</p>
      <Link href={`/deal/${deal.id}`} className="mt-1 font-display font-bold leading-snug text-stone-900 transition group-hover:text-brand-600">
        {deal.title}
      </Link>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">{deal.description}</p>
      <p className="mt-3 text-xs text-stone-400">⏳ Expires: {deal.expiry}</p>
      <div className="mt-3">
        <CopyCode code={deal.code} />
      </div>
      <a
        href={deal.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="btn-shine relative mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 via-pink-500 to-rose-500 py-2.5 text-center font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
      >
        Get Deal →
      </a>
    </article>
  );
}
