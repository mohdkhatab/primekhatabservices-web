"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "pkd-cookie-consent";

/**
 * CookieConsent — premium bottom card shown once.
 * Stores the choice in localStorage ("accepted"); never shows again
 * after the visitor accepts. Links to the Privacy Policy.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      // storage unavailable (private mode) — stay hidden rather than nagging
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore — banner still dismisses for this session
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[60] animate-fade-up sm:left-auto sm:right-6 sm:max-w-md"
    >
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-lift">
        <p className="font-display text-sm font-extrabold text-slate-900">We value your privacy</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
          We use cookies to improve your browsing experience and to understand which deals people
          actually use. Read our{" "}
          <Link href="/privacy" className="font-bold text-brand-600 underline decoration-blue-300 underline-offset-2 hover:text-brand-700">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={accept}
            className="btn-shine relative flex-1 overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95"
          >
            Accept Cookies
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full border border-blue-200 px-5 py-2.5 font-display text-sm font-bold text-brand-700 transition hover:bg-blue-50 active:scale-95"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
