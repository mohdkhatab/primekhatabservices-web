import {ArrowLeft} from 'lucide-react';
import {STUDIO_CONTACT} from '../data/studioData';

interface LegalPageProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function TermsPage({onNavigate}: LegalPageProps) {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
            Plain-language terms governing website use and client project engagements with{' '}
            {STUDIO_CONTACT.name}.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-[15px] text-[#C6CEDA] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              1. Studio &amp; Services
            </h2>
            <p>
              {STUDIO_CONTACT.name} is an independent technology services studio founded and operated
              by {STUDIO_CONTACT.founder} in {STUDIO_CONTACT.fullAddress}. We provide App
              Development, Web Development, AI Integration &amp; AI Agents, API Development, AI
              Dubbing &amp; Voice Solutions, and Media Tech services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              2. Project Scope &amp; Agreements
            </h2>
            <p>
              Submitting an enquiry through this website or by email does not create a binding
              service contract. Every project begins only after both parties agree in writing on the
              project scope, deliverables, timeline, and fee structure. Changes to scope during an
              active build are discussed and confirmed in writing before additional work proceeds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              3. Ownership of Deliverables
            </h2>
            <p>
              Upon full payment of agreed project fees, the client receives complete ownership of
              custom source code, application builds, documentation, and localized media assets
              created specifically for that engagement. Open-source libraries, third-party APIs, and
              general-purpose studio utilities remain subject to their respective licenses or prior
              ownership.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              4. Payment Terms
            </h2>
            <p>
              Fees, milestone schedules, and payment methods are set by written agreement prior to
              work starting. Typically, engagements are structured around an initial deposit and
              milestone or completion payments as deliverables are reviewed and accepted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              5. Third-Party Services &amp; AI Outputs
            </h2>
            <p>
              Where projects integrate third-party cloud platforms, APIs, app stores, or AI model
              providers, use of those external services remains governed by the respective
              provider&apos;s terms and billing accounts. Clients are responsible for maintaining
              their own third-party API keys and hosting accounts unless otherwise agreed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-cream">
              6. Website Use &amp; Liability
            </h2>
            <p>
              Information on this website is provided in good faith to describe the services offered
              by {STUDIO_CONTACT.name}. To the fullest extent permitted by applicable law,{' '}
              {STUDIO_CONTACT.name} is not liable for indirect or consequential damages arising from
              the use of this website.
            </p>
          </section>

          <section className="pt-6 border-t border-line space-y-2 text-sm text-muted">
            <p className="font-medium text-cream">{STUDIO_CONTACT.name}</p>
            <p>Founder: {STUDIO_CONTACT.founder}</p>
            <p>Address: {STUDIO_CONTACT.fullAddress}</p>
            <p>
              Questions about these terms:{' '}
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
