"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

/**
 * Logs one visit per page view to the backend (IP + country are read
 * server-side). The owner sees the data on the private /band page.
 * Admin pages themselves are not tracked.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/band") || pathname.startsWith("/admin")) return;
    fetch(`${API_BASE}/track`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Tracking must never break the page.
    });
  }, [pathname]);

  return null;
}
