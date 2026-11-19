import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

const STUDIO_FACTS = [
  {label: 'Operating since', value: 'October 2026'},
  {label: 'Structure', value: 'Bootstrapped & self-funded'},
  {label: 'Studio base', value: 'Rajouri, J&K 185132'},
  {label: 'Working model', value: 'Direct with the founder'},
] as const;

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-ink2 border-y border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <p className="section-label mb-3">About the studio</p>
            <h2
              className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream mb-7"
              style={{textWrap: 'balance'}}
            >
              A small studio from the Pir Panjal foothills, shipping software worldwide.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
              <p>
                Prime Khatab Services was founded in October 2026 in{' '}
                {STUDIO_CONTACT.fullAddress} — fully bootstrapped and self-funded, with no
                investors, no sales team, and no account managers. The person who scopes your
                project is the person who builds it.
              </p>
              <p>
                The studio exists because of a simple gap: small businesses and startups need
                serious engineering — a reliable Android app, a fast website, an AI agent that
                actually does work, an API that never breaks — but a full in-house team is out of
                reach or moves too slowly. We close that gap with direct, senior-level execution
                at a founder-run studio's cost.
              </p>
              <p>
                Alongside client software, the studio runs its own media-technology practice:
                complete Hindi dubbing pipelines for donghua, anime and short dramas, streaming
                app engineering, and the automation tooling behind daily episode releases. That
                production discipline — deadlines, quality checks, shipping every single day —
                shapes how every client project is run too.
              </p>
            </div>

            <dl className="mt-10 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {STUDIO_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] tracking-[0.16em] uppercase text-faint mb-1.5">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-base font-semibold text-cream">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-line bg-panel shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)]">
              <div className="relative min-h-[280px] lg:min-h-[380px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.mediaDubbing.src}
                  alt={STUDIO_IMAGES.mediaDubbing.alt}
                  fallbackLabel="Prime Khatab Services — Dubbing Studio"
                  aspectClassName="h-full w-full"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="px-5 py-4 border-t border-line bg-panel flex items-center justify-between gap-4 text-xs">
                <span className="text-muted">
                  <span className="text-cream font-medium">Inside the dubbing studio</span> —
                  where episodes get their Hindi voices
                </span>
                <span className="text-faint shrink-0 hidden sm:inline">
                  {STUDIO_CONTACT.shortLocation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
