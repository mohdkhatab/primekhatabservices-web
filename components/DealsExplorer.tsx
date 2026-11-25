"use client";

import { Fragment, useMemo, useState } from "react";
import { DEAL_TYPES, type Deal } from "@/lib/deals";
import DealCard from "./DealCard";
import AdSlot from "./AdSlot";

/**
 * Browse All Deals explorer — search + deal-type chips + category chips
 * filtering a responsive card grid. All counts are computed live from
 * the deals passed in.
 */
export default function DealsExplorer({
  deals,
  categories,
  initialQuery = "",
  initialType = "All",
}: {
  deals: Deal[];
  categories: string[];
  initialQuery?: string;
  initialType?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState("All");
  const [activeType, setActiveType] = useState(
    (DEAL_TYPES as readonly string[]).includes(initialType) ? initialType : "All"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter((d) => {
      const inCategory = active === "All" || d.category === active;
      const inType = activeType === "All" || d.type === activeType;
      const inQuery =
        !q ||
        [d.brand, d.title, d.description, d.category, d.code, d.type ?? ""].join(" ").toLowerCase().includes(q);
      return inCategory && inType && inQuery;
    });
  }, [deals, query, active, activeType]);

  const chipCls = (on: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
      on
        ? "bg-gradient-to-r from-brand-600 to-blue-700 text-white shadow-glow"
        : "border border-blue-200 bg-white text-slate-600 hover:border-blue-400 hover:text-brand-600"
    }`;

  return (
    <section>
      <div className="mx-auto max-w-2xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search deals, brands, promo codes… e.g. hosting, student, AI"
          className="w-full rounded-full border border-blue-200 bg-white px-5 py-3.5 text-base text-slate-900 shadow-card outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-blue-100"
          aria-label="Search deals"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["All", ...categories].map((c) => (
          <button key={c} type="button" onClick={() => setActive(c)} className={chipCls(active === c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deal type:</span>
        {["All", ...DEAL_TYPES].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={`rounded-full px-3 py-1 text-[13px] font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeType === t
                ? "bg-blue-700 text-white shadow-glow"
                : "bg-blue-50 text-brand-700 ring-1 ring-blue-200 hover:bg-blue-100"
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold text-slate-500">
        <span className="text-brand-600">{filtered.length}</span> live deal{filtered.length === 1 ? "" : "s"}
        {active !== "All" ? ` in ${active}` : ""}
        {activeType !== "All" ? ` · #${activeType}` : ""}
        {query ? ` for “${query}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 animate-fade-in rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center text-slate-500">
          No live deals found. Try another search, category or deal type — new deals are added regularly.
        </p>
      ) : (
        <div key={`${active}-${activeType}-${query}`} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal, i) => (
            <Fragment key={deal.id}>
              {i === 6 && (
                <div className="flex animate-fade-up" style={{ animationDelay: "360ms" }}>
                  <AdSlot placement="infeed" className="w-full" />
                </div>
              )}
              <DealCard deal={deal} index={i} />
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
