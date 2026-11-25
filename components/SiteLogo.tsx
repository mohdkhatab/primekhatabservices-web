"use client";

import { useState } from "react";

/**
 * SiteLogo — the site logo mark served from /logo.png.
 * Falls back to a blue "%" tile if the image is missing or fails to load.
 */
export default function SiteLogo({ className = "h-10 w-10" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-brand-600 to-blue-800 font-display font-extrabold text-white shadow-glow ${className}`}
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
      className={`shrink-0 rounded-xl object-contain ${className}`}
    />
  );
}
