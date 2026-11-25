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
      className="relative min-w-0 flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/?q=${encodeURIComponent(query)}#all-deals` : "/#all-deals");
      }}
    >
      <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-blue-400">
        ⌕
      </span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search deals, brands, codes…"
        aria-label="Search deals"
        className="w-full rounded-full border border-blue-200 bg-blue-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </form>
  );
}
