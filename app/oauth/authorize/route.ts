export const dynamic = "force-dynamic";

const FN = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";
const FIELDS = [
  "response_type",
  "client_id",
  "redirect_uri",
  "code_challenge",
  "code_challenge_method",
  "state",
  "scope",
  "resource",
];

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function page(params: URLSearchParams, message = "") {
  const hidden = FIELDS.map(
    (k) => `<input type="hidden" name="${k}" value="${esc(params.get(k) ?? "")}">`
  ).join("");
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
<form method="POST" action="/oauth/authorize">
${hidden}
<input type="password" name="admin_key" placeholder="Admin key" autocomplete="off" required>
<button type="submit">Approve connection</button>
${message ? `<div class="err">${esc(message)}</div>` : ""}
</form></div></body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export function GET(req: Request) {
  return page(new URL(req.url).searchParams);
}

export async function POST(req: Request) {
  const formText = await req.text();
  const res = await fetch(`${FN}/oauth/authorize`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: formText,
    redirect: "manual",
  });
  const location = res.headers.get("location");
  if (res.status >= 300 && res.status < 400 && location) {
    return new Response(null, { status: 302, headers: { Location: location } });
  }
  // Wrong admin key etc. — the function returns the form page again.
  const html = await res.text();
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
