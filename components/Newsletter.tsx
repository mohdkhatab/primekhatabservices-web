"use client";

import { useState } from "react";

/**
 * Newsletter — "Stay Updated" capture block.
 * Front-end only for now: on submit it shows a success state.
 * TODO(backend): wire this form to the Supabase `subscribers` table /
 * Edge Function API when the live Supabase project is connected.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  }

  return (
    <section className="relative mt-16 animate-fade-up overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-100 via-pink-50 to-rose-50 p-6 text-center md:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-pink-200/50 blur-3xl" />
      <h2 className="relative font-display text-xl font-bold text-stone-900 md:text-2xl">Stay Updated — Never Miss a Deal</h2>
      <p className="relative mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
        One short email when a genuinely good deal lands. Every offer on this site is checked by a
        real person before it is posted — no spam, no fake countdowns, unsubscribe anytime.
      </p>
      {done ? (
        <p className="relative mx-auto mt-5 max-w-md animate-pop rounded-2xl border border-rose-300 bg-white px-5 py-3.5 font-semibold text-rose-600 shadow-card">
          ✓ You are on the list! Watch your inbox for the next verified deal.
        </p>
      ) : (
        <form onSubmit={subscribe} className="relative mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="flex-1 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:shadow-glow"
          />
          <button
            type="submit"
            className="btn-shine relative overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-rose-500 px-6 py-3 font-display text-sm font-bold text-white shadow-glow transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Subscribe
          </button>
        </form>
      )}
      {error && <p className="relative mt-2 text-sm font-semibold text-rose-600">{error}</p>}
    </section>
  );
}
