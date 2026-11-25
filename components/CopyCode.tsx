"use client";

import { useState } from "react";

export default function CopyCode({ code, large = false }: { code: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!code) {
    return (
      <p className={`font-semibold text-brand-600 ${large ? "text-base" : "text-sm"}`}>
        ✓ No code needed — just open the deal
      </p>
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-xl border border-dashed transition-all duration-300 ${
        copied ? "border-rose-400 bg-rose-50" : "border-pink-300 bg-pink-50/70"
      }`}
    >
      <span className={`flex-1 px-3 font-mono font-bold tracking-wider text-brand-700 ${large ? "py-3 text-lg" : "py-2 text-sm"}`}>
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy promo code ${code}`}
        className={`px-3 text-sm font-bold transition-all duration-300 hover:scale-[1.04] active:scale-95 ${
          copied
            ? "animate-pop bg-rose-500 text-white"
            : "bg-white/70 text-brand-600 ring-1 ring-inset ring-pink-300 hover:bg-gradient-to-r hover:from-brand-500 hover:to-rose-500 hover:text-white"
        }`}
      >
        {copied ? "Copied ✓" : "Copy Code"}
      </button>
    </div>
  );
}
