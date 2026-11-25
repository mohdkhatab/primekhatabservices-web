"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { daysLeft, formatDate, type Deal } from "@/lib/deals";
import BrandTile from "./BrandTile";

type SortKey = "newest" | "expiring" | "az";

/**
 * "Recently Verified" — list-style rows with REAL fields only:
 * logo image, title, verified/listed date and the expiry countdown.
 * The sort select actually re-orders the rows.
 */
export default function VerifiedDeals({ deals }: { deals: Deal[] }) {
  const [sort, setSort] = useState<SortKey>("newest");

  const sorted = useMemo(() => {
    const list = [...deals];
    if (sort === "expiring") list.sort((a, b) => daysLeft(a) - daysLeft(b));
    else if (sort === "az") list.sort((a, b) => a.brand.localeCompare(b.brand));
    else list.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return list;
  }, [deals, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <label htmlFor="verified-sort" className="text-sm font-semibold text-slate-500">
          Sort by:
        </label>
        <select
          id="verified-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-blue-100"
        >
          <option value="newest">Newest first</option>
          <option value="expiring">Expiring soon</option>
          <option value="az">Brand A–Z</option>
        </select>
      </div>

      <div key={sort} className="grid gap-3">
        {sorted.map((deal, i) => {
          const left = daysLeft(deal);
          return (
            <article
              key={deal.id}
              className="group flex animate-fade-up items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lift sm:gap-5 sm:p-5"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <BrandTile
                brand={deal.brand}
                logoUrl={deal.logoUrl}
                size="lg"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="font-bold uppercase tracking-wide text-slate-500">{deal.brand}</span>
                  <span className="font-semibold text-blue-400">#{deal.category}</span>
                  {deal.type && <span className="font-semibold text-slate-400">#{deal.type}</span>}
                  {deal.badge && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold text-brand-700 ring-1 ring-blue-100">
                      {deal.badge}
                    </span>
                  )}
                </div>
                <Link
                  href={`/deal/${deal.id}`}
                  className="mt-1 block font-display text-base font-bold leading-snug text-slate-900 transition group-hover:text-brand-600 md:text-lg"
                >
                  {deal.title}
                </Link>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-400">
                  {deal.verified && (
                    <span className="font-semibold text-brand-600">
                      ✓ Verified{deal.created_at ? ` · ${formatDate(deal.created_at)}` : ""}
                    </span>
                  )}
                  <span>
                    {left > 0 && left <= 45
                      ? `⏳ Expires in ${left} day${left === 1 ? "" : "s"}`
                      : left > 45
                        ? `Valid until ${formatDate(deal.expiry)}`
                        : "Expired"}
                  </span>
                </div>
              </div>
              <Link
                href={`/deal/${deal.id}`}
                aria-label={`View ${deal.brand} deal`}
                className="hidden shrink-0 self-center rounded-full border border-blue-200 px-4 py-2 font-display text-sm font-bold text-brand-600 transition group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-blue-700 group-hover:text-white sm:block"
              >
                View →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
