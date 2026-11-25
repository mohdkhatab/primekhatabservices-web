import Link from "next/link";

/**
 * EmptyState — the ONLY thing shown when there are no deals (UI_SPEC):
 * a centred plain message. No illustrations, no counts, no placeholders.
 */
export default function EmptyState() {
  return (
    <div className="px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900">No deals yet</h2>
      <p className="mt-2 text-sm text-slate-500">
        New offers are added regularly. Check back soon.
      </p>
      <Link
        href="/submit-deal"
        className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Submit a Deal
      </Link>
    </div>
  );
}
