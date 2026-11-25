export const dynamic = "force-dynamic";

const FN = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch(`${FN}/oauth/register`, {
    method: "POST",
    headers: { "content-type": req.headers.get("content-type") ?? "application/json" },
    body,
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
