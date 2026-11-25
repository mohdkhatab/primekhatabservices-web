export const dynamic = "force-dynamic";

const FN = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";

export function GET() {
  return Response.json({
    resource: `${FN}/mcp`,
    authorization_servers: ["https://www.primekhatab.in"],
    bearer_methods_supported: ["header"],
    scopes_supported: ["admin"],
  });
}
