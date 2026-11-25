"use client";

import { useEffect, useState } from "react";
import { BASE_CATEGORIES, DEAL_TYPES } from "@/lib/deals";

const DEFAULT_API_BASE = "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";
const KEY_STORAGE = "pkd-admin-api-key";
const BASE_STORAGE = "pkd-admin-api-base";

const inputCls =
  "w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-blue-100";
const labelCls = "mb-1.5 block text-[13px] font-bold text-slate-700";

/** Small live preview next to an image-URL field. */
function ImagePreview({ url, alt, tall = false }: { url: string; alt: string; tall?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-blue-200 bg-blue-50/50 ${
        tall ? "h-32" : "h-20"
      }`}
    >
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          onError={() => setFailed(true)}
          className={tall ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain p-1.5"}
        />
      ) : (
        <span className="px-3 text-center text-xs font-medium text-slate-400">
          {url ? "Image failed to load — check the link" : "Paste an image link to preview it here"}
        </span>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [apiKey, setApiKey] = useState("");
  const [brand, setBrand] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<string>(BASE_CATEGORIES[0]);
  const [badge, setBadge] = useState("FREE");
  const [expiry, setExpiry] = useState("");
  const [type, setType] = useState<string>(DEAL_TYPES[0]);
  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [benefits, setBenefits] = useState("");
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    try {
      const k = window.localStorage.getItem(KEY_STORAGE);
      const b = window.localStorage.getItem(BASE_STORAGE);
      if (k) setApiKey(k);
      if (b) setApiBase(b);
    } catch {
      // ignore
    }
  }, []);

  function persistConn() {
    try {
      window.localStorage.setItem(KEY_STORAGE, apiKey);
      window.localStorage.setItem(BASE_STORAGE, apiBase);
    } catch {
      // ignore
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!apiKey.trim()) {
      setResult({ ok: false, text: "Enter the Admin API key first." });
      return;
    }
    setBusy(true);
    persistConn();
    const body: Record<string, unknown> = {
      brand: brand.trim(),
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      url: url.trim(),
      category,
      badge: badge.trim() || "FREE",
      type,
      logo_url: logoUrl.trim(),
      image_url: imageUrl.trim(),
      benefits: benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      featured,
    };
    if (expiry) body.expiry = expiry;
    try {
      const res = await fetch(`${apiBase.replace(/\/$/, "")}/deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as {
        deal?: { id?: string; title?: string };
        error?: string;
        message?: string;
      };
      if (res.ok) {
        setResult({
          ok: true,
          text: `Deal added${data.deal?.id ? ` — id: ${data.deal.id}` : ""}. It is live on the site now.`,
        });
        setBrand("");
        setTitle("");
        setDescription("");
        setCode("");
        setUrl("");
        setLogoUrl("");
        setImageUrl("");
        setBenefits("");
        setFeatured(false);
      } else {
        setResult({ ok: false, text: data.error || data.message || `Request failed (HTTP ${res.status}).` });
      }
    } catch {
      setResult({ ok: false, text: "Network error — check the API base URL and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
        Admin — Add a Deal
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Posts straight to the live deals API. Paste a real <strong>logo image link</strong> and a{" "}
        <strong>poster image link</strong> (any CDN or image URL) — they show on the cards, the hero
        and the deal page. Leave them empty and the site uses the blue initial tile instead.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        {/* Connection */}
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-slate-900">Connection</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="api-base">API Base URL</label>
              <input id="api-base" className={inputCls} value={apiBase} onChange={(e) => setApiBase(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="api-key">Admin API Key</label>
              <input
                id="api-key"
                type="password"
                className={inputCls}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Bearer key — kept only in this browser"
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        {/* Deal basics */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-slate-900">Deal Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="brand">Brand *</label>
              <input id="brand" required className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Hostinger" />
            </div>
            <div>
              <label className={labelCls} htmlFor="title">Title *</label>
              <input id="title" required className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Web Hosting — 75% OFF + Free Domain" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="description">Description</label>
              <textarea id="description" rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short, honest summary of the offer." />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="deal-url">Deal URL *</label>
              <input id="deal-url" required type="url" className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <label className={labelCls} htmlFor="code">Promo Code (blank = no code)</label>
              <input id="code" className={inputCls} value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SAVE50" />
            </div>
            <div>
              <label className={labelCls} htmlFor="badge">Badge / Offer Figure</label>
              <input id="badge" className={inputCls} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="FREE · 75% OFF · $200 CREDIT" />
            </div>
            <div>
              <label className={labelCls} htmlFor="category">Category *</label>
              <select id="category" className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                {BASE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="type">Deal Type</label>
              <select id="type" className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                {DEAL_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="expiry">Expiry Date</label>
              <input id="expiry" type="date" className={inputCls} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-blue-600" />
              Featured (hero + announcement bar)
            </label>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="benefits">Key Benefits (one per line)</label>
              <textarea id="benefits" rows={3} className={inputCls} value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder={"Free domain on annual plans\n30-day money-back guarantee"} />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-slate-900">Images</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="logo-url">Logo Image URL</label>
              <input
                id="logo-url"
                type="url"
                className={inputCls}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…/logo.png"
              />
              <div className="mt-2">
                <ImagePreview url={logoUrl.trim()} alt="Logo preview" />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="image-url">Poster Image URL</label>
              <input
                id="image-url"
                type="url"
                className={inputCls}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…/poster.jpg"
              />
              <div className="mt-2">
                <ImagePreview url={imageUrl.trim()} alt="Poster preview" tall />
              </div>
            </div>
          </div>
        </section>

        {result && (
          <p
            role="status"
            className={`rounded-2xl border px-5 py-3.5 text-sm font-semibold ${
              result.ok
                ? "border-blue-300 bg-blue-50 text-brand-700"
                : "border-blue-300 bg-white text-blue-800"
            }`}
          >
            {result.ok ? "✓ " : "⚠ "}
            {result.text}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Posting…" : "Add Deal →"}
        </button>
      </form>
    </div>
  );
}
