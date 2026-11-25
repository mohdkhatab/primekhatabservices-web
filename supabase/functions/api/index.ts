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

function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json", ...extraHeaders },
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
  featured?: boolean;
  sort_order?: number;
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
  for (const f of ["verified", "published", "featured"] as const) {
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
      "featured",
      "sort_order",
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
  "id, brand, title, description, code, url, category, badge, logo_url, image_url, expiry, verified, published, created_at, views, featured, sort_order";

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
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
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
    logo_url: input.logo_url ?? "",
    image_url: input.image_url ?? "",
    expiry: input.expiry ?? "2099-12-31",
    verified: input.verified ?? true,
    published: input.published ?? true,
    featured: input.featured ?? false,
    sort_order: typeof input.sort_order === "number" ? input.sort_order : 0,
  };
  const { data, error: dbError } = await db.from("deals").insert(deal).select(
    DEAL_COLUMNS,
  ).single();
  if (dbError) return error(dbError.message, 500);
  if (data) notifyNewDeal(db, data as Record<string, unknown>);
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

// ---------------------------------------------------------- web push ----
// Browser push notifications (RFC 8291 aes128gcm + VAPID ES256), implemented
// with WebCrypto only — no external dependency. Secrets: VAPID_PUBLIC_KEY,
// VAPID_PRIVATE_KEY, VAPID_SUBJECT.

function bytesToB64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function vapidJwt(audience: string): Promise<string> {
  const pub = b64urlToBytes(Deno.env.get("VAPID_PUBLIC_KEY") ?? "");
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: bytesToB64url(pub.slice(1, 33)),
    y: bytesToB64url(pub.slice(33, 65)),
    d: Deno.env.get("VAPID_PRIVATE_KEY") ?? "",
  };
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const header = bytesToB64url(
    new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })),
  );
  const payload = bytesToB64url(
    new TextEncoder().encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 3600,
        sub: Deno.env.get("VAPID_SUBJECT") ?? "mailto:startup@primekhatab.in",
      }),
    ),
  );
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  return `${header}.${payload}.${bytesToB64url(new Uint8Array(sig))}`;
}

async function hmacSha256(keyBytes: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data as BufferSource));
}

async function hkdfExpand(prk: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const out = new Uint8Array(length);
  let t = new Uint8Array(0);
  let offset = 0;
  let counter = 1;
  while (offset < length) {
    const input = new Uint8Array(t.length + info.length + 1);
    input.set(t);
    input.set(info, t.length);
    input[input.length - 1] = counter++;
    t = await hmacSha256(prk, input);
    out.set(t.subarray(0, Math.min(t.length, length - offset)), offset);
    offset += t.length;
  }
  return out;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

async function encryptPushPayload(
  p256dhB64: string,
  authB64: string,
  payload: string,
): Promise<{ body: Uint8Array; serverPublic: Uint8Array }> {
  const uaPublic = b64urlToBytes(p256dhB64);
  const authSecret = b64urlToBytes(authB64);

  const uaKey = await crypto.subtle.importKey(
    "raw",
    uaPublic as BufferSource,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const serverPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const shared = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: uaKey },
      serverPair.privateKey,
      256,
    ),
  );
  const serverJwk = await crypto.subtle.exportKey("jwk", serverPair.publicKey);
  const serverPublic = concatBytes(
    new Uint8Array([4]),
    b64urlToBytes(serverJwk.x ?? ""),
    b64urlToBytes(serverJwk.y ?? ""),
  );

  // RFC 8291 key derivation
  const info = concatBytes(
    new TextEncoder().encode("WebPush: info\0"),
    uaPublic,
    serverPublic,
  );
  const prkKey = await hmacSha256(authSecret, shared);
  const ikm = await hkdfExpand(prkKey, info, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmacSha256(salt, ikm);
  const cek = await hkdfExpand(
    prk,
    new TextEncoder().encode("Content-Encoding: aes128gcm\0"),
    16,
  );
  const nonce = await hkdfExpand(
    prk,
    new TextEncoder().encode("Content-Encoding: nonce\0"),
    12,
  );

  const aesKey = await crypto.subtle.importKey("raw", cek as BufferSource, "AES-GCM", false, [
    "encrypt",
  ]);
  const plaintext = concatBytes(new TextEncoder().encode(payload), new Uint8Array([2]));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce as BufferSource },
      aesKey,
      plaintext as BufferSource,
    ),
  );

  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const body = concatBytes(
    salt,
    rs,
    new Uint8Array([serverPublic.length]),
    serverPublic,
    ciphertext,
  );
  return { body, serverPublic };
}

