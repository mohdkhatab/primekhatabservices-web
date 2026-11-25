import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Simple terms for using Prime Khatab Deals: deals are checked when posted, final prices and codes are confirmed on the official brand website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold text-slate-900">Terms of Use</h1>
      <div className="mt-4 space-y-3 leading-relaxed text-slate-600">
        <p>
          Prime Khatab Deals lists free offers, promo codes and discounts for information only. Every deal
          is checked when it is posted, but offers change: a code can expire, a price can move, and stock can end.
        </p>
        <p>
          The final price, discount and terms are always decided by the brand&apos;s official website at the
          moment you buy or sign up. Please confirm everything there before paying.
        </p>
        <p>
          Brand names and logos belong to their respective owners; listing a brand here does not mean the
          brand endorses this website. Some links are affiliate links — if you buy through them, we may earn
          a small commission at no extra cost to you.
        </p>
        <p>
          By using this site you accept these terms. Questions: startup@primekhatab.in.
        </p>
      </div>
    </div>
  );
}
