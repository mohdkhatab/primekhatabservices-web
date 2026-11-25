// Data layer for the MCP server — same rules as the website (lib/store.ts):
// Mode A — Supabase: if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set,
//   writes go to the Supabase `deals` / `categories` tables (production mode).
// Mode B — Local JSON: otherwise writes go to the website's data files
//   (data/deals.json + data/categories.json) — local dev mode.
//   Paths can be overridden with DEALS_FILE / CATEGORIES_FILE env vars.
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEALS_FILE = process.env.DEALS_FILE || path.join(here, "..", "data", "deals.json");
export const CATEGORIES_FILE =
  process.env.CATEGORIES_FILE || path.join(here, "..", "data", "categories.json");

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
];

export const dataMode = () =>
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local-json";

function supabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export async function listDeals() {
  if (dataMode() === "supabase") {
    const { data, error } = await supabase()
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
  return readJson(DEALS_FILE, []);
}

export async function addDeal(input) {
  const deal = {
    id: slugify(`${input.brand}-${input.title}`) + "-" + Date.now().toString(36),
    brand: input.brand,
    title: input.title,
    description: input.description || "",
    code: input.code || "",
    url: input.url,
    category: input.category,
    badge: input.badge || "FREE",
    logo_url: input.logo_url || "",
    image_url: input.image_url || "",
    expiry: input.expiry || "2099-12-31",
    verified: true,
    created_at: new Date().toISOString().slice(0, 10),
  };
  if (dataMode() === "supabase") {
    const { error } = await supabase().from("deals").insert(deal);
    if (error) throw new Error(error.message);
    return deal;
  }
  const deals = await readJson(DEALS_FILE, []);
  deals.unshift(deal);
  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2));
  return deal;
}

export async function updateDeal(id, patch) {
  delete patch.id;
  if (dataMode() === "supabase") {
    const { data, error } = await supabase().from("deals").update(patch).eq("id", id).select().single();
    if (error) return null;
    return data;
  }
  const deals = await readJson(DEALS_FILE, []);
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  deals[idx] = { ...deals[idx], ...patch };
  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2));
  return deals[idx];
}

export async function deleteDeal(id) {
  if (dataMode() === "supabase") {
    const { error } = await supabase().from("deals").delete().eq("id", id);
    return !error;
  }
  const deals = await readJson(DEALS_FILE, []);
  const next = deals.filter((d) => d.id !== id);
  if (next.length === deals.length) return false;
  await fs.writeFile(DEALS_FILE, JSON.stringify(next, null, 2));
  return true;
}

export async function listCategories() {
  let custom = [];
  if (dataMode() === "supabase") {
    const { data } = await supabase().from("categories").select("name");
    custom = (data || []).map((r) => r.name);
  } else {
    custom = await readJson(CATEGORIES_FILE, []);
  }
  return [...BASE_CATEGORIES, ...custom.filter((c) => !BASE_CATEGORIES.includes(c))];
}

export async function addCategory(name) {
  if (dataMode() === "supabase") {
    const { error } = await supabase().from("categories").insert({ name });
    if (error) throw new Error(error.message);
    return listCategories();
  }
  const cats = await readJson(CATEGORIES_FILE, []);
  if (!cats.includes(name) && !BASE_CATEGORIES.includes(name)) cats.push(name);
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(cats, null, 2));
  return listCategories();
}