type PushSub = { endpoint: string; p256dh: string; auth: string };

async function sendPush(sub: PushSub, payload: string): Promise<number> {
  const audience = new URL(sub.endpoint).origin;
  const jwt = await vapidJwt(audience);
  const { body } = await encryptPushPayload(sub.p256dh, sub.auth, payload);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "Authorization": `vapid t=${jwt}, k=${Deno.env.get("VAPID_PUBLIC_KEY")}`,
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "TTL": "86400",
    },
    body: body as BodyInit,
  });
  return res.status;
}

async function sendPushToAll(
  db: SupabaseClient,
  message: { title: string; body: string; url: string },
): Promise<{ sent: number; removed: number; total: number }> {
  const { data } = await db.from("push_subscriptions").select("endpoint, p256dh, auth");
  const subs = (data ?? []) as PushSub[];
  let sent = 0;
  let removed = 0;
  const payload = JSON.stringify(message);
  await Promise.all(
    subs.map(async (sub) => {
      try {
        const status = await sendPush(sub, payload);
        if (status === 404 || status === 410) {
          await db.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          removed++;
        } else if (status >= 200 && status < 300) {
          sent++;
        }
      } catch {
        // one bad subscription must not fail the batch
      }
    }),
  );
  return { sent, removed, total: subs.length };
}

function notifyNewDeal(db: SupabaseClient, deal: Record<string, unknown>): void {
  const message = {
    title: `New deal: ${deal.brand}`,
    body: deal.code
      ? `${deal.title} — use code ${deal.code}`
      : String(deal.title ?? ""),
    url: `https://www.primekhatab.in/deal/${deal.id}`,
  };
  const work = sendPushToAll(db, message).catch((e) =>
    console.error("push notify failed:", e)
  );
  // Keep the function alive until sends finish, without blocking the response.
  const rt = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } })
    .EdgeRuntime;
  if (rt?.waitUntil) rt.waitUntil(work);
}

async function subscribePush(db: SupabaseClient, req: Request): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const endpoint = body.endpoint;
  const keys = body.keys as { p256dh?: unknown; auth?: unknown } | undefined;
  if (
    typeof endpoint !== "string" || !endpoint.startsWith("https://") ||
    typeof keys?.p256dh !== "string" || typeof keys?.auth !== "string"
  ) {
    return error("Invalid push subscription", 400);
  }
  const { error: dbError } = await db.from("push_subscriptions").upsert(
    { endpoint, p256dh: keys.p256dh, auth: keys.auth },
    { onConflict: "endpoint" },
  );
  if (dbError) return error(dbError.message, 500);
  return json({ ok: true });
}

async function notifyPush(db: SupabaseClient, req: Request): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const message = {
    title: typeof body.title === "string" ? body.title : "Prime Khatab Deals",
    body: typeof body.body === "string" ? body.body : "A new deal is live.",
    url: typeof body.url === "string" ? body.url : "https://www.primekhatab.in/",
  };
  const result = await sendPushToAll(db, message);
  return json({ ok: true, ...result });
}

// --------------------------------------------------------------- MCP ----
// Remote MCP server (streamable HTTP, JSON-RPC 2.0) so any AI tool can
// manage deals with the URL + credentials:
//   Token:  POST /mcp/token  {grant_type:"client_credentials", client_id,
//           client_secret}  ->  {access_token}  (HS256 JWT, MCP_TOKEN_SECRET)
//   MCP:    POST /mcp  with Authorization: Bearer <token>  (the ADMIN_API_KEY
//           also works directly as the Bearer token)

