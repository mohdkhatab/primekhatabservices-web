"use client";

import { Fragment, useMemo, useState } from "react";
import type { Deal } from "@/lib/deals";
import DealCard from "./DealCard";
import AdSlot from "./AdSlot";

export default function DealsExplorer({
  deals,
  categories,
}: {
  deals: Deal[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter((d) => {
      const inCategory = active === "All" || d.category === active;
      const inQuery =
        !q ||
        [d.brand, d.title, d.description, d.category, d.code].join(" ").toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [deals, query, active]);

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

      <p className="mt-8 text-sm font-semibold text-stone-500">
        <span className="text-brand-600">{filtered.length}</span> live deal{filtered.length === 1 ? "" : "s"}
        {active !== "All" ? ` in ${active}` : ""}
        {query ? ` for “${query}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 animate-fade-in rounded-2xl border border-pink-100 bg-pink-50/50 p-8 text-center text-stone-500">
          No live deals found. Try another search or category — new deals are added regularly.
        </p>
      ) : (
        <div key={`${active}-${query}`} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
