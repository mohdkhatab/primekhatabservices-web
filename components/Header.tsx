import Link from "next/link";
import { DEAL_TYPES, getCategoryNames } from "@/lib/deals";
import HeaderSearch from "./HeaderSearch";
import HeaderMenu from "./HeaderMenu";
import SiteLogo from "./SiteLogo";

/**
 * Sticky header — plain white bar with a thin bottom border.
 * LEFT: three-dots menu button (opens the category drawer), then the
 * logo + wordmark. RIGHT: search + a plain Submit a Deal button.
 * On mobile the search moves to its own row under the top bar.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3">
        <HeaderMenu categories={getCategoryNames()} types={[...DEAL_TYPES]} />

        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <SiteLogo className="h-9 w-9" />
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            Prime Khatab <span className="text-brand-600">Deals</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-3">
          <HeaderSearch />
        </div>

        <Link
          href="/submit-deal"
          className="order-2 ml-auto hidden shrink-0 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 sm:order-3 sm:ml-0 md:block"
        >
          Submit a Deal
        </Link>
      </div>
    </header>
  );
}
