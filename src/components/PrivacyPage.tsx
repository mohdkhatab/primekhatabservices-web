import {ArrowLeft} from 'lucide-react';
import {STUDIO_CONTACT} from '../data/studioData';

interface LegalPageProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function PrivacyPage({onNavigate}: LegalPageProps) {
  return (
    <article className="py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('/');
          }}
          className="inline-flex items-center gap-2 min-h-[40px] text-sm font-medium text-accent hover:text-accent2 mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Prime Khatab Services</span>
        </a>

        <header className="pb-8 border-b border-line mb-10">
          <p className="text-xs font-medium text-faint mb-2">
            <span>Legal</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Effective October 2026</span>
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-cream">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
            How {STUDIO_CONTACT.name}, operated by founder {STUDIO_CONTACT.founder}, handles
            information submitted through this website.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-[15px] text-[#C6CEDA] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              1. Who We Are
            </h2>
            <p>
              {STUDIO_CONTACT.name} is a founder-led software, AI, and media engineering studio
              operated by {STUDIO_CONTACT.founder} and located at {STUDIO_CONTACT.fullAddress}. You
              can reach us directly at{' '}
              <a
                href={STUDIO_CONTACT.mailtoHref}
                className="text-accent hover:underline font-medium"
              >
                {STUDIO_CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              2. Information the Contact Form Collects
            </h2>
            <p>
              When you use the project enquiry form on this website, you provide your name, your
              email address, your selected service area, and your project summary or message. The
              form formats that information locally in your browser so you can send it directly to{' '}
              {STUDIO_CONTACT.email} via your email client or copy it to your clipboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              3. How We Use Your Information
            </h2>
            <p>
              Information you send to {STUDIO_CONTACT.email} is used strictly to reply to your
              enquiry, clarify project requirements, prepare scope or timeline proposals, and
              communicate with you regarding requested services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              4. No Selling or Sharing of Personal Data
            </h2>
            <p>
              {STUDIO_CONTACT.name} does not sell, rent, trade, or distribute your personal
              information or project details to third-party advertisers, brokers, or marketing lists.
              Information is shared only if strictly required to comply with applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              5. Cookies and Analytics
            </h2>
            <p>
              This website does not set advertising cookies, cross-site tracking scripts, or
              behavioral analytics profiles. Standard hosting infrastructure may record basic,
              short-lived technical request logs (such as IP address, browser user agent, and
              timestamp) solely for security, uptime, and error diagnostics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              6. Data Retention and Deletion Requests
            </h2>
            <p>
              Email correspondence is retained only for as long as needed to handle your enquiry or
              maintain active project records. You may request access to, correction of, or deletion
              of your email correspondence at any time by writing to{' '}
              <a
                href={`mailto:${STUDIO_CONTACT.email}?subject=Privacy%20Request`}
                className="text-accent hover:underline font-medium"
              >
                {STUDIO_CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section className="pt-6 border-t border-line space-y-2 text-sm text-muted">
            <p className="font-medium text-cream">{STUDIO_CONTACT.name}</p>
            <p>Founder: {STUDIO_CONTACT.founder}</p>
            <p>Address: {STUDIO_CONTACT.fullAddress}</p>
            <p>
              Email:{' '}
              <a href={STUDIO_CONTACT.mailtoHref} className="text-accent hover:underline">
                {STUDIO_CONTACT.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
