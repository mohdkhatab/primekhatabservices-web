# Supabase Setup — Prime Khatab Deals

The site works **without** Supabase (it reads `data/deals.json`). Connect
Supabase when you want deals added from the MCP server / admin API to go live
on the Vercel site instantly (Vercel's filesystem is read-only, so production
writes need Supabase).

## 1. Create the project

1. Go to https://supabase.com → New project (free tier is fine).
2. Note the **Project URL** and keys (Project Settings → API):
   - `anon` public key → website reads
   - `service_role` key → server-only writes (MCP + admin API). **Never expose it in the browser.**

## 2. Create the tables

The schema lives in **`supabase/migrations/20261125000000_create_deals_categories.sql`**
(deals + categories, `published` flag, indexes, RLS: public SELECT on
published deals only, writes service-role only).

Either run `supabase db push` after `supabase link --project-ref <REF>`,
or paste that migration file's SQL into the Supabase SQL Editor and run it.

## 2b. Backend API — Edge Function (recommended)

Deploy the REST API in `supabase/functions/api/` (routes: GET/POST/PUT/DELETE
deals, GET/POST categories, admin-token protected writes):

```bash
supabase secrets set ADMIN_API_KEY=<long-random-string>
supabase secrets set MCP_TOKEN_SECRET=<same secret as the MCP server>  # optional
supabase functions deploy api
```

Full guide + curl examples: [supabase/functions/README.md](supabase/functions/README.md).
Then set `NEXT_PUBLIC_API_BASE=https://<REF>.supabase.co/functions/v1/api` in Vercel.

## 3. Set environment variables

**Vercel (website)** — Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...   (only used by /api/admin — server side)
ADMIN_API_KEY=<long random string>                (protects /api/admin/deals)
NEXT_PUBLIC_SITE_URL=https://primekhatab.in
```

**MCP server host:**

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...
```

## 4. (Optional) Load the seed deals

Copy each object from `data/deals.json` into the `deals` table
(Table Editor → Insert row), or ask the MCP-connected AI to re-add them with
`add_deal`. Once the table has rows, the website reads from Supabase first.
