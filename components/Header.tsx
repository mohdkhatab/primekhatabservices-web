import Link from "next/link";
import { getCategoryNames, categorySlug } from "@/lib/deals";
import HeaderSearch from "./HeaderSearch";

export default function Header() {
  const categories = getCategoryNames();
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/80 shadow-[0_8px_30px_-18px_rgba(219,39,119,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="btn-shine relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-400 via-brand-500 to-rose-500 px-2.5 py-1.5 font-display text-base font-extrabold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
            PK
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-stone-900">
            Prime Khatab <span className="text-gradient">Deals</span>
          </span>
        </Link>
        <HeaderSearch />
        <nav className="ml-auto hidden items-center gap-5 text-sm font-medium text-stone-600 lg:flex">
          <Link href="/#new-arrivals" className="transition hover:text-brand-600">Latest Deals</Link>
          <Link href="/category/student-offers" className="transition hover:text-brand-600">Student Deals</Link>
          <Link href="/category/startup-deals" className="transition hover:text-brand-600">Startup Deals</Link>
          <Link href="/categories" className="transition hover:text-brand-600">Categories</Link>
          <Link
            href="/submit-deal"
            className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-4 py-2 font-display font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105"
          >
            Submit Deal
          </Link>
        </nav>
        <Link
          href="/submit-deal"
          className="btn-shine relative ml-auto overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105 lg:hidden"
        >
          Submit
        </Link>
      </div>
      <nav aria-label="Topics" className="border-t border-pink-50">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto whitespace-nowrap px-4 py-2 text-[13px]">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/category/${categorySlug(c)}`}
              className="rounded-full px-3 py-1 text-stone-500 transition hover:bg-pink-50 hover:text-brand-600"
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
