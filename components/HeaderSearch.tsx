"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Header search — sends the query to the home explorer (/?q=...#all-deals). */
export default function HeaderSearch({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  return (
    <form
      role="search"
      className="relative min-w-0 flex-1 sm:max-w-xs md:max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/?q=${encodeURIComponent(query)}#all-deals` : "/#all-deals");
      }}
    >
      <span aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-pink-400">⌕</span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search deals, brands, codes…"
        aria-label="Search deals"
        className="w-full rounded-full border border-pink-200 bg-pink-50/40 py-2 pl-9 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:shadow-glow"
      />
    </form>
  );
}