async function issueMcpToken(clientId: string): Promise<string> {
  const secret = Deno.env.get("MCP_TOKEN_SECRET") ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const now = Math.floor(Date.now() / 1000);
  const header = bytesToB64url(
    new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "HS256" })),
  );
  const payload = bytesToB64url(
    new TextEncoder().encode(
      JSON.stringify({ sub: clientId, scope: "admin", iat: now, exp: now + 3600 }),
    ),
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  return `${header}.${payload}.${bytesToB64url(new Uint8Array(sig))}`;
}

const OAUTH_ISSUER =
  "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return bytesToB64url(arr);
}

async function issueTokenPair(clientId: string) {
  const access_token = await issueMcpToken(clientId);
  return { access_token, token_type: "Bearer", expires_in: 3600, scope: "admin" };
}

async function parseOAuthBody(req: Request): Promise<Record<string, string>> {
  try {
    const raw = await req.text();
    if (!raw) return {};
    if (raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === "string") out[k] = v;
      }
      return out;
    }
    return Object.fromEntries(new URLSearchParams(raw));
  } catch {
    return {};
  }
}

function basicAuth(req: Request): { id: string; secret: string } {
  const basic = (req.headers.get("authorization") ?? "").replace(/^Basic /, "");
  if (!basic) return { id: "", secret: "" };
  try {
    const decoded = atob(basic);
    const idx = decoded.indexOf(":");
    if (idx > -1) {
      const sec = decoded.slice(idx + 1);
      return { id: decoded.slice(0, idx), secret: sec };
    }
  } catch {
    // ignore
  }
  return { id: "", secret: "" };
}

/** Verify a client: the built-in pkd-admin (env) or a DCR-registered client. */
async function verifyOAuthClient(
  db: SupabaseClient,
  id: string,
  secret: string,
): Promise<boolean> {
  const wantId = Deno.env.get("MCP_CLIENT_ID") ?? "";
  const wantSecret = Deno.env.get("MCP_CLIENT_SECRET") ?? "";
  if (wantId && wantSecret && timingSafeEqual(id, wantId)) {
    return timingSafeEqual(secret, wantSecret);
  }
  if (!id) return false;
  const { data } = await db.from("oauth_clients").select("client_secret_hash")
    .eq("client_id", id).maybeSingle();
  if (!data) return false;
  const stored = (data as { client_secret_hash: string }).client_secret_hash;
  if (!stored) return true; // public client (PKCE protects the flow)
  if (!secret) return false;
  return timingSafeEqual(await sha256Hex(secret), stored);
}

