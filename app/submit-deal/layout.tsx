import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Deal",
  description: "Share a free offer or promo code with Prime Khatab Deals. It will be checked and posted for everyone.",
  alternates: { canonical: "/submit-deal" },
};

export default function SubmitDealLayout({ children }: { children: React.ReactNode }) {
  return children;
}
