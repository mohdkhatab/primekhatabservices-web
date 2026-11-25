import type { MetadataRoute } from "next";
import { categorySlug, getCategoryNames, getDeals } from "@/lib/deals";

const BASE = "https://primekhatab.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getDeals();
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/submit-deal`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...getCategoryNames().map((c) => ({
      url: `${BASE}/category/${categorySlug(c)}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...deals.map((d) => ({
      url: `${BASE}/deal/${d.id}`,
      lastModified: d.created_at ? new Date(d.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
