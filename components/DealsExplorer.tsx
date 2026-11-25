"use client";

import { Fragment, useMemo, useState } from "react";
import { DEAL_TYPES, type Deal } from "@/lib/deals";
import DealCard from "./DealCard";
import AdSlot from "./AdSlot";

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

  return (
    <section>
      <div className="mx-auto max-w-2xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search deals, brands, promo codes… e.g. hosting, student, AI"
          className="w-full rounded-full border border-pink-200 bg-white px-5 py-3.5 text-base text-stone-900 shadow-card outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:shadow-glow"
          aria-label="Search deals"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              active === c
                ? "bg-gradient-to-r from-brand-500 to-rose-500 text-white shadow-glow"
                : "border border-pink-200 bg-white text-stone-600 hover:border-pink-400 hover:text-brand-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Deal type:</span>
        {["All", ...DEAL_TYPES].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={`rounded-full px-3 py-1 text-[13px] font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeType === t
                ? "bg-pink-600 text-white shadow-glow"
                : "bg-pink-50 text-brand-700 ring-1 ring-pink-200 hover:bg-pink-100"
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold text-stone-500">
        <span className="text-brand-600">{filtered.length}</span> live deal{filtered.length === 1 ? "" : "s"}
        {active !== "All" ? ` in ${active}` : ""}
        {activeType !== "All" ? ` · #${activeType}` : ""}
        {query ? ` for “${query}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 animate-fade-in rounded-2xl border border-pink-100 bg-pink-50/50 p-8 text-center text-stone-500">
          No live deals found. Try another search, category or deal type — new deals are added regularly.
        </p>
      ) : (
        <div key={`${active}-${activeType}-${query}`} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal, i) => (
            <Fragment key={deal.id}>
              {/* In-feed ad after the 6th card */}
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