async function mcpTokenEndpoint(db: SupabaseClient, req: Request): Promise<Response> {
  const params = await parseOAuthBody(req);
  const basic = basicAuth(req);
  const id = basic.id || params.client_id || "";
  const clientSecret = [basic.secret, params.client_secret].find((v) => !!v) || "";
  const grant = params.grant_type || "client_credentials";

  if (grant === "client_credentials") {
    if (!(await verifyOAuthClient(db, id, clientSecret))) {
      return error("invalid_client", 401);
    }
    return json(await issueTokenPair(id));
  }

  if (grant === "authorization_code") {
    const code = params.code || "";
    const verifier = params.code_verifier || "";
    if (!code || !id) return error("invalid_request", 400);
    const { data } = await db.from("oauth_codes").select("*")
      .eq("code", code).maybeSingle();
    if (!data) return error("invalid_grant", 400);
    const row = data as {
      client_id: string;
      redirect_uri: string;
      code_challenge: string;
      expires_at: string;
      used: boolean;
    };
    if (
      row.used || new Date(row.expires_at).getTime() < Date.now() ||
      row.client_id !== id
    ) {
      return error("invalid_grant", 400);
    }
    if (params.redirect_uri && params.redirect_uri !== row.redirect_uri) {
      return error("invalid_grant", 400);
    }
    if (clientSecret && !(await verifyOAuthClient(db, id, clientSecret))) {
      return error("invalid_client", 401);
    }
    if (row.code_challenge) {
      if (!verifier) return error("invalid_request", 400);
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier),
      );
      if (!timingSafeEqual(bytesToB64url(new Uint8Array(digest)), row.code_challenge)) {
        return error("invalid_grant", 400);
      }
    }
    await db.from("oauth_codes").update({ used: true }).eq("code", code);
    const refresh = randomToken(32);
    await db.from("oauth_refresh").insert({
      token: refresh,
      client_id: id,
      expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    });
    return json({ ...(await issueTokenPair(id)), refresh_token: refresh });
  }

  if (grant === "refresh_token") {
    const token = params.refresh_token || "";
    if (!token || !id) return error("invalid_request", 400);
    const { data } = await db.from("oauth_refresh").select("*")
      .eq("token", token).maybeSingle();
    if (!data) return error("invalid_grant", 400);
    const row = data as { client_id: string; expires_at: string };
    if (row.client_id !== id || new Date(row.expires_at).getTime() < Date.now()) {
      return error("invalid_grant", 400);
    }
    await db.from("oauth_refresh").delete().eq("token", token);
    const refresh = randomToken(32);
    await db.from("oauth_refresh").insert({
      token: refresh,
      client_id: id,
      expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    });
    return json({ ...(await issueTokenPair(id)), refresh_token: refresh });
  }

  return error("unsupported_grant_type", 400);
}

// OAuth discovery documents (RFC 9728 + RFC 8414) so Claude / ChatGPT
// connectors can find the sign-in flow from the MCP URL alone.
function oauthProtectedResource(): Response {
  return json({
    resource: `${OAUTH_ISSUER}/mcp`,
    authorization_servers: [OAUTH_ISSUER],
    bearer_methods_supported: ["header"],
    scopes_supported: ["admin"],
  });
}

