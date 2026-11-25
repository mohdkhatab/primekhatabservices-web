export const dynamic = "force-dynamic";

const FN = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

export async function POST(req: Request) {
  const body = await req.text();
  const headers: Record<string, string> = {
    "content-type": req.headers.get("content-type") ?? "application/x-www-form-urlencoded",
  };
  const auth = req.headers.get("authorization");
  if (auth) headers.authorization = auth;
  const res = await fetch(`${FN}/oauth/token`, { method: "POST", headers, body });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
