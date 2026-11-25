import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Prime Khatab Deals handles your data — in short: we do not ask for accounts, and we do not sell personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold text-stone-900">Privacy Policy</h1>
      <div className="mt-4 space-y-3 leading-relaxed text-stone-600">
        <p>
          Prime Khatab Deals is a listing website run by Prime Khatab Services. You can browse every
          deal here without creating an account — we do not ask for your name, password or payment details, ever.
        </p>
        <p>
          If you email us or submit a deal, we receive the details you choose to send (such as your email
          address and the deal information) and use them only to reply and to review the submission.
        </p>
        <p>
          When you tap a deal link you leave this site and go to the brand&apos;s official website; that
          site&apos;s own privacy policy applies there. This site may show ads from third-party networks,
          which can use cookies to measure and personalise ads — you can block cookies in your browser settings.
        </p>
        <p>
          We do not sell personal data. Questions about privacy: startup@primekhatab.in.
        </p>
      </div>
    </div>
  );
}
