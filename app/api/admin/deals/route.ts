import { NextRequest, NextResponse } from "next/server";
import { addDeal, deleteDeal, updateDeal } from "@/lib/store";

/**
 * Protected admin API — for a future admin panel / scripts.
 * Auth: header  Authorization: Bearer <ADMIN_API_KEY>  (env var, server only).
 * The MCP server (mcp/) is the main admin tool; this route is the HTTP backup.
 *
 * POST   /api/admin/deals   body: { brand, title, description, code, url, category, expiry, badge }
 * PATCH  /api/admin/deals   body: { id, ...fields to change }
 * DELETE /api/admin/deals?id=<deal-id>
 */

function authorized(req: NextRequest): boolean {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return false; // route is disabled until the key is configured
  return req.headers.get("authorization") === `Bearer ${key}`;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized — set ADMIN_API_KEY and send it as a Bearer token." }, { status: 401 });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  try {
    const body = await req.json();
    const { brand, title, description, code, url, category, expiry, badge } = body ?? {};
    if (!brand || !title || !url || !category) {
      return NextResponse.json({ error: "brand, title, url and category are required" }, { status: 400 });
    }
    const deal = await addDeal({
      brand,
      title,
      description: description ?? "",
      code: code ?? "",
      url,
      category,
      expiry: expiry ?? "2099-12-31",
      badge: badge ?? "FREE",
    });
    return NextResponse.json({ ok: true, deal }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to add deal" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const { id, ...patch } = body;
    const deal = await updateDeal(id, patch);
    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    return NextResponse.json({ ok: true, deal });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  const ok = await deleteDeal(id);
  if (!ok) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  return NextResponse.json({ ok: true, deleted: id });
}
