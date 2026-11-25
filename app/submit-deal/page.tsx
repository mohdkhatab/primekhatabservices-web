"use client";

import { useState } from "react";
import { BASE_CATEGORIES } from "@/lib/deals";

export default function SubmitDealPage() {
  const [brand, setBrand] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<string>(BASE_CATEGORIES[0]);
  const [expiry, setExpiry] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Deal submission: ${brand} — ${title}`);
    const body = encodeURIComponent(
      [
        `Brand/Site: ${brand}`,
        `Offer title: ${title}`,
        `Promo code: ${code || "(no code needed)"}`,
        `Deal URL: ${url}`,
        `Category: ${category}`,
        `Expiry: ${expiry || "(not known)"}`,
        `Description: ${description}`,
      ].join("\n")
    );
    window.location.href = `mailto:startup@primekhatab.in?subject=${subject}&body=${body}`;
  }

  const inputCls =
    "w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 ";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-extrabold text-slate-900">Submit a Deal</h1>
      <p className="mt-2 text-slate-500">
        Fill this form — it opens your email app with everything ready to send to
        startup@primekhatab.in. The deal is checked, then posted on the site.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Brand / Website name *</label>
          <input required value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls} placeholder="e.g. Hostinger" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Offer title *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. 75% OFF Web Hosting + Free Domain" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Promo code (if any)</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className={inputCls} placeholder="e.g. SAVE75 — leave empty if no code needed" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Deal URL *</label>
          <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} placeholder="https://…" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {BASE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">Expiry date</label>
            <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Short description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} rows={3} placeholder="What does the user get? Any conditions?" />
        </div>
        <button type="submit" className="h-11 w-full rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
          Send Deal via Email →
        </button>
      </form>
    </div>
  );
}
