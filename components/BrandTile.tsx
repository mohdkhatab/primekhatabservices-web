"use client";

import { useState } from "react";

/**
 * BrandTile — renders the brand's REAL logo image (deal.logoUrl, supplied
 * per-deal by the admin as any CDN/image link). If there is no logo or the
 * image fails to load, it falls back to a deterministic royal-blue initial
 * tile so the same brand always looks the same.
 */
const SHADES = [
  "from-blue-400 via-brand-500 to-blue-700",
  "from-sky-400 via-blue-500 to-brand-700",
  "from-brand-400 via-blue-600 to-blue-800",
  "from-blue-500 via-brand-600 to-blue-800",
  "from-sky-500 via-brand-500 to-blue-700",
];

const SIZES = {
  sm: "h-9 w-9 rounded-lg text-sm",
  md: "h-12 w-12 rounded-xl text-lg",
  lg: "h-16 w-16 rounded-2xl text-2xl",
  xl: "h-20 w-20 rounded-2xl text-3xl md:h-24 md:w-24 md:text-4xl",
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
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-blue-100 bg-white ${sizeCls} ${className}`}
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

  let hash = 0;
  for (let i = 0; i < brand.length; i++) hash = (hash * 31 + brand.charCodeAt(i)) % 997;
  const shade = SHADES[hash % SHADES.length];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br font-display font-extrabold text-white shadow-glow ${shade} ${sizeCls} ${className}`}
    >
      {brand.charAt(0).toUpperCase()}
    </span>
  );
}
