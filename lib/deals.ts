import localDeals from "@/data/deals.json";
import localCustomCategories from "@/data/categories.json";
import { getSupabase } from "./supabase";

export type Deal = {
  id: string;
  brand: string;
  title: string;
  description: string;
  code: string; // "" = no code needed (free tier / direct deal)
  url: string;
  category: string;
  badge?: string; // "FREE" | "% OFF" | custom e.g. "50% OFF"
  expiry: string; // ISO date YYYY-MM-DD
  verified: boolean;
  created_at?: string;
};

/** All deal categories — covers every deal type Prime asked for. */
export const BASE_CATEGORIES = [
  "Coding Platforms",
  "Hosting & Domains",
  "AI Tools",
  "Shopping",
  "Student Offers",
  "Startup Deals",
  "Finance & Apps",
  "Travel",
  "Food",
  "Recharge & Bills",
  "Other Freebies",
] as const;

/** Base categories + any custom categories added by admin (MCP add_category). */
export function getCategoryNames(): string[] {
  const custom = (localCustomCategories as string[]).filter(
    (c) => !(BASE_CATEGORIES as readonly string[]).includes(c)
  );
  return [...BASE_CATEGORIES, ...custom];
}

export const CATEGORIES = ["All", ...BASE_CATEGORIES] as const;

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryFromSlug(slug: string): string | undefined {
  return getCategoryNames().find((c) => categorySlug(c) === slug);
}

export function isExpired(deal: Deal): boolean {
  if (!deal.expiry) return false;
  return new Date(deal.expiry + "T23:59:59") < new Date();
}

/**
 * Data layer — priority order:
 * 1. NEXT_PUBLIC_API_BASE set → Supabase Edge Function API (GET /deals).
 * 2. Supabase env vars set → read the `deals` table directly.
 * 3. Fallback → data/deals.json (local/dev).
 * Expired deals are filtered out in all cases.
 */
function apiBase(): string | null {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  return base ? base.replace(/\/$/, "") : null;
}

async function fetchDealsFromApi(): Promise<Deal[] | null> {
  const base = apiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/deals?limit=200`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { deals?: Deal[] };
    return Array.isArray(body.deals) ? body.deals : null;
  } catch {
    return null;
  }
}

export async function getDeals(): Promise<Deal[]> {
  const fromApi = await fetchDealsFromApi();
  if (fromApi && fromApi.length > 0) return fromApi.filter((d) => !isExpired(d));
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("id, brand, title, description, code, url, category, badge, expiry, verified, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as Deal[]).filter((d) => !isExpired(d));
      }
    } catch {
      // fall through to local JSON
    }
  }
  return (localDeals as Deal[]).filter((d) => !isExpired(d));
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  const base = apiBase();
  if (base) {
    try {
      const res = await fetch(`${base}/deals/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as { deal?: Deal };
        if (body.deal && !isExpired(body.deal)) return body.deal;
      }
    } catch {
      // fall through to the list lookup
    }
  }
  const deals = await getDeals();
  return deals.find((d) => d.id === id);
}

export async function getDealsByCategory(category: string): Promise<Deal[]> {
  const deals = await getDeals();
  return deals.filter((d) => d.category === category);
}

export function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
