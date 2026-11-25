import { getDeals, getCategoryNames } from "@/lib/deals";
import DealsExplorer from "@/components/DealsExplorer";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const deals = await getDeals();
  const categories = getCategoryNames();
  return (
    <>
      <section className="relative overflow-hidden py-10 text-center md:py-14">
        {/* Ambient pink glows */}
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-[85%] animate-float rounded-full bg-pink-200/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -top-10 right-0 h-64 w-64 translate-x-1/3 animate-float rounded-full bg-rose-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-pink-50/80 to-white" />
        <div className="relative animate-fade-up">
          <span className="inline-block rounded-full border border-pink-200 bg-pink-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            Daily Updated · 100% Free to Use
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-stone-900 md:text-6xl">
            Free Offers, Promo Codes <span className="text-gradient">&amp; Deals</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-stone-500">
            Coding platforms, hosting, AI tools, shopping, student offers, startup deals, finance,
            travel, food and recharge offers — checked daily. No login. Copy the code and go.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-stone-600">
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">{deals.length}+ Live Deals</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">{categories.length} Categories</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">✓ Verified Offers</span>
            <span className="rounded-full bg-pink-50 px-3 py-1.5 ring-1 ring-pink-100">No Login Needed</span>
          </div>
        </div>
      </section>

      <AdSlot placement="top" className="mb-10" />

      <DealsExplorer deals={deals} categories={categories} />

      <section className="relative mt-16 animate-fade-up overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-100 via-pink-50 to-rose-50 p-6 text-center md:p-10">
        <h2 className="font-display text-xl font-bold text-stone-900 md:text-2xl">Know a free offer or promo code?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-500">
          Share it and help everyone save. Send the deal and it will be checked and posted here.
        </p>
        <a
          href="/submit-deal"
          className="btn-shine relative mt-5 inline-block overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-7 py-2.5 font-display font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          Submit a Deal
        </a>
      </section>
    </>
  );
}
