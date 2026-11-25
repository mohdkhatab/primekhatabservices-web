import { getCategoryNames, getDeals } from "@/lib/deals";
import DealsExplorer from "@/components/DealsExplorer";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

/**
 * Home — a plain deal directory (UI_SPEC): category chips, deal-type
 * chips and the deals grid. When there are no deals, the empty state
 * is the only content. No hero, no marketing sections.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; type?: string };
}) {
  const deals = await getDeals();
  const categories = getCategoryNames();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Deals on Prime Khatab Deals",
    itemListElement: deals.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.primekhatab.in/deal/${d.id}`,
      name: d.title,
    })),
  };

  if (deals.length === 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <DealsExplorer
        key={`${searchParams?.q ?? ""}|${searchParams?.type ?? ""}`}
        deals={deals}
        categories={categories}
        initialQuery={searchParams?.q ?? ""}
        initialType={searchParams?.type ?? "All"}
      />
    </>
  );
}
