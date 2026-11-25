import Link from "next/link";
import { getCategoryNames, categorySlug } from "@/lib/deals";

export default function Footer() {
  const categories = getCategoryNames();
  return (
    <footer className="mt-20 border-t border-pink-100 bg-gradient-to-b from-pink-50/60 to-white text-stone-500">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-stone-900">
            Prime Khatab <span className="text-gradient">Deals</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Free offers, promo codes and deals — checked and updated by Prime Khatab Services.
            No login, no fees, just deals.
          </p>
          <p className="mt-3 text-sm text-stone-600">Contact: startup@primekhatab.in</p>
        </div>
        <div>
          <p className="font-display font-bold text-stone-900">Categories</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c}>
                <Link className="transition hover:text-brand-600" href={`/category/${categorySlug(c)}`}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-stone-900">More</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {categories.slice(6).map((c) => (
              <li key={c}>
                <Link className="transition hover:text-brand-600" href={`/category/${categorySlug(c)}`}>{c}</Link>
              </li>
            ))}
            <li><Link className="transition hover:text-brand-600" href="/submit-deal">Submit a Deal</Link></li>
            <li><Link className="transition hover:text-brand-600" href="/about">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pink-100 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Prime Khatab Services · primekhatab.in · Deals are verified at posting time — always check the final price/code on the official site.
      </div>
    </footer>
  );
}
