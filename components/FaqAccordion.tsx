"use client";

import { useState } from "react";

export type Faq = { q: string; a: string };

/** Simple accessible FAQ accordion — plain bordered box (UI_SPEC). */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-slate-900 hover:text-brand-600"
            >
              {f.q}
              <span aria-hidden className={`shrink-0 text-slate-400 ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-4 pb-4 text-sm leading-relaxed text-slate-500">{f.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