function oauthServerMetadata(): Response {
  return json({
    issuer: OAUTH_ISSUER,
    authorization_endpoint: `${OAUTH_ISSUER}/oauth/authorize`,
    token_endpoint: `${OAUTH_ISSUER}/oauth/token`,
    registration_endpoint: `${OAUTH_ISSUER}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token", "client_credentials"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic", "none"],
    scopes_supported: ["admin"],
  });
}

// Dynamic Client Registration (RFC 7591): Claude registers itself, no
// manual client setup needed.
async function oauthRegister(db: SupabaseClient, req: Request): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const clientId = `pkd-${randomToken(9)}`;
  const wantPublic = body.token_endpoint_auth_method === "none";
  const newClientSecret = wantPublic ? "" : randomToken(24);
  const redirectUris = Array.isArray(body.redirect_uris)
    ? (body.redirect_uris as unknown[]).filter((u) => typeof u === "string").join("\n")
    : "";
  const { error: dbError } = await db.from("oauth_clients").insert({
    client_id: clientId,
    client_secret_hash: newClientSecret ? await sha256Hex(newClientSecret) : "",
    redirect_uris: redirectUris,
  });
  if (dbError) return error(dbError.message, 500);
  return json({
    client_id: clientId,
    ...(newClientSecret ? Object.fromEntries([["client_secret", newClientSecret]]) : {}),
    redirect_uris: redirectUris ? redirectUris.split("\n") : [],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: newClientSecret ? "client_secret_post" : "none",
  }, 201);
}

function authorizePage(params: URLSearchParams, message = ""): Response {
  const hidden = ["response_type", "client_id", "redirect_uri", "code_challenge", "code_challenge_method", "state", "scope", "resource"]
    .map((k) => `<input type="hidden" name="${k}" value="${(params.get(k) ?? "").replace(/"/g, "&quot;")}">`)
    .join("");
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connect — Prime Khatab Deals</title>
<style>body{font-family:system-ui,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;max-width:380px;width:92%}
h1{font-size:19px;margin:0 0 6px}p{color:#475569;font-size:14px;line-height:1.5}
input[type=password]{width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;margin:12px 0}
button{width:100%;background:#2563eb;color:#fff;border:0;border-radius:8px;padding:12px;font-size:15px;font-weight:600;cursor:pointer}
.err{color:#dc2626;font-size:13px;margin-top:10px}</style></head>
<body><div class="card">
<h1>Connect to Prime Khatab Deals</h1>
<p>An AI app is asking to manage deals on <b>primekhatab.in</b> (add, update and delete deals). Enter the admin key to approve. Only approve apps you started yourself.</p>
<form method="POST" action="${OAUTH_ISSUER}/oauth/authorize">
${hidden}
<input type="password" name="admin_key" placeholder="Admin key" autocomplete="off" required>
<button type="submit">Approve connection</button>
${message ? `<div class="err">${message}</div>` : ""}
</form></div></body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", ...CORS_HEADERS },
  });
}

async function oauthAuthorize(db: SupabaseClient, req: Request): Promise<Response> {
  if (req.method === "GET") {
    const url = new URL(req.url);
    return authorizePage(url.searchParams);
  }
  const form = Object.fromEntries(new URLSearchParams(await req.text()));
  const params = new URLSearchParams(form as Record<string, string>);
  const adminKey = Deno.env.get("ADMIN_API_KEY") ?? "";
  if (!adminKey || !timingSafeEqual(form.admin_key ?? "", adminKey)) {
    return authorizePage(params, "Wrong admin key — try again.");
  }
  const clientId = form.client_id ?? "";
  const redirectUri = form.redirect_uri ?? "";
  if (!clientId || !redirectUri) {
    return error("client_id and redirect_uri are required", 400);
  }
  if (clientId !== (Deno.env.get("MCP_CLIENT_ID") ?? "")) {
    const { data } = await db.from("oauth_clients")
      .select("redirect_uris").eq("client_id", clientId).maybeSingle();
    if (!data) return error("Unknown client_id", 400);
    const allowed = ((data as { redirect_uris: string }).redirect_uris || "").split("\n");
    if (!allowed.includes(redirectUri)) {
      return error("redirect_uri is not registered for this client", 400);
    }
  }
  const code = randomToken(24);
  const { error: dbError } = await db.from("oauth_codes").insert({
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge: form.code_challenge ?? "",
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (dbError) return error(dbError.message, 500);
  const back = new URL(redirectUri);
  back.searchParams.set("code", code);
  if (form.state) back.searchParams.set("state", form.state);
  return Response.redirect(back.toString(), 302);
}

const MCP_TOOLS = [
  {
    name: "add_deal",
    description:
      "Add a new deal/offer to Prime Khatab Deals (primekhatab.in). It goes live immediately and a push notification is sent to subscribers.",
    inputSchema: {
      type: "object",
      properties: {
        brand: { type: "string", description: "Brand / website name, e.g. Hostinger" },
        title: { type: "string", description: "Offer title" },
        description: { type: "string", description: "What the user gets, eligibility, country limits" },
        code: { type: "string", description: "Promo code, or empty if no code is needed" },
        url: { type: "string", description: "Official deal URL" },
        category: { type: "string", description: "Site category — use list_categories" },
        badge: { type: "string", description: "Badge text, e.g. FREE, 50% OFF, 1 MONTH FREE" },
        expiry: { type: "string", description: "Expiry date YYYY-MM-DD (omit for ongoing offers)" },
        logo_url: { type: "string", description: "Brand logo image URL (omit to auto-use the brand site icon)" },
        image_url: { type: "string", description: "Poster/banner image URL for the deal page" },
        featured: { type: "boolean", description: "Pin as BEST at the top" },
        sort_order: { type: "number", description: "Higher = higher among featured deals" },
      },
      required: ["brand", "title", "url", "category"],
    },
  },
  {
    name: "list_deals",
    description: "List deals currently on the site (optionally filter by category).",
    inputSchema: {
      type: "object",
      properties: { category: { type: "string" } },
    },
  },
  {
    name: "update_deal",
    description: "Update fields of an existing deal by id (use list_deals to find ids).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        brand: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        code: { type: "string" },
        url: { type: "string" },
        category: { type: "string" },
        badge: { type: "string" },
        expiry: { type: "string" },
        logo_url: { type: "string" },
        image_url: { type: "string" },
        verified: { type: "boolean" },
        featured: { type: "boolean" },
        sort_order: { type: "number" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_deal",
    description: "Delete a deal by id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "list_categories",
    description: "List all deal categories on the site.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "add_category",
    description: "Add a new custom deal category.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
];

function mcpText(obj: unknown) {
  return {
    content: [
      {
        type: "text",
        text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2),
      },
    ],
  };
}

async function mcpCallTool(
  db: SupabaseClient,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "add_deal": {
      const invalid = validateDeal(args, false);
      if (invalid) return { error: invalid };
      const input = args as unknown as DealInput;
      let logo = input.logo_url ?? "";
      if (!logo) {
        try {
          const host = new URL(input.url).hostname.replace(/^www\./, "");
          logo = `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
        } catch {
          logo = "";
        }
      }
      const deal = {
        id: `${slugify(`${input.brand}-${input.title}`)}-${Date.now().toString(36)}`,
        brand: input.brand.trim(),
        title: input.title.trim(),
        description: input.description ?? "",
        code: input.code ?? "",
        url: input.url,
        category: input.category.trim(),
        badge: input.badge ?? "FREE",
        logo_url: logo,
        image_url: input.image_url ?? "",
        expiry: input.expiry ?? "2099-12-31",
        verified: true,
        published: true,
        featured: input.featured ?? false,
        sort_order: typeof input.sort_order === "number" ? input.sort_order : 0,
      };
      const { data, error: dbError } = await db.from("deals").insert(deal)
        .select(DEAL_COLUMNS).single();
      if (dbError) return { error: dbError.message };
      if (data) notifyNewDeal(db, data as Record<string, unknown>);
      return data;
    }
    case "list_deals": {
      let query = db.from("deals").select(DEAL_COLUMNS)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (typeof args.category === "string" && args.category) {
        query = query.eq("category", args.category);
      }
      const { data, error: dbError } = await query;
      if (dbError) return { error: dbError.message };
      return data ?? [];
    }
    case "update_deal": {
      const id = args.id;
      if (typeof id !== "string" || !id) return { error: "id is required" };
      const { id: _drop, ...rest } = args;
      const invalid = validateDeal(rest, true);
      if (invalid) return { error: invalid };
      const patch = pickDealFields(rest);
      if (Object.keys(patch).length === 0) return { error: "No fields to update" };
      const { data, error: dbError } = await db.from("deals").update(patch)
        .eq("id", id).select(DEAL_COLUMNS).maybeSingle();
      if (dbError) return { error: dbError.message };
      return data ?? { error: `Deal not found: ${id}` };
    }
    case "delete_deal": {
      const id = args.id;
      if (typeof id !== "string" || !id) return { error: "id is required" };
      const { data, error: dbError } = await db.from("deals").delete()
        .eq("id", id).select("id");
      if (dbError) return { error: dbError.message };
      return { deleted: (data ?? []).length > 0, id };
    }
    case "list_categories": {
      const { data } = await db.from("categories").select("name").order("name");
      const custom = (data ?? []).map((r: { name: string }) => r.name)
        .filter((n) => !BASE_CATEGORIES.includes(n));
      return [...BASE_CATEGORIES, ...custom];
    }
    case "add_category": {
      const name = typeof args.name === "string" ? args.name.trim() : "";
      if (!name) return { error: "name is required" };
      if (!BASE_CATEGORIES.includes(name)) {
        const { error: dbError } = await db.from("categories").insert({ name });
        if (dbError && !/duplicate|unique/i.test(dbError.message)) {
          return { error: dbError.message };
        }
      }
      return { added: name };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function mcpEndpoint(db: SupabaseClient, req: Request): Promise<Response> {
  const body = await readJsonBody(req);
  if (!body) return error("Request body must be a JSON object", 400);
  const id = (body.id ?? null) as string | number | null;
  const method = typeof body.method === "string" ? body.method : "";
  const rpc = (result: unknown) => json({ jsonrpc: "2.0", id, result });
  const rpcError = (code: number, message: string) =>
    json({ jsonrpc: "2.0", id, error: { code, message } });

  if (method.startsWith("notifications/")) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }
  switch (method) {
    case "initialize": {
      const params = (body.params ?? {}) as { protocolVersion?: string };
      return rpc({
        protocolVersion: params.protocolVersion ?? "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "primekhatab-deals-admin", version: "1.0.0" },
      });
    }
    case "ping":
      return rpc({});
    case "tools/list":
      return rpc({ tools: MCP_TOOLS });
    case "tools/call": {
      const params = (body.params ?? {}) as {
        name?: string;
        arguments?: Record<string, unknown>;
      };
      if (!params.name) return rpcError(-32602, "tools/call requires a tool name");
      try {
        const result = await mcpCallTool(db, params.name, params.arguments ?? {});
        const isErr =
          result !== null && typeof result === "object" && "error" in result;
        return rpc({ ...mcpText(result), ...(isErr ? { isError: true } : {}) });
      } catch (e) {
        return rpc({
          ...mcpText({ error: e instanceof Error ? e.message : "Tool failed" }),
          isError: true,
        });
      }
    }
    default:
      return rpcError(-32601, `Method not found: ${method}`);
  }
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
    if (
      resource === "deals" && segments.length === 3 && id &&
      segments[2] === "view" && req.method === "POST"
    ) {
      // Public view counter — one call per deal-page view from the site.
      const { error: rpcError } = await db.rpc("increment_deal_view", {
        deal_id: id,
      });
      if (rpcError) return error(rpcError.message, 500);
      return json({ ok: true });
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
    if (resource === "mcp" && segments.length === 2 && segments[1] === "token") {
      if (req.method === "POST") return mcpTokenEndpoint(db, req);
    }
    if (
      resource === ".well-known" && segments.length === 2 &&
      segments[1] === "oauth-protected-resource"
    ) {
      if (req.method === "GET") return oauthProtectedResource();
    }
    if (
      resource === ".well-known" && segments.length === 2 &&
      segments[1] === "oauth-authorization-server"
    ) {
      if (req.method === "GET") return oauthServerMetadata();
    }
    if (resource === "oauth" && segments.length === 2 && segments[1] === "token") {
      if (req.method === "POST") return mcpTokenEndpoint(db, req);
    }
    if (resource === "oauth" && segments.length === 2 && segments[1] === "register") {
      if (req.method === "POST") return oauthRegister(db, req);
    }
    if (resource === "oauth" && segments.length === 2 && segments[1] === "authorize") {
      if (req.method === "GET" || req.method === "POST") {
        return oauthAuthorize(db, req);
      }
    }
    if (resource === "mcp" && segments.length === 1) {
      if (req.method === "POST") {
        if (!(await isAdmin(req))) {
          return json(
            { error: "Unauthorized — OAuth sign-in or admin Bearer token required." },
            401,
            {
              "WWW-Authenticate":
                `Bearer resource_metadata="${OAUTH_ISSUER}/.well-known/oauth-protected-resource", scope="admin"`,
            },
          );
        }
        return mcpEndpoint(db, req);
      }
      if (req.method === "GET") {
        return json({
          service: "primekhatab-deals-mcp",
          transport: "streamable-http (JSON-RPC 2.0 over POST)",
          token_url: "POST /mcp/token (OAuth2 client_credentials)",
          tools: MCP_TOOLS.map((t) => t.name),
        });
      }
    }
    if (resource === "push" && segments.length === 2 && segments[1] === "subscribe") {
      if (req.method === "POST") return subscribePush(db, req);
    }
    if (resource === "push" && segments.length === 2 && segments[1] === "notify") {
      if (req.method === "POST") {
        if (!(await isAdmin(req))) return unauthorized();
        return notifyPush(db, req);
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
