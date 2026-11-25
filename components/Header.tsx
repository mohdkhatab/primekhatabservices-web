import Link from "next/link";
import { DEAL_TYPES, getCategoryNames, getDeals } from "@/lib/deals";
import HeaderSearch from "./HeaderSearch";
import HeaderMenu from "./HeaderMenu";
import SiteLogo from "./SiteLogo";

/**
 * Sticky header — LEFT: three-dots button opening the category drawer,
 * then the logo + wordmark. CENTER: search. RIGHT: Submit a Deal pill.
 * On mobile the search moves to its own row under the top bar.
 */
export default async function Header() {
  const deals = await getDeals();
  const categories = getCategoryNames().map((name) => ({
    name,
    count: deals.filter((d) => d.category === name).length,
  }));
  const types = DEAL_TYPES.map((name) => ({
    name,
    count: deals.filter((d) => d.type === name).length,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-[0_10px_36px_-20px_rgba(29,78,216,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3">
        <HeaderMenu categories={categories} types={types} />

        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <SiteLogo className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            Prime Khatab <span className="text-gradient">Deals</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-3">
          <HeaderSearch />
        </div>

        <Link
          href="/submit-deal"
          className="btn-shine relative order-2 ml-auto hidden shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-95 sm:order-3 sm:ml-0 md:block"
        >
          Submit a Deal
        </Link>
        <Link
          href="/submit-deal"
          className="order-2 ml-auto shrink-0 rounded-full bg-gradient-to-r from-brand-600 to-blue-700 px-4 py-2 font-display text-sm font-bold text-white shadow-glow transition active:scale-95 sm:order-3 sm:ml-0 md:hidden"
        >
          Submit
        </Link>
      </div>
    </header>
  );
}
