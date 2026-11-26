"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://bancadeltempoidea.org/21/709ff487aff9635be12d29d07db1b71f";
const CONTAINER_ID = "container-709ff487aff9635be12d29d07db1b71f";

/**
 * Native banner ad (single unit, network invoke script + container).
 * Rendered once per page from the root layout, just above the footer —
 * the end-of-content spot on every page, deal detail pages included.
 * The script is injected once; when no ad fills, the container stays
 * empty and invisible (no placeholder box).
 */
export default function NativeAd() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("fetchpriority", "high");
    (wrapRef.current ?? document.body).appendChild(script);
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-6xl px-4 pb-8">
      <div id={CONTAINER_ID} />
    </div>
  );
}
