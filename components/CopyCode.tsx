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
 * CopyCode — two shapes (UI_SPEC: flat buttons only, hover = darker blue):
 *  - default: dashed code box with the code + a Copy button (detail page)
 *  - variant="button": a single compact primary button for card footers
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
      <p className={`font-medium text-slate-600 ${large ? "text-base" : "text-sm"}`}>
        No code needed — just open the deal
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
        className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {copied ? "Copied" : "Copy Code"}
      </button>
    );
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
      <span
        className={`flex flex-1 items-center px-3 font-mono font-bold tracking-wider text-slate-900 ${
          large ? "py-3 text-base" : "py-2 text-sm"
        }`}
      >
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy promo code ${code}`}
        className="bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
