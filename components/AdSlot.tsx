/**
 * AdSlot — placeholder ad container.
 * To go live with ads, paste the network code INSIDE this component
 * (replace the placeholder div), or load the network script in app/layout.tsx:
 *  - Google AdSense: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossOrigin="anonymous" />
 *    then render <ins className="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="YYYY" />
 *  - HilltopAds: paste the HilltopAds zone script tag for this placement.
 * Keep one AdSlot component per placement so sizes stay consistent.
 */
export default function AdSlot({
  placement = "banner",
  className = "",
}: {
  placement?: "top" | "infeed" | "sidebar" | "banner";
  className?: string;
}) {
  const height = placement === "sidebar" ? "min-h-[250px]" : "min-h-[90px]";
  return (
    <div
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={`flex items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 text-[11px] uppercase tracking-[0.25em] text-stone-400 ${height} ${className}`}
    >
      Ad — {placement}
    </div>
  );
}
