import Link from "next/link";
import { dealStatus, type Deal } from "@/lib/deals";
import CopyCode from "./CopyCode";
import BrandTile from "./BrandTile";

/** One-line saving summary shown under the badges, e.g. "Save 75% today". */
function summaryLine(deal: Deal): string {
  const badge = (deal.badge ?? "").toUpperCase();
  if (/%\s*OFF/.test(badge)) return `Save ${badge.replace(/\s*OFF/i, "")} today`;
  if (badge.includes("CREDIT") || badge.startsWith("$") || badge.startsWith("₹")) return `${deal.badge} in free credits`;
  if (badge === "FREE") return "100% free — no payment needed";
  if (deal.type === "Promo Codes") return "Extra saving with the code below";
  return deal.type ? `${deal.type} deal` : "Live deal";
}

export default function DealCard({ deal, index = 0 }: { deal: Deal; index?: number }) {
  const status = dealStatus(deal);
  return (
    <article
      className="group flex animate-fade-up flex-col rounded-3xl border border-pink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-300 hover:bg-gradient-to-b hover:from-white hover:to-pink-50 hover:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 11) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <BrandTile brand={deal.brand} className="transition-transform duration-300 group-hover:scale-110" />
        <div className="flex flex-col items-end gap-1.5">
          {deal.badge && (
            <span className="relative overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-[0_0_18px_-4px_rgba(236,72,153,0.8)]">
              {deal.badge}
              <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-shine bg-white/50 blur-[2px]" />
            </span>
          )}
          <div className="flex gap-1.5">
            {status === "New" && (
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-700">New</span>
            )}
            {status === "Limited Time" && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-rose-700">Limited Time</span>
            )}
            {deal.verified && <span className="text-xs font-semibold text-rose-600">✓ Verified</span>}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400">{deal.brand} · {deal.category}</p>
      <p className="mt-0.5 text-xs font-bold text-brand-600">{summaryLine(deal)}</p>
      <Link href={`/deal/${deal.id}`} className="mt-1 font-display font-bold leading-snug text-stone-900 transition group-hover:text-brand-600">
        {deal.title}
      </Link>
      <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">{deal.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
        <span>⏳ Expires: {deal.expiry}</span>
        {deal.type && (
          <Link href={`/?type=${encodeURIComponent(deal.type)}#all-deals`} className="font-bold text-pink-500 transition hover:text-brand-700">
            #{deal.type}
          </Link>
        )}
      </div>
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
