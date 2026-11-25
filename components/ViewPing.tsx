"use client";

import { useEffect } from "react";

const API_BASE = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

/**
 * ViewPing — counts one real view per browser session for this deal.
 * Fires POST /deals/:id/view on the public API; renders nothing.
 */
export default function ViewPing({ dealId }: { dealId: string }) {
  useEffect(() => {
    const key = `pkd-viewed-${dealId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable — still count the view once per mount
    }
    fetch(`${API_BASE}/deals/${encodeURIComponent(dealId)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // counting is best-effort; never block the page on it
    });
  }, [dealId]);
  return null;
}
