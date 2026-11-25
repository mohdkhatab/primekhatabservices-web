"use client";

import { useState } from "react";

export type Faq = { q: string; a: string };

/** Simple accessible FAQ accordion. */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-pink-100 rounded-3xl border border-pink-100 bg-white shadow-card">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-display text-sm font-bold text-stone-900 transition hover:text-brand-600 md:text-base"
            >
              {f.q}
              <span aria-hidden className={`shrink-0 text-brand-500 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-stone-500">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
