import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { slugifyId, type Deal } from "./deals";

/**
 * Write-side data store — used ONLY by the protected admin API route
 * (app/api/admin/deals) and mirrored by the standalone MCP server (mcp/).
 *
 * Mode A — Supabase: if NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   are set, writes go to the Supabase `deals` / `categories` tables.
 * Mode B — Local JSON (dev): otherwise writes go to data/deals.json /
 *   data/categories.json on disk. NOTE: on Vercel the filesystem is
 *   read-only/ephemeral, so production writes MUST use Supabase mode.
 */

const DEALS_FILE = path.join(process.cwd(), "data", "deals.json");
const CATEGORIES_FILE = path.join(process.cwd(), "data", "categories.json");

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function addDeal(input: Omit<Deal, "id" | "created_at" | "verified"> & { verified?: boolean }): Promise<Deal> {
  const deal: Deal = {
    type: "Freebies",
    views: 0,
    clicks: 0,
    benefits: [],
    featured: false,
    ...input,
    id: slugifyId(`${input.brand}-${input.title}`) + "-" + Date.now().toString(36),
    verified: input.verified ?? true,
    created_at: new Date().toISOString().slice(0, 10),
  };
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from("deals").insert(deal);
    if (error) throw new Error(error.message);
    return deal;
  }
  const deals = await readJson<Deal[]>(DEALS_FILE, []);
  deals.unshift(deal);
  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2));
  return deal;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal | null> {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data, error } = await supabase.from("deals").update(patch).eq("id", id).select().single();
    if (error) return null;
    return data as Deal;
  }
  const deals = await readJson<Deal[]>(DEALS_FILE, []);
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  deals[idx] = { ...deals[idx], ...patch, id };
  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2));
  return deals[idx];
}

export async function deleteDeal(id: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from("deals").delete().eq("id", id);
    return !error;
  }
  const deals = await readJson<Deal[]>(DEALS_FILE, []);
  const next = deals.filter((d) => d.id !== id);
  if (next.length === deals.length) return false;
  await fs.writeFile(DEALS_FILE, JSON.stringify(next, null, 2));
  return true;
}

export async function addCategory(name: string): Promise<string[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    await supabase.from("categories").insert({ name });
    const { data } = await supabase.from("categories").select("name");
    return (data ?? []).map((r: { name: string }) => r.name);
  }
  const cats = await readJson<string[]>(CATEGORIES_FILE, []);
  if (!cats.includes(name)) cats.push(name);
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(cats, null, 2));
  return cats;
}
