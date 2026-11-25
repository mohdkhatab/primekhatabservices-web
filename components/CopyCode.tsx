"use client";

import { useState } from "react";

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

/**
 * CopyCode — two shapes:
 *  - default: dashed code box with the code + a Copy button (detail page, hero)
 *  - variant="button": a single compact pill button for card footers
 */
export default function CopyCode({
  code,
  large = false,
  variant = "box",
}: {
  code: string;
  large?: boolean;
  variant?: "box" | "button";
}) {
  const [copied, setCopied] = useState(false);
  if (!code) {
    if (variant === "button") return null;
    return (
      <p className={`font-semibold text-brand-600 ${large ? "text-base" : "text-sm"}`}>
        ✓ No code needed — just open the deal
      </p>
    );
  }

  async function copy() {
    await copyText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy promo code ${code}`}
        className={`rounded-full px-4 py-2 font-display text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
          copied
            ? "animate-pop bg-blue-700 text-white"
            : "bg-gradient-to-r from-brand-600 to-blue-700 text-white shadow-glow hover:brightness-110"
        }`}
      >
        {copied ? "Copied ✓" : "Copy Code"}
      </button>
    );
  }

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
        copied ? "border-blue-500 bg-blue-50" : "border-blue-300 bg-blue-50/60"
      }`}
    >
      <span
        className={`flex flex-1 items-center px-3 font-mono font-bold tracking-wider text-brand-700 ${
          large ? "py-3 text-lg" : "py-2 text-sm"
        }`}
      >
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy promo code ${code}`}
        className={`px-3 text-sm font-bold transition-all duration-300 hover:scale-[1.04] active:scale-95 ${
          copied
            ? "animate-pop bg-blue-700 text-white"
            : "bg-white/70 text-brand-600 ring-1 ring-inset ring-blue-300 hover:bg-gradient-to-r hover:from-brand-600 hover:to-blue-700 hover:text-white"
        }`}
      >
        {copied ? "Copied ✓" : "Copy Code"}
      </button>
    </div>
  );
}
