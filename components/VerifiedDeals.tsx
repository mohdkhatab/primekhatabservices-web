"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  daysLeft,
  dealStatus,
  formatCount,
  formatDate,
  type Deal,
} from "@/lib/deals";
import BrandTile from "./BrandTile";

type SortKey = "latest" | "popular" | "clicked";

const STATUS_STYLES: Record<string, string> = {
  "Limited Time": "bg-rose-100 text-rose-700 ring-rose-200",
  New: "bg-pink-100 text-brand-700 ring-pink-200",
  Trending: "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
  Expired: "bg-stone-100 text-stone-500 ring-stone-200",
  Active: "bg-pink-50 text-brand-600 ring-pink-200",
};

function VerifiedCard({ deal, brandCount, index }: { deal: Deal; brandCount: number; index: number }) {
  const status = dealStatus(deal);
  const left = daysLeft(deal);
  return (
    <article
      className="group flex animate-fade-up gap-4 rounded-3xl border border-pink-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lift sm:gap-5"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <BrandTile brand={deal.brand} size="lg" className="transition-transform duration-300 group-hover:scale-105" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
          <span className="font-bold uppercase tracking-wide text-stone-500">{deal.brand}</span>
          {brandCount > 1 ? (
            <span className="rounded-full bg-pink-100 px-2 py-0.5 font-bold text-brand-700">+{brandCount - 1} more deals</span>
          ) : (
            <span className="font-semibold text-pink-400">#{deal.category}</span>
          )}
          <span className={`rounded-full px-2 py-0.5 font-bold ring-1 ${STATUS_STYLES[status]}`}>
            {status === "Limited Time" && left > 0 ? `Expires in ${left}d` : status}
          </span>
          {deal.type && <span className="font-semibold text-stone-400">#{deal.type}</span>}
        </div>
        <Link
          href={`/deal/${deal.id}`}
          className="mt-1.5 block font-display text-base font-bold leading-snug text-stone-900 transition group-hover:text-brand-600 md:text-lg"
        >
          {deal.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {deal.description}
          {deal.code ? <> Use code <span className="font-mono font-bold text-brand-700">{deal.code}</span> at checkout.</> : null}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-stone-400">
          <span>👁 {formatCount(deal.views ?? 0)} views</span>
          <span>⚡ {formatCount(deal.clicks ?? 0)} clicks</span>
          {deal.created_at && <span>🗓 {formatDate(deal.created_at)}</span>}
          {deal.verified && <span className="font-semibold text-rose-600">✓ Verified</span>}
        </div>
      </div>
      <Link
        href={`/deal/${deal.id}`}
        aria-label={`View ${deal.brand} deal`}
        className="hidden shrink-0 self-center rounded-full border border-pink-200 px-3 py-2 font-display text-sm font-bold text-brand-600 transition group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-rose-500 group-hover:text-white sm:block"
      >
        View →
      </Link>
    </article>
  );
}

/** "Recently Verified" rich list with a working sort control. */
export default function VerifiedDeals({ deals }: { deals: Deal[] }) {
  const [sort, setSort] = useState<SortKey>("latest");

  const brandCounts = useMemo(() => {
    const map = new Map<string, number>();
    deals.forEach((d) => map.set(d.brand, (map.get(d.brand) ?? 0) + 1));
    return map;
  }, [deals]);

  const sorted = useMemo(() => {
    const list = [...deals];
    if (sort === "popular") list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    else if (sort === "clicked") list.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
    else list.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return list;
  }, [deals, sort]);

  const options: { key: SortKey; label: string }[] = [
    { key: "latest", label: "Latest" },
    { key: "popular", label: "Most Popular" },
    { key: "clicked", label: "Most Clicked" },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-stone-500">Sort by:</span>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setSort(o.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              sort === o.key
                ? "bg-gradient-to-r from-brand-500 to-rose-500 text-white shadow-glow"
                : "border border-pink-200 bg-white text-stone-600 hover:border-pink-400 hover:text-brand-600"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div key={sort} className="grid gap-4">
        {sorted.map((deal, i) => (
          <VerifiedCard key={deal.id} deal={deal} brandCount={brandCounts.get(deal.brand) ?? 1} index={i} />
        ))}
      </div>
    </div>
  );
}
