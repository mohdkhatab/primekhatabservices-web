"use client";

import { Fragment, useMemo, useState } from "react";
import { DEAL_TYPES, type Deal } from "@/lib/deals";
import DealCard from "./DealCard";
import NativeAd from "./NativeAd";

/**
 * DealsExplorer — the whole home listing (UI_SPEC): category chips row,
 * deal-type chips, then the plain deals grid. Search text arrives from
 * the header search via the ?q= URL param (initialQuery). No counts,
 * no ads, no decoration.
 */
export default function DealsExplorer({
  deals,
  categories,
  initialQuery = "",
  initialType = "All",
  initialCategory = "All",
}: {
  deals: Deal[];
  categories: string[];
  initialQuery?: string;
  initialType?: string;
  initialCategory?: string;
}) {
  const [active, setActive] = useState(initialCategory);
  const [activeType, setActiveType] = useState(
    (DEAL_TYPES as readonly string[]).includes(initialType) ? initialType : "All"
  );

  const filtered = useMemo(() => {
    const q = initialQuery.trim().toLowerCase();
    return deals.filter((d) => {
      const inCategory = active === "All" || d.category === active;
      const inType = activeType === "All" || d.type === activeType;
      const inQuery =
        !q ||
        [d.brand, d.title, d.description, d.category, d.code, d.type ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return inCategory && inType && inQuery;
    });
  }, [deals, initialQuery, active, activeType]);

  const chipCls = (on: boolean) =>
    `flex h-8 items-center rounded-full border px-3 text-[13px] font-medium ${
      on
        ? "border-brand-600 bg-brand-600 text-white"
        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
    }`;

  return (
    <section>
      {/* Category chips row (directly under the header) */}
      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button key={c} type="button" onClick={() => setActive(c)} className={chipCls(active === c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Deal-type chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...DEAL_TYPES].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveType(t)}
            className={chipCls(activeType === t)}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No deals match your filters. Try another category or deal type.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal) => (
            <Fragment key={deal.id}>
              <DealCard deal={deal} />
              <NativeAd variant="grid" />
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
