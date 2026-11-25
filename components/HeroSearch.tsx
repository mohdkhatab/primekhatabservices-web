"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Big hero search — sends the query to the home explorer (/?q=...#all-deals). */
export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/?q=${encodeURIComponent(query)}#all-deals` : "/#all-deals");
      }}
      className="relative"
    >
      <span aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-blue-400">
        ⌕
      </span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search deals, brands, promo codes…"
        aria-label="Search deals"
        className="w-full rounded-full border border-blue-200 bg-white py-4 pl-12 pr-32 text-base text-slate-900 shadow-card outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-blue-100"
      />
      <button
        type="submit"
        className="btn-shine absolute right-1.5 top-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-6 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:brightness-110 active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
