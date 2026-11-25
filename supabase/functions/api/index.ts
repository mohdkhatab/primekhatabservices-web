// Prime Khatab Deals — Backend API (Supabase Edge Function, Deno)
//
// Routes (relative to the function root, e.g. /functions/v1/api):
//   GET    /deals            public — filters: ?category=, ?q= (search), ?limit=
//   GET    /deals/:id        public
//   POST   /deals            ADMIN — create a deal
//   PUT    /deals/:id        ADMIN — update a deal (partial)
//   DELETE /deals/:id        ADMIN — delete a deal
//   GET    /categories       public
//   POST   /categories       ADMIN — add a custom category
//
// Admin auth (write routes):  Authorization: Bearer <token>  where token is
//   1) the ADMIN_API_KEY secret, OR
//   2) a valid OAuth access token issued by the MCP server token endpoint
//      (HS256 JWT signed with MCP_TOKEN_SECRET, scope "admin", not expired).
//
// Env (auto-provided by Supabase): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Secrets to set manually:         ADMIN_API_KEY, MCP_TOKEN_SECRET (optional)
//   supabase secrets set ADMIN_API_KEY=... MCP_TOKEN_SECRET=...
//
// All reads/writes go through the service role client; RLS keeps the tables
// public-read (published deals only) and service-role-write only.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BASE_CATEGORIES = [
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

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

const error = (message: string, status: number) =>
  json({ error: message }, status);

function getServiceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not available");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------- auth ----

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const binary = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Verify an MCP-issued OAuth token: HS256 JWT, scope=admin, not expired. */
async function verifyMcpToken(token: string): Promise<boolean> {
  const secret = Deno.env.get("MCP_TOKEN_SECRET");
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlToBytes(parts[1])),
    );
    return payload.scope === "admin" && typeof payload.exp === "number" &&
      payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function isAdmin(req: Request): Promise<boolean> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;
  const apiKey = Deno.env.get("ADMIN_API_KEY");
  if (apiKey && timingSafeEqual(token, apiKey)) return true;
  return await verifyMcpToken(token);
}

const unauthorized = () =>
  error(
    "Unauthorized — admin Bearer token required (ADMIN_API_KEY or MCP OAuth token).",
    401,
  );

// ---------------------------------------------------------- validation ----

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function isValidUrl(v: unknown): v is string {
  if (!isNonEmptyString(v)) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const isValidDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v));

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

type DealInput = {
  brand: string;
  title: string;
  description?: string;
  code?: string;
  url: string;
  category: string;
  badge?: string;
  logo_url?: string;
  image_url?: string;
  expiry?: string;
  verified?: boolean;
  published?: boolean;
};

function validateDeal(
  body: Record<string, unknown>,
  partial: boolean,
): string | null {
  if (!partial || "brand" in body) {
    if (!isNonEmptyString(body.brand)) {
      return "brand is required (non-empty string)";
    }
  }
  if (!partial || "title" in body) {
    if (!isNonEmptyString(body.title)) {
      return "title is required (non-empty string)";
    }
  }
  if (!partial || "url" in body) {
    if (!isValidUrl(body.url)) {
      return "url is required and must be a valid http(s) URL";
    }
  }
  if (!partial || "category" in body) {
    if (!isNonEmptyString(body.category)) {
      return "category is required (non-empty string)";
    }
  }
  if (
    "expiry" in body && body.expiry !== undefined && !isValidDate(body.expiry)
  ) {
    return "expiry must be a date in YYYY-MM-DD format";
  }
  for (const f of ["logo_url", "image_url"] as const) {
    if (
      f in body && body[f] !== undefined && body[f] !== "" &&
      !isValidUrl(body[f])
    ) {
      return `${f} must be a valid http(s) URL`;
    }
  }
  for (const f of ["description", "code", "badge"] as const) {
    if (f in body && body[f] !== undefined && typeof body[f] !== "string") {
      return `${f} must be a string`;
    }
  }
  for (const f of ["verified", "published"] as const) {
    if (f in body && body[f] !== undefined && typeof body[f] !== "boolean") {
      return `${f} must be a boolean`;
    }
  }
  return null;
}

function pickDealFields(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (
    const f of [
      "brand",
      "title",
      "description",
      "code",
      "url",
      "category",
      "badge",
      "logo_url",
      "image_url",
      "expiry",
      "verified",
      "published",
    ]
  ) {
    if (body[f] !== undefined) out[f] = body[f];
  }
  return out;
}

