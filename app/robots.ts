import type { MetadataRoute } from "next";

// AI search / answer-engine crawlers are explicitly welcome so the site can
// be cited by ChatGPT, Claude, Perplexity, Gemini and other AI assistants.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/admin"],
      })),
    ],
    sitemap: "https://primekhatab.in/sitemap.xml",
    host: "https://primekhatab.in",
  };
}
