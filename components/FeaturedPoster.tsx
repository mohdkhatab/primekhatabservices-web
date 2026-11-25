"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/deals";
import BrandTile from "./BrandTile";
import CopyCode from "./CopyCode";

/**
 * FeaturedPoster — the hero's featured-deal poster card.
 * Uses the deal's REAL poster image (imageUrl) across the top when present;
 * otherwise a royal-blue gradient panel with the brand logo tile.
 */
export default function FeaturedPoster({ deal }: { deal: Deal }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPoster = Boolean(deal.imageUrl) && !imgFailed;

  return (
    <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
      <div
        aria-hidden
        className="absolute -inset-1 rounded-[1.7rem] bg-gradient-to-r from-blue-300 via-sky-300 to-blue-400 opacity-60 blur-lg"
      />
      <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-lift">
        {showPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.imageUrl}
            alt={`${deal.brand} offer poster`}
            onError={() => setImgFailed(true)}
            className="h-44 w-full object-cover sm:h-52"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-500 via-brand-600 to-blue-800 sm:h-52">
            <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="xl" />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">
              Featured
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-brand-700">
              {deal.category}
            </span>
            {deal.badge && (
              <span className="rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-3 py-1 text-[11px] font-bold text-white shadow-glow">
                {deal.badge}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-start gap-3">
            <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="md" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">{deal.brand}</p>
              <Link
                href={`/deal/${deal.id}`}
                className="mt-0.5 block font-display text-lg font-extrabold leading-snug text-slate-900 transition hover:text-brand-600"
              >
                {deal.title}
              </Link>
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{deal.description}</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            {deal.code ? (
              <div className="sm:w-64">
                <CopyCode code={deal.code} />
              </div>
            ) : null}
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-7 py-3 text-center font-display font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-95"
            >
              Get Deal →
            </a>
            <Link
              href={`/deal/${deal.id}`}
              className="text-center text-sm font-bold text-brand-600 transition hover:underline sm:text-left"
            >
              Full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