async function readJsonBody(
  req: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? body
      : null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------- routes ----

const today = () => new Date().toISOString().slice(0, 10);
const DEAL_COLUMNS =
  "id, brand, title, description, code, url, category, badge, logo_url, image_url, expiry, verified, published, created_at";

async function listDeals(
  db: SupabaseClient,
  params: URLSearchParams,
): Promise<Response> {
  const category = params.get("category");
  const q = (params.get("q") ?? params.get("search") ?? "").replace(
    /[,()%]/g,
    " ",
  ).trim();
  const rawLimit = Number.parseInt(params.get("limit") ?? "100", 10);
  const limit = Number.isNaN(rawLimit)
    ? 100
    : Math.min(Math.max(rawLimit, 1), 200);

  let query = db
    .from("deals")
    .select(DEAL_COLUMNS)
    .eq("published", true)
    .gte("expiry", today())
    .order("created_at", { ascending: false })
    .limit(limit);
  if (category) query = query.eq("category", category);
  if (q) {
    query = query.or(
      `brand.ilike.%${q}%,title.ilike.%${q}%,description.ilike.%${q}%`,
    );
  }

  const { data, error: dbError } = await query;
  if (dbError) return error(dbError.message, 500);
  return json({ deals: data ?? [], count: (data ?? []).length });
}

async function getDeal(db: SupabaseClient, id: string): Promise<Response> {
  const { data, error: dbError } = await db
    .from("deals")
    .select(DEAL_COLUMNS)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (dbError) return error(dbError.message, 500);
  if (!data) return error("Deal not found", 404);
  return json({ deal: data });
}

async function createDeal(db: SupabaseClient, req: Request): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const invalid = validateDeal(body, false);
  if (invalid) return error(invalid, 400);
  const input = body as unknown as DealInput;
  const deal = {
    id: `${slugify(`${input.brand}-${input.title}`)}-${
      Date.now().toString(36)
    }`,
    brand: input.brand.trim(),
    title: input.title.trim(),
    description: input.description ?? "",
    code: input.code ?? "",
    url: input.url,
    category: input.category.trim(),
    badge: input.badge ?? "FREE",
    expiry: input.expiry ?? "2099-12-31",
    verified: input.verified ?? true,
    published: input.published ?? true,
  };
  const { data, error: dbError } = await db.from("deals").insert(deal).select(
    DEAL_COLUMNS,
  ).single();
  if (dbError) return error(dbError.message, 500);
  return json({ deal: data }, 201);
}

async function updateDeal(
  db: SupabaseClient,
  req: Request,
  id: string,
): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const invalid = validateDeal(body, true);
  if (invalid) return error(invalid, 400);
  const patch = pickDealFields(body);
  if (Object.keys(patch).length === 0) {
    return error("No updatable fields provided", 400);
  }
  const { data, error: dbError } = await db
    .from("deals")
    .update(patch)
    .eq("id", id)
    .select(DEAL_COLUMNS)
    .maybeSingle();
  if (dbError) return error(dbError.message, 500);
  if (!data) return error("Deal not found", 404);
  return json({ deal: data });
}

async function deleteDeal(db: SupabaseClient, id: string): Promise<Response> {
  const { data, error: dbError } = await db.from("deals").delete().eq("id", id)
    .select("id");
  if (dbError) return error(dbError.message, 500);
  if (!data || data.length === 0) return error("Deal not found", 404);
  return json({ deleted: id });
}

async function listCategories(db: SupabaseClient): Promise<Response> {
  const { data, error: dbError } = await db.from("categories").select("name")
    .order("name");
  if (dbError) return error(dbError.message, 500);
  const custom = (data ?? []).map((r: { name: string }) => r.name).filter((n) =>
    !BASE_CATEGORIES.includes(n)
  );
  return json({ categories: [...BASE_CATEGORIES, ...custom] });
}

async function createCategory(
  db: SupabaseClient,
  req: Request,
): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  if (!isNonEmptyString(body.name)) {
    return error("name is required (non-empty string)", 400);
  }
  const name = (body.name as string).trim();
  if (!BASE_CATEGORIES.includes(name)) {
    const { error: dbError } = await db.from("categories").insert({ name });
    if (dbError && !/duplicate|unique/i.test(dbError.message)) {
      return error(dbError.message, 500);
    }
  }
  return listCategories(db);
}

// -------------------------------------------------------------- server ----

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean).map(
      decodeURIComponent,
    );
    // Drop the function-name segment when present ("/api/deals" -> ["deals"])
    if (segments[0] === "api") segments.shift();

    const db = getServiceClient();
    const [resource, id] = segments;

    if (resource === "deals" && segments.length === 1) {
      if (req.method === "GET") return listDeals(db, url.searchParams);
      if (req.method === "POST") {
        if (!(await isAdmin(req))) return unauthorized();
        return createDeal(db, req);
      }
    }
    if (resource === "deals" && segments.length === 2 && id) {
      if (req.method === "GET") return getDeal(db, id);
      if (req.method === "PUT") {
        if (!(await isAdmin(req))) return unauthorized();
        return updateDeal(db, req, id);
      }
      if (req.method === "DELETE") {
        if (!(await isAdmin(req))) return unauthorized();
        return deleteDeal(db, id);
      }
    }
    if (resource === "categories" && segments.length === 1) {
      if (req.method === "GET") return listCategories(db);
      if (req.method === "POST") {
        if (!(await isAdmin(req))) return unauthorized();
        return createCategory(db, req);
      }
    }
    if (resource === undefined) {
      return json({
        service: "primekhatab-deals-api",
        routes: [
          "GET /deals",
          "GET /deals/:id",
          "POST /deals",
          "PUT /deals/:id",
          "DELETE /deals/:id",
          "GET /categories",
          "POST /categories",
        ],
      });
    }
    if (resource === "deals" || resource === "categories") {
      return error("Method not allowed for this route", 405);
    }
    return error("Route not found", 404);
  } catch (e) {
    console.error("api function error:", e);
    return error(e instanceof Error ? e.message : "Internal server error", 500);
  }
});
