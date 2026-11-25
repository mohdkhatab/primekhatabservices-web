"use client";

import { useState } from "react";
import type { Deal } from "@/lib/deals";
import BrandTile from "./BrandTile";

/**
 * PosterBanner — the deal's poster image (imageUrl) across the top of the
 * detail page. Renders nothing when the deal has no poster (or it fails).
 */
export default function PosterBanner({ deal }: { deal: Deal }) {
  const [failed, setFailed] = useState(false);
  if (!deal.imageUrl || failed) return null;
  return (
    <div className="relative mt-5 animate-fade-up overflow-hidden rounded-3xl border border-blue-100 shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={deal.imageUrl}
        alt={`${deal.brand} offer poster`}
        onError={() => setFailed(true)}
        className="h-52 w-full object-cover sm:h-64 md:h-72"
      />
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 py-1 pl-1 pr-3 shadow backdrop-blur">
        <BrandTile brand={deal.brand} logoUrl={deal.logoUrl} size="sm" />
        <span className="text-xs font-bold text-slate-700">{deal.brand}</span>
      </div>
    </div>
  );
}
