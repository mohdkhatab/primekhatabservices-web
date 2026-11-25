// Prime Khatab Deals — personal ADMIN MCP server.
// Transport: MCP Streamable HTTP at POST /mcp
// Auth: OAuth 2.0 client-credentials — POST /oauth/token issues a signed
// Bearer token; /mcp rejects every request without a valid token.
// Run:  npm install && npm start     (see README.md for env vars)
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { issueToken, checkClientCredentials, requireAuth } from "./auth.js";
import * as db from "./data.js";

const PORT = process.env.PORT || 8787;
const text = (obj) => ({ content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] });

function buildServer() {
  const server = new McpServer({ name: "primekhatab-deals-admin", version: "1.0.0" });

  server.tool(
    "add_deal",
    "Add a new deal/offer to Prime Khatab Deals (primekhatab.in). Admin only.",
    {
      brand: z.string().describe("Brand / website name, e.g. Hostinger"),
      title: z.string().describe("Offer title, e.g. 75% OFF Web Hosting + Free Domain"),
      description: z.string().optional().describe("Short description of what the user gets"),
      code: z.string().optional().describe("Promo code, or empty string if no code is needed"),
      url: z.string().url().describe("Official deal URL"),
      category: z.string().describe("One of the site categories — use list_categories to see them"),
      expiry: z.string().optional().describe("Expiry date YYYY-MM-DD"),
      badge: z.string().optional().describe("Badge text, e.g. FREE, 50% OFF, APPLY"),
    },
    async (args) => text(await db.addDeal(args))
  );

  server.tool(
    "list_deals",
    "List all deals currently stored (optionally filter by category).",
    { category: z.string().optional().describe("Only return deals in this category") },
    async ({ category }) => {
      const deals = await db.listDeals();
      return text(category ? deals.filter((d) => d.category === category) : deals);
    }
  );

  server.tool(
    "update_deal",
    "Update fields of an existing deal by its id (use list_deals to find ids).",
    {
      id: z.string(),
      brand: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      code: z.string().optional(),
      url: z.string().url().optional(),
      category: z.string().optional(),
      expiry: z.string().optional(),
      badge: z.string().optional(),
      verified: z.boolean().optional(),
    },
    async ({ id, ...patch }) => {
      const deal = await db.updateDeal(id, patch);
      return text(deal ?? { error: `Deal not found: ${id}` });
    }
  );

  server.tool(
    "delete_deal",
    "Delete a deal by its id (use list_deals to find ids).",
    { id: z.string() },
    async ({ id }) => text({ deleted: await db.deleteDeal(id), id })
  );

  server.tool("list_categories", "List all deal categories on the site.", {}, async () =>
    text(await db.listCategories())
  );

  server.tool(
    "add_category",
    "Add a new custom deal category (base categories already exist — see list_categories).",
    { name: z.string().describe("New category name, e.g. Gaming Deals") },
    async ({ name }) => text({ categories: await db.addCategory(name) })
  );

  return server;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) =>
  res.json({ ok: true, service: "primekhatab-deals-mcp", dataMode: db.dataMode() })
);

// OAuth 2.0 token endpoint (client_credentials grant)
app.post("/oauth/token", (req, res) => {
  const { grant_type, client_id, client_secret } = req.body || {};
  // Also allow HTTP Basic client auth
  let id = client_id;
  let secret = client_secret;
  const basic = (req.headers.authorization || "").replace(/^Basic /, "");
  if (!id && basic) {
    const decoded = Buffer.from(basic, "base64").toString();
    const idx = decoded.indexOf(":");
    if (idx > -1) {
      id = decoded.slice(0, idx);
      secret = decoded.slice(idx + 1);
    }
  }
  if (grant_type !== "client_credentials") {
    return res.status(400).json({ error: "unsupported_grant_type", error_description: "Only client_credentials is supported." });
  }
  if (!checkClientCredentials(id, secret)) {
    return res.status(401).json({ error: "invalid_client", error_description: "Wrong client_id or client_secret." });
  }
  try {
    return res.json(issueToken(id));
  } catch (e) {
    return res.status(500).json({ error: "server_error", error_description: e.message });
  }
});

// MCP endpoint — Bearer auth required, stateless streamable HTTP
app.post("/mcp", requireAuth, async (req, res) => {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: "mcp_error", error_description: e.message });
  }
});

// Stateless server: no server-initiated GET/DELETE sessions
app.get("/mcp", (_req, res) => res.status(405).json({ error: "method_not_allowed", error_description: "POST only." }));
app.delete("/mcp", (_req, res) => res.status(405).json({ error: "method_not_allowed", error_description: "POST only." }));

app.listen(PORT, () => {
  console.log(`Prime Khatab Deals MCP server listening on http://localhost:${PORT}`);
  console.log(`  MCP endpoint:  POST /mcp   (Bearer token required)`);
  console.log(`  Token endpoint: POST /oauth/token  (client_credentials)`);
  console.log(`  Data mode: ${db.dataMode()}`);
});
