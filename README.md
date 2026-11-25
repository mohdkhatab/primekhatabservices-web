# Prime Khatab Deals — primekhatab.in

Free offers, promo codes and deals website by **Prime Khatab Services**.
This site **replaces the old company website** on the main domain
**https://primekhatab.in**. No user login anywhere — visitors search, copy a
promo code, and go straight to the official deal site.

Categories: Coding Platforms · Hosting & Domains · AI Tools · Shopping ·
Student Offers · Startup Deals · Finance & Apps · Travel · Food ·
Recharge & Bills · Other Freebies (+ custom categories added by admin).

## Tech

- Next.js 14 (App Router) + Tailwind CSS, deployed on **Vercel**
- Backend API: **Supabase Edge Function** (`supabase/functions/api/`) — REST routes for deals/categories, admin-token writes
- Data: **Supabase** (production) with `data/deals.json` fallback (local/dev).
  Website read priority: Edge Function API (`NEXT_PUBLIC_API_BASE`) → Supabase table → `data/deals.json`
- Admin: personal **MCP server** in [`mcp/`](mcp/README.md) (OAuth2-protected)
  + protected admin API route — see "How admin adds deals" below
- Ads: `components/AdSlot.tsx` placeholders ready for Google AdSense / HilltopAds codes
- SEO: metadata + OpenGraph + JSON-LD on every page type, dynamic
  `sitemap.xml` / `robots.txt`, one page per category and per deal

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start
```

The site works with **zero env vars** (reads seed deals from `data/deals.json`).

## Deploy to Vercel (primekhatab.in)

1. Push this code to the GitHub repo connected to the Vercel project
   (package.json is at the repo root — plain Next.js app, no monorepo setup).
   The `mcp/` folder is ignored by the Next.js build.
2. Vercel framework preset: **Next.js** (auto-detected). No build settings to change.
3. Add env vars in Vercel (Project → Settings → Environment Variables) — see below.
4. Domain: `primekhatab.in` (+ `www`) attached to this Vercel project.
   Keep Zoho mail DNS records (MX/SPF/DKIM) untouched.

## Environment variables

| Var | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | Vercel | Edge Function API base, e.g. `https://<REF>.supabase.co/functions/v1/api` (optional, preferred read path) |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL (reads) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Supabase anon key (public reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server only) | Writes via admin API |
| `ADMIN_API_KEY` | Vercel | Bearer key protecting `/api/admin/deals` |
| `NEXT_PUBLIC_SITE_URL` | Vercel | `https://primekhatab.in` |
| `MCP_CLIENT_ID`, `MCP_CLIENT_SECRET`, `MCP_TOKEN_SECRET`, `MCP_ADMIN_TOKEN` (optional) | MCP host only | MCP OAuth2 auth — see `mcp/README.md` |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | MCP host only | MCP writes to Supabase |

Supabase tables/SQL: see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## How admin adds deals — 3 ways

1. **MCP server (main way)** — connect any AI tool (Claude/ChatGPT/Cursor)
   to the server in `mcp/`, then just tell the AI the deal details; it calls
   `add_deal` / `update_deal` / `delete_deal` / `add_category`.
   Full setup + OAuth token flow: [mcp/README.md](mcp/README.md).
2. **Admin API** — `POST /api/admin/deals` with
   `Authorization: Bearer <ADMIN_API_KEY>` and a JSON body
   (`brand, title, description, code, url, category, expiry, badge`).
   `PATCH` updates, `DELETE /api/admin/deals?id=…` deletes.
3. **Supabase dashboard** — insert a row directly in the `deals` table
   (or, in local dev mode, edit `data/deals.json` and redeploy).

## Project structure

```
app/            pages: home, category/[slug], deal/[id], about, submit-deal,
                api/admin/deals, sitemap.ts, robots.ts, layout (SEO/JSON-LD)
components/     Header, Footer, DealCard, CopyCode, DealsExplorer (search+filter), AdSlot
lib/            deals.ts (read layer + categories), store.ts (write layer), supabase.ts
data/           deals.json (seed/fallback), categories.json (custom categories)
mcp/            standalone admin MCP server (separate npm package, not part of the Next build)
supabase/       config.toml, migrations/ (deals+categories schema, RLS), functions/api/ (Edge Function backend API)
```
