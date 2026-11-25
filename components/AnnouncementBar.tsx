"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/deals";

/** Slim royal-blue announcement bar above the header — features one deal, closable. */
export default function AnnouncementBar({ deal }: { deal: Deal }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-brand-600 to-blue-600 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2 text-center text-[13px] font-medium">
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest">
          Featured
        </span>
        <span className="line-clamp-1">
          {deal.brand}: {deal.title}
          {deal.badge ? ` — ${deal.badge}` : ""}
        </span>
        <Link
          href={`/deal/${deal.id}`}
          className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-brand-700 shadow transition hover:scale-105 hover:bg-blue-50"
        >
          Claim Now
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-lg leading-none text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
