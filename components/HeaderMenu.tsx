"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categorySlug } from "@/lib/deals";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Submit a Deal", href: "/submit-deal" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function Row({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex min-h-[44px] items-center justify-between px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
      >
        <span>{label}</span>
        <span aria-hidden className="text-slate-300">
          ›
        </span>
      </Link>
    </li>
  );
}

/**
 * HeaderMenu — plain three-dots button on the LEFT of the header.
 * Opens a left slide-in drawer with all categories (plain list, no
 * counts), deal types and page links. Closes on backdrop click,
 * Escape, or after any link is tapped.
 */
export default function HeaderMenu({
  categories,
  types,
}: {
  categories: string[];
  types: string[];
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
        aria-label="Open menu"
        data-menu-button="three-dots"
        className="flex h-11 shrink-0 items-center gap-2 rounded-lg border-2 border-brand-600 bg-white px-3 text-brand-700 hover:bg-blue-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="4.5" r="2.5" />
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="12" cy="19.5" r="2.5" />
        </svg>
        <span className="text-sm font-semibold">Menu</span>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-50 bg-slate-900/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Left drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[86vw] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <span className="font-display text-base font-bold text-slate-900">
            Prime Khatab <span className="text-brand-600">Deals</span>
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg leading-none text-slate-500 hover:bg-slate-50"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <p className="px-5 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            All Categories
          </p>
          <ul>
            {categories.map((name) => (
              <Row key={name} href={`/category/${categorySlug(name)}`} label={name} onClick={close} />
            ))}
          </ul>

          <p className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Deal Types
          </p>
          <ul>
            {types.map((name) => (
              <Row
                key={name}
                href={`/?type=${encodeURIComponent(name)}`}
                label={name}
                onClick={close}
              />
            ))}
          </ul>

          <p className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pages
          </p>
          <ul>
            {QUICK_LINKS.map((l) => (
              <Row key={l.href} href={l.href} label={l.label} onClick={close} />
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
