"use client";

import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://bancadeltempoidea.org/21/709ff487aff9635be12d29d07db1b71f";
const CONTAINER_ID = "container-709ff487aff9635be12d29d07db1b71f";

/**
 * Native banner ad inside a small, neat frame (Prime's spec: a compact
 * framed box mid-page — homepage grid, category grids and deal detail
 * pages — NOT a full-width strip). The network invoke script is injected
 * once per page; the ad renders inside the frame's container.
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
    <div ref={wrapRef} className="mx-auto w-full max-w-3xl">
      <div className="rounded-lg border border-slate-300 bg-white px-3 pb-3 pt-2">
        <p className="pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Advertisement
        </p>
        <div id={CONTAINER_ID} className="min-h-[100px]" />
      </div>
    </div>
  );
}
