"use client";

import { useCallback, useEffect, useState } from "react";

const API_BASE =
  "https://pkvglyflccxwfkfipfvc.supabase.co/functions/v1/api";
const KEY_STORAGE = "pkd-admin-api-key";

type Visit = {
  id: number;
  created_at: string;
  path: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  referrer: string | null;
  user_agent: string | null;
};

type Stats = {
  total: number;
  recent_count: number;
  unique_ips: number;
  today: number;
  by_country: Record<string, number>;
  by_page: Record<string, number>;
  visits: Visit[];
};

function shortDevice(ua: string | null): string {
  if (!ua) return "—";
  const os = /Android/i.test(ua)
    ? "Android"
    : /iPhone|iPad/i.test(ua)
      ? "iPhone/iPad"
      : /Windows/i.test(ua)
        ? "Windows"
        : /Macintosh|Mac OS/i.test(ua)
          ? "Mac"
          : /Linux/i.test(ua)
            ? "Linux"
            : "Other";
  const br = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\/|Opera/i.test(ua)
      ? "Opera"
      : /Chrome/i.test(ua)
        ? "Chrome"
        : /Firefox/i.test(ua)
          ? "Firefox"
          : /Safari/i.test(ua)
            ? "Safari"
            : "Browser";
  return `${os} · ${br}`;
}

function istTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function refHost(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname;
  } catch {
    return ref.slice(0, 40);
  }
}

export default function BandPage() {
  const [apiKey, setApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/visits`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStats((await res.json()) as Stats);
    } catch {
      setError("Data nahi aaya — admin key check karo, phir Refresh dabao.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const k = window.localStorage.getItem(KEY_STORAGE);
    if (k) {
      setApiKey(k);
      void load(k);
    }
  }, [load]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    window.localStorage.setItem(KEY_STORAGE, k);
    setApiKey(k);
    void load(k);
  };

  if (!apiKey) {
    return (
      <div className="mx-auto max-w-sm py-10">
        <h1 className="text-xl font-bold text-slate-900">Visitors — Private</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ye page sirf owner ke liye hai. Apni admin key daalo.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Admin key"
          className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          onClick={saveKey}
          className="mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Open Visitors
        </button>
      </div>
    );
  }

  const countries = stats
    ? Object.entries(stats.by_country).sort((a, b) => b[1] - a[1])
    : [];
  const pages = stats
    ? Object.entries(stats.by_page).sort((a, b) => b[1] - a[1]).slice(0, 10)
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Visitors</h1>
        <button
          onClick={() => void load(apiKey)}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      {stats && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["Total visits", stats.total],
              ["Aaj ke visits (IST)", stats.today],
              ["Unique IPs (recent)", stats.unique_ips],
              ["Countries", countries.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Country se
              </h2>
              <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {countries.map(([c, n]) => (
                  <li
                    key={c}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="text-slate-700">{c}</span>
                    <span className="font-semibold text-slate-900">{n}</span>
                  </li>
                ))}
                {countries.length === 0 && (
                  <li className="px-4 py-3 text-sm text-slate-500">
                    Abhi koi visit nahi.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Top pages
              </h2>
              <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {pages.map(([p, n]) => (
                  <li
                    key={p}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="truncate text-slate-700">{p}</span>
                    <span className="font-semibold text-slate-900">{n}</span>
                  </li>
                ))}
                {pages.length === 0 && (
                  <li className="px-4 py-3 text-sm text-slate-500">
                    Abhi koi visit nahi.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <h2 className="mt-8 text-base font-semibold text-slate-900">
            Recent visits (last {stats.visits.length})
          </h2>
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-semibold">Time (IST)</th>
                  <th className="px-3 py-2 font-semibold">IP</th>
                  <th className="px-3 py-2 font-semibold">Country</th>
                  <th className="px-3 py-2 font-semibold">City</th>
                  <th className="px-3 py-2 font-semibold">Page</th>
                  <th className="px-3 py-2 font-semibold">Device</th>
                  <th className="px-3 py-2 font-semibold">Aaya kahan se</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.visits.map((v) => (
                  <tr key={v.id}>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {istTime(v.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-800">
                      {v.ip ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {v.country ?? "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {v.city ?? "—"}
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-2 text-slate-700">
                      {v.path}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {shortDevice(v.user_agent)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {refHost(v.referrer)}
                    </td>
                  </tr>
                ))}
                {stats.visits.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-slate-500"
                    >
                      Abhi tak koi visit record nahi hua.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
