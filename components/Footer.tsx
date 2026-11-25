import Link from "next/link";
import { categorySlug, getCategoryNames } from "@/lib/deals";
import SiteLogo from "./SiteLogo";

/**
 * Footer — plain directory footer (UI_SPEC): logo + one line, category
 * links, page links, disclosures in small text, copyright. No pill
 * clouds, no brand lists, no counts.
 */
export default function Footer() {
  const categories = getCategoryNames();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-500">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <SiteLogo className="h-8 w-8" />
              <p className="text-[17px] font-bold tracking-tight text-slate-900">
                Prime Khatab <span className="text-brand-600">Deals</span>
              </p>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed">
              Free offers, promo codes and deals — listed in one place, no login needed.
            </p>
            <p className="mt-3 text-[13px]">
              Contact:{" "}
              <a href="mailto:startup@primekhatab.in" className="font-medium text-brand-600 hover:underline">
                startup@primekhatab.in
              </a>
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-slate-900">Categories</p>
            <ul className="mt-2 text-[13px] leading-8">
              {categories.map((c) => (
                <li key={c}>
                  <Link className="hover:text-brand-600" href={`/category/${categorySlug(c)}`}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold text-slate-900">Pages</p>
            <ul className="mt-2 text-[13px] leading-8">
              <li><Link className="hover:text-brand-600" href="/categories">All Categories</Link></li>
              <li><Link className="hover:text-brand-600" href="/about">About</Link></li>
              <li><Link className="hover:text-brand-600" href="/submit-deal">Submit a Deal</Link></li>
              <li><Link className="hover:text-brand-600" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-brand-600" href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs leading-relaxed text-slate-400">
          <p>
            Prime Khatab Deals is reader-supported. Some links on this site are affiliate links — if
            you sign up or buy through them, we may earn a small commission at no extra cost to you.
          </p>
          <p className="mt-2">
            All brand names, logos and trademarks belong to their respective owners. Listing a brand
            here does not mean it endorses this website.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Prime Khatab Deals · A Prime Khatab Services project ·
            primekhatab.in · Deals are verified at posting time — always check the final price and
            code on the official site.
          </p>
        </div>
      </div>
    </footer>
  );
}
