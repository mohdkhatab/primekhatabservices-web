# Prime Khatab Deals — Admin MCP Server (Personal)

A private MCP server so the **admin only** (Prime) can add deals to
[primekhatab.in](https://primekhatab.in) from **any AI tool** — just tell the AI
"add this deal" and it calls this server. No website login is involved; the
public site stays login-free.

## Tools exposed

| Tool | What it does |
|---|---|
| `add_deal` | Add a deal (brand, title, description, code, url, category, expiry, badge) |
| `list_deals` | List stored deals (optional category filter) |
| `update_deal` | Change fields of a deal by id |
| `delete_deal` | Delete a deal by id |
| `list_categories` | List all categories |
| `add_category` | Add a custom category |

## Run it

```bash
cd mcp
npm install
npm start          # listens on http://localhost:8787  (PORT env to change)
npm run check      # syntax-check all files
```

Endpoints:

- `POST /mcp` — MCP (Streamable HTTP), **Bearer token required**
- `POST /oauth/token` — OAuth 2.0 client-credentials token endpoint
- `GET /health` — status + data mode

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `MCP_CLIENT_ID` | Yes | OAuth client id (you invent it, e.g. `prime-admin`) |
| `MCP_CLIENT_SECRET` | Yes | OAuth client secret (long random string — **never share**) |
| `MCP_TOKEN_SECRET` | Yes | Secret used to sign access tokens (another long random string) |
| `MCP_ADMIN_TOKEN` | No | Static fallback Bearer token (skips the token endpoint) |
| `PORT` | No | Default 8787 |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | No | If set, deals are written to Supabase (production). If not set, deals are written to the website's local `data/deals.json` + `data/categories.json` (local dev mode). |
| `DEALS_FILE` / `CATEGORIES_FILE` | No | Override local JSON file paths |

Generate secrets, e.g.: `openssl rand -hex 32`

## Get a token (curl)

```bash
curl -X POST http://localhost:8787/oauth/token \
  -d grant_type=client_credentials \
  -d client_id=prime-admin \
  -d client_secret=YOUR_MCP_CLIENT_SECRET
# → { "access_token": "eyJ...", "token_type": "Bearer", "expires_in": 3600 }
```

## Connect from an AI client

Most MCP clients accept a remote-server config like this (Claude / Cursor /
ChatGPT developer mode style — exact UI differs per tool):

```json
{
  "mcpServers": {
    "primekhatab-deals": {
      "url": "https://YOUR-MCP-HOST/mcp",
      "headers": { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
    }
  }
}
```

For tools that support OAuth client-credentials directly, point them at
`https://YOUR-MCP-HOST/oauth/token` with your client id/secret.
Tokens expire in 1 hour; fetch a fresh one when a call returns 401.

Then just say to the AI: *"Add a deal: brand Hostinger, title 75% OFF hosting,
code HOST75, url https://…, category Hosting & Domains, expiry 2026-12-31"* —
it will call `add_deal` for you.

## Hosting the MCP server

Run it on any always-on Node host (e.g. Prime's AWS VPS) behind HTTPS
(reverse proxy), and open only the proxy port. Do **not** expose it without
HTTPS in production — the Bearer token is the only key.

## Security notes

- This server is **admin-only**. Never share `MCP_CLIENT_SECRET`,
  `MCP_TOKEN_SECRET` or `MCP_ADMIN_TOKEN` with anyone, and never put them in
  git or in the public website code.
- Every `/mcp` request without a valid token is rejected with 401.
- Rotate the secrets if one ever leaks (change env vars + restart).
- The Supabase **service role key bypasses row-level security** — server use only.
