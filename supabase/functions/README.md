# Supabase Edge Function API — Prime Khatab Deals

One Edge Function named **`api`** (`index.ts` in this folder) is the backend
API for the site. It reads/writes the same `deals` / `categories` tables as
the website and the MCP server.

## Routes

Base URL after deploy: `https://<PROJECT_REF>.supabase.co/functions/v1/api`

| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/deals` | Public | Filters: `?category=Shopping`, `?q=hosting` (search), `?limit=50` (1–200). Only published, non-expired deals. |
| GET | `/deals/:id` | Public | One published deal |
| POST | `/deals` | **Admin** | Body: brand, title, url, category required; description, code, badge, expiry, verified, published optional |
| PUT | `/deals/:id` | **Admin** | Partial update (same fields) |
| DELETE | `/deals/:id` | **Admin** | Deletes the deal |
| GET | `/categories` | Public | Base categories + custom ones from the table |
| POST | `/categories` | **Admin** | Body: `{ "name": "Gaming Deals" }` |

**Admin auth:** header `Authorization: Bearer <token>` where token is either
the `ADMIN_API_KEY` secret, **or** a valid OAuth access token issued by the
MCP server's `/oauth/token` endpoint (HS256 JWT signed with `MCP_TOKEN_SECRET`,
scope `admin`). Set both secrets (below) to accept both.

All responses are JSON. Errors look like `{ "error": "message" }` with a
proper HTTP status (400 validation, 401 unauthorized, 404 not found, 500 server).

## Deploy (needs Prime's Supabase project)

```bash
# 1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
# 2. From the repo root:
supabase link --project-ref <PROJECT_REF>

# 3. Create/update the tables (deals, categories, RLS):
supabase db push
#    (runs supabase/migrations/* — or paste the migration SQL in the SQL Editor)

# 4. Set the function secrets:
supabase secrets set ADMIN_API_KEY=<long-random-string>
supabase secrets set MCP_TOKEN_SECRET=<same secret the MCP server uses>   # optional, enables MCP-token auth
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

# 5. Deploy the function:
supabase functions deploy api
```

Then point the website at it (Vercel env var):

```
NEXT_PUBLIC_API_BASE=https://<PROJECT_REF>.supabase.co/functions/v1/api
```

Website read priority: **Edge Function API → Supabase table → data/deals.json**.

## Local development

```bash
supabase start                       # local Supabase (Docker)
supabase functions serve api --env-file .env.local
# function at http://127.0.0.1:54321/functions/v1/api
```

Type/syntax check without deploying: `deno check supabase/functions/api/index.ts`

## curl test examples

```bash
API=https://<PROJECT_REF>.supabase.co/functions/v1/api
ADMIN=Bearer\ <ADMIN_API_KEY-or-MCP-token>

# Public reads
curl "$API/deals"
curl "$API/deals?category=Shopping&q=hosting&limit=10"
curl "$API/deals/<deal-id>"
curl "$API/categories"

# Admin writes
curl -X POST "$API/deals" -H "Authorization: $ADMIN" -H "Content-Type: application/json" \
  -d '{"brand":"Hostinger","title":"75% OFF Web Hosting","description":"Hosting + free domain","code":"HOST75","url":"https://www.hostinger.in","category":"Hosting & Domains","expiry":"2026-12-31","badge":"75% OFF"}'

curl -X PUT "$API/deals/<deal-id>" -H "Authorization: $ADMIN" -H "Content-Type: application/json" \
  -d '{"badge":"80% OFF","expiry":"2027-01-31"}'

curl -X DELETE "$API/deals/<deal-id>" -H "Authorization: $ADMIN"

curl -X POST "$API/categories" -H "Authorization: $ADMIN" -H "Content-Type: application/json" \
  -d '{"name":"Gaming Deals"}'
```
