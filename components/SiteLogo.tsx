"use client";

import { useState } from "react";

/**
 * SiteLogo — the site logo mark (hosted on Supabase Storage).
 * Falls back to a plain flat blue "%" tile if the image fails to load.
 */
export default function SiteLogo({ className = "h-9 w-9" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-lg bg-brand-600 font-bold text-white ${className}`}
      >
        %
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="https://pkvglyflccxwfkfipfvc.supabase.co/storage/v1/object/public/site-assets/logo.png"
      alt="Prime Khatab Deals logo"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-lg object-contain ${className}`}
    />
  );
}
