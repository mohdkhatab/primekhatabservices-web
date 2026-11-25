import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Prime Khatab Deals",
  description:
    "Prime Khatab Deals by Prime Khatab Services collects checked free offers, promo codes and deals in one place — no login, no fees.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold text-slate-900">About Prime Khatab Deals</h1>
      <p className="mt-4 leading-relaxed text-slate-600">
        Prime Khatab Deals is run by <strong className="text-brand-600">Prime Khatab Services</strong> (Rajouri, Jammu &amp; Kashmir, India).
        We collect free offers, promo codes and deals from across the internet — coding platforms, hosting,
        AI tools, shopping, student offers, startup deals, finance apps, travel, food and recharge offers —
        check them, and post them here in one simple list.
      </p>
      <p className="mt-3 leading-relaxed text-slate-600">
        No login, no account, no fees. Copy the promo code, tap Get Deal, and you go straight to the official website.
        Deals are verified when posted; prices and codes can change on the official site, so always check there before paying.
      </p>
      <p className="mt-3 leading-relaxed text-slate-600">
        Want to share a deal or talk business? Email: <strong className="text-brand-600">startup@primekhatab.in</strong>
      </p>
    </div>
  );
}
