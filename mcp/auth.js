// OAuth 2.0 client-credentials auth for the personal admin MCP server.
// - POST /oauth/token (in server.js) checks MCP_CLIENT_ID + MCP_CLIENT_SECRET
//   and issues a signed access token (HS256 JWT, signed with MCP_TOKEN_SECRET).
// - Every /mcp request must carry:  Authorization: Bearer <token>
// - Fallback: a static MCP_ADMIN_TOKEN env var also works as a Bearer token
//   (handy for local testing). Keep ALL of these secret — admin only.
import crypto from "crypto";

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function sign(data, secret) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest());
}

export function issueToken(clientId, expiresInSeconds = 3600) {
  const secret = process.env.MCP_TOKEN_SECRET;
  if (!secret) throw new Error("MCP_TOKEN_SECRET env var is not set");
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({ sub: clientId, scope: "admin", iat: now, exp: now + expiresInSeconds })
  );
  const signature = sign(`${header}.${payload}`, secret);
  return { access_token: `${header}.${payload}.${signature}`, token_type: "Bearer", expires_in: expiresInSeconds };
}

export function verifyToken(token) {
  if (!token) return false;
  // Static fallback token
  if (process.env.MCP_ADMIN_TOKEN && timingSafeEqual(token, process.env.MCP_ADMIN_TOKEN)) return true;
  // Signed JWT
  const secret = process.env.MCP_TOKEN_SECRET;
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;
  if (!timingSafeEqual(signature, sign(`${header}.${payload}`, secret))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return data.scope === "admin" && typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function timingSafeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function checkClientCredentials(clientId, clientSecret) {
  const id = process.env.MCP_CLIENT_ID;
  const secret = process.env.MCP_CLIENT_SECRET;
  if (!id || !secret || !clientId || !clientSecret) return false;
  return timingSafeEqual(clientId, id) && timingSafeEqual(clientSecret, secret);
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) {
    return res.status(401).json({
      error: "unauthorized",
      error_description: "Valid Bearer token required. Get one from POST /oauth/token (client_credentials) or use MCP_ADMIN_TOKEN.",
    });
  }
  next();
}
