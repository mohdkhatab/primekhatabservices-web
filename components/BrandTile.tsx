"use client";

import { useState } from "react";

/**
 * BrandTile — renders the brand's REAL logo image (deal.logoUrl, supplied
 * per-deal by the admin as any CDN/image link). If there is no logo or the
 * image fails to load, it falls back to a flat blue initial tile.
 * UI_SPEC: radius 8px, 1px border #e2e8f0, no gradients, no shadows.
 */
const SIZES = {
  sm: "h-9 w-9 rounded-lg text-sm",
  md: "h-12 w-12 rounded-lg text-lg",
  lg: "h-16 w-16 rounded-lg text-2xl",
  xl: "h-20 w-20 rounded-lg text-3xl",
} as const;

export default function BrandTile({
  brand,
  logoUrl = "",
  size = "md",
  className = "",
}: {
  brand: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const sizeCls = SIZES[size];

  if (logoUrl && !failed) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white ${sizeCls} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${brand} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-1.5"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-brand-600 font-bold text-white ${sizeCls} ${className}`}
    >
      {brand.charAt(0).toUpperCase()}
    </span>
  );
}
