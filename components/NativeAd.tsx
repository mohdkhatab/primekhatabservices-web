"use client";

/**
 * Native banner ad inside a SMALL iframe frame (Prime's spec: after
 * every deal, one small iframe; the ad must show INSIDE the iframe only,
 * never outside it — "us iframe ke andar hi ad dikhni chahiye, ads
 * bahar nahi dikhne chahiye").
 *
 * The network code (container div + invoke script) runs inside the
 * iframe's own document, so whatever the unit injects stays contained
 * in this small fixed-size box. In grids it sits as its own cell right
 * after each deal card; on deal detail pages it is one standalone
 * framed box mid-page. Iframes are lazy-loaded.
 */
const AD_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>html,body{margin:0;padding:0;overflow:hidden;background:#ffffff}</style>
</head><body>
<div id="container-709ff487aff9635be12d29d07db1b71f"></div>
<script async data-cfasync="false" src="https://bancadeltempoidea.org/21/709ff487aff9635be12d29d07db1b71f"></script>
</body></html>`;

export default function NativeAd({
  variant = "standalone",
}: {
  variant?: "grid" | "standalone";
}) {
  return (
    <div className={variant === "grid" ? "w-full" : "mx-auto w-full max-w-[580px]"}>
      <div className="flex h-full flex-col rounded-lg border border-slate-300 bg-white px-2 pb-2 pt-1.5">
        <p className="pb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Advertisement
        </p>
        <iframe
          title="Advertisement"
          srcDoc={AD_HTML}
          className="block h-[130px] w-full flex-1 border-0"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
