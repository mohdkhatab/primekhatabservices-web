-- Prime Khatab Deals — initial schema
-- Tables: deals, categories. RLS: public can SELECT published deals and
-- categories; ALL writes happen only through the service role key
-- (Edge Function API + MCP server), which bypasses RLS.

create table if not exists public.deals (
  id          text primary key,
  brand       text not null,
  title       text not null,
  description text not null default '',
  code        text not null default '',
  url         text not null,
  category    text not null,
  badge       text default 'FREE',
  expiry      date not null default '2099-12-31',
  verified    boolean not null default true,
  published   boolean not null default true,
  created_at  date not null default current_date
);

create table if not exists public.categories (
  name       text primary key,
  created_at timestamptz not null default now()
);

create index if not exists deals_category_idx on public.deals (category);
create index if not exists deals_expiry_idx on public.deals (expiry);
create index if not exists deals_published_idx on public.deals (published);

alter table public.deals enable row level security;
alter table public.categories enable row level security;

-- Public read: only published deals are visible to anon/public clients.
drop policy if exists "deals are public to read" on public.deals;
create policy "published deals are public to read" on public.deals
  for select using (published = true);

drop policy if exists "categories are public to read" on public.categories;
create policy "categories are public to read" on public.categories
  for select using (true);

-- No insert/update/delete policies on purpose:
-- writes are service-role only (Edge Function "api" + MCP server).
