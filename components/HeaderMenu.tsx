"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categorySlug } from "@/lib/deals";

export type MenuCategory = { name: string; count: number };
export type MenuType = { name: string; count: number };

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Submit a Deal", href: "/submit-deal" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

/**
 * HeaderMenu — three-dots (⋮) button on the LEFT of the header.
 * Opens a left slide-in drawer with ALL categories (real deal counts),
 * deal types and quick links. Closes on backdrop click, Escape, or
 * after any link is tapped. Works on mobile and desktop.
 */
export default function HeaderMenu({
  categories,
  types,
}: {
  categories: MenuCategory[];
  types: MenuType[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open menu — all categories"
        data-menu-button="three-dots"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-xl font-extrabold leading-none text-brand-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 active:scale-95"
      >
        ⋮
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Left drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-xs flex-col bg-white shadow-lift transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-blue-100 px-5 py-4">
          <span className="font-display text-base font-extrabold tracking-tight text-slate-900">
            Prime Khatab <span className="text-gradient">Deals</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 text-lg leading-none text-slate-500 transition hover:bg-blue-50 hover:text-brand-700"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
            All Categories
          </p>
          <ul>
            {categories.map((c) => (
              <li key={c.name}>
                <Link
                  href={`/category/${categorySlug(c.name)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-brand-700"
                >
                  <span>{c.name}</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-700 ring-1 ring-blue-100">
                    {c.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="px-2 pb-1 pt-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
            Deal Types
          </p>
          <div className="flex flex-wrap gap-1.5 px-2">
            {types.map((t) => (
              <Link
                key={t.name}
                href={`/?type=${encodeURIComponent(t.name)}#all-deals`}
                onClick={() => setOpen(false)}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-bold text-brand-700 ring-1 ring-blue-100 transition hover:bg-blue-100"
              >
                #{t.name}
                <span className="ml-1 font-semibold text-slate-400">{t.count}</span>
              </Link>
            ))}
          </div>

          <p className="px-2 pb-1 pt-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
            Quick Links
          </p>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-brand-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-blue-100 px-5 py-3 text-xs text-slate-400">
          Free offers &amp; promo codes — no login needed.
        </div>
      </aside>
    </>
  );
}
