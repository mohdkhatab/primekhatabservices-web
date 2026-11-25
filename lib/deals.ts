import localDeals from "@/data/deals.json";
import localCustomCategories from "@/data/categories.json";
import { getSupabase } from "./supabase";

/** Deal types — the second browsing axis (Topics = categories, Types = how the saving works). */
export const DEAL_TYPES = [
  "Freebies",
  "Discounts",
  "Trials",
  "Credits",
  "Promo Codes",
  "No Credit Card",
] as const;

export type DealType = (typeof DEAL_TYPES)[number];

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
  // Resourify-style enrichment fields (all optional in raw data — normalizeDeal fills defaults)
  type?: DealType | string;
  views?: number;
  clicks?: number;
  benefits?: string[];
  featured?: boolean;
};

/** All deal categories (Topics) — covers every deal type Prime asked for. */
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

/** Whole days left until expiry (negative = expired). */
export function daysLeft(deal: Deal): number {
  if (!deal.expiry) return 9999;
  const end = new Date(deal.expiry + "T23:59:59").getTime();
  return Math.ceil((end - Date.now()) / 86400000);
}

/** Infer a deal type when raw data (API/Supabase/older JSON) has none. */
export function inferType(deal: Deal): DealType {
  const badge = (deal.badge ?? "").toUpperCase();
  if (deal.code && deal.code.toUpperCase() !== "FREE") return "Promo Codes";
  if (/CREDIT|\$|₹/.test(badge)) return "Credits";
  if (/%|OFF/.test(badge)) return "Discounts";
  if (/TRIAL/.test(badge)) return "Trials";
  if (badge === "FREE" && !deal.code) return "No Credit Card";
  return "Freebies";
}

/** Fill enrichment defaults so every source (API / Supabase / JSON) renders the same. */
export function normalizeDeal(deal: Deal): Deal {
  return {
    ...deal,
    type: deal.type && (DEAL_TYPES as readonly string[]).includes(deal.type) ? deal.type : inferType(deal),
    views: typeof deal.views === "number" ? deal.views : 0,
    clicks: typeof deal.clicks === "number" ? deal.clicks : 0,
    benefits: Array.isArray(deal.benefits) ? deal.benefits : [],
    featured: Boolean(deal.featured),
  };
}

/** Status label used on rich cards, Resourify-style. */
export type DealStatus = "Expired" | "Limited Time" | "New" | "Trending" | "Active";

export function dealStatus(deal: Deal): DealStatus {
  if (isExpired(deal)) return "Expired";
  const left = daysLeft(deal);
  if (left <= 45) return "Limited Time";
  const ageDays = deal.created_at
    ? Math.floor((Date.now() - new Date(deal.created_at + "T00:00:00").getTime()) / 86400000)
    : 999;
  if (ageDays <= 21) return "New";
  if ((deal.clicks ?? 0) >= 300) return "Trending";
  return "Active";
}

/** Big discount figure for the detail page, e.g. "70% OFF", "$200", "FREE". */
export function discountFigure(deal: Deal): string {
  const badge = (deal.badge ?? "").trim();
  if (badge) return badge.toUpperCase().includes("OFF") || badge === "FREE" ? badge : badge;
  return deal.code ? "CODE" : "FREE";
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Data layer — priority order:
 * 1. NEXT_PUBLIC_API_BASE set → Supabase Edge Function API (GET /deals).
 * 2. Supabase env vars set → read the `deals` table directly.
 * 3. Fallback → data/deals.json (local/dev).
 * Expired deals are filtered out in all cases.
 */
const DEFAULT_API_BASE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

function apiBase(): string | null {
  const base = process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE;
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
  if (fromApi && fromApi.length > 0) return fromApi.filter((d) => !isExpired(d)).map(normalizeDeal);
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("id, brand, title, description, code, url, category, badge, expiry, verified, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as Deal[]).filter((d) => !isExpired(d)).map(normalizeDeal);
      }
    } catch {
      // fall through to local JSON
    }
  }
  return (localDeals as Deal[]).filter((d) => !isExpired(d)).map(normalizeDeal);
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  const base = apiBase();
  if (base) {
    try {
      const res = await fetch(`${base}/deals/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as { deal?: Deal };
        if (body.deal && !isExpired(body.deal)) return normalizeDeal(body.deal);
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
