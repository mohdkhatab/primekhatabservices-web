import Link from "next/link";
import { DEAL_TYPES, categorySlug, getCategoryNames, getDeals } from "@/lib/deals";
import SiteLogo from "./SiteLogo";

export default async function Footer() {
  const categories = getCategoryNames();
  const deals = await getDeals();

  // Top Deals pill cloud — one pill per brand (newest deal first), real data only.
  const brandDeals = new Map<string, string>();
  [...deals]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .forEach((d) => {
      if (!brandDeals.has(d.brand)) brandDeals.set(d.brand, d.id);
    });
  const topBrands = Array.from(brandDeals.entries()).slice(0, 14);

  return (
    <footer className="mt-20 border-t border-blue-100 bg-gradient-to-b from-blue-50/60 to-white text-slate-500">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Top Deals brand pill cloud */}
        <p className="font-display font-bold text-slate-900">Top Deals</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topBrands.map(([brand, id]) => (
            <Link
              key={brand}
              href={`/deal/${id}`}
              className="rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-blue-50 hover:text-brand-600"
            >
              {brand}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <SiteLogo className="h-9 w-9" />
              <p className="font-display text-lg font-extrabold tracking-tight text-slate-900">
                Prime Khatab <span className="text-gradient">Deals</span>
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Free offers, promo codes, credits and discounts for software, startups, students and
              developers — checked by hand, posted in one simple list. No login, no fees, just deals.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Contact:{" "}
              <a href="mailto:startup@primekhatab.in" className="font-semibold text-brand-600 hover:underline">
                startup@primekhatab.in
              </a>
            </p>
          </div>
          <div>
            <p className="font-display font-bold text-slate-900">Topics</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <Link className="transition hover:text-brand-600" href={`/category/${categorySlug(c)}`}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display font-bold text-slate-900">Deal Types</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {DEAL_TYPES.map((t) => (
                <li key={t}>
                  <Link className="transition hover:text-brand-600" href={`/?type=${encodeURIComponent(t)}#all-deals`}>
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-display font-bold text-slate-900">Explore</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><Link className="transition hover:text-brand-600" href="/categories">All Categories</Link></li>
              <li><Link className="transition hover:text-brand-600" href="/about">About</Link></li>
              <li><Link className="transition hover:text-brand-600" href="/submit-deal">Submit a Deal</Link></li>
              <li><a className="transition hover:text-brand-600" href="mailto:startup@primekhatab.in">Contact</a></li>
              <li><Link className="transition hover:text-brand-600" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="transition hover:text-brand-600" href="/terms">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Affiliate disclosure */}
      <div className="border-t border-blue-100 bg-blue-50/50">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs leading-relaxed text-slate-500">
          Prime Khatab Deals is reader-supported. Some links on this site are affiliate links — if you
          sign up or buy through them, we may earn a small commission at no extra cost to you. That is
          what keeps this list free for everyone.
        </p>
      </div>
      <div className="border-t border-blue-100 py-4 text-center text-xs leading-relaxed text-slate-400">
        <p>
          All brand names, logos and trademarks belong to their respective owners. Listing a brand here
          does not mean it endorses this website.
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Prime Khatab Deals · A Prime Khatab Services project ·
          primekhatab.in · Deals are verified at posting time — always check the final price and code on
          the official site.
        </p>
      </div>
    </footer>
  );
}
