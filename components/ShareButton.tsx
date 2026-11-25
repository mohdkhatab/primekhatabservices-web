"use client";

import { useState } from "react";

/** Share button — native share sheet where available, else copies the page link. */
export default function ShareButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? document.title, url });
        return;
      } catch {
        // user closed the share sheet — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={share}
      className={`rounded-full px-5 py-2.5 font-display text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
        copied
          ? "animate-pop bg-blue-700 text-white shadow-glow"
          : "border border-blue-300 bg-white text-brand-600 hover:bg-blue-50"
      }`}
    >
      {copied ? "Link Copied ✓" : "↗ Share"}
    </button>
  );
}
