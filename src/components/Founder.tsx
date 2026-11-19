import {ArrowUpRight, Braces, Mic2, Smartphone, Workflow} from 'lucide-react';
import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

const FOUNDER_DOES = [
  {
    icon: Smartphone,
    title: 'Ships the apps himself',
    text: 'Native Android in Kotlin & Jetpack Compose and React/TypeScript on the web — architecture, code, release packaging and Play Store readiness, all hands-on.',
  },
  {
    icon: Workflow,
    title: 'Builds AI that does real work',
    text: 'AI agents and integrations wired into actual operations: tool-calling workflows, grounded retrieval, automation pipelines with human approval where it matters.',
  },
  {
    icon: Mic2,
    title: 'Runs a full dubbing pipeline',
    text: 'End-to-end Hindi dubbing for donghua, anime and short dramas — transcription, script adaptation, character-wise voice casting, timing sync and final mix.',
  },
  {
    icon: Braces,
    title: 'Owns the boring parts too',
    text: 'APIs, authentication, webhooks, deployments and documentation. The unglamorous engineering that decides whether software survives production.',
  },
] as const;

export function Founder() {
  return (
    <section id="founder" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl overflow-hidden border border-line bg-panel shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)]">
              <div className="relative min-h-[300px] sm:min-h-[400px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.founderPortrait.src}
                  alt={STUDIO_IMAGES.founderPortrait.alt}
                  fallbackLabel="Mohd Khatab — Founder"
                  aspectClassName="h-full w-full"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="px-5 py-4 bg-panel border-t border-line flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full bg-accent text-[#1A1206] font-display font-bold text-xs flex items-center justify-center shrink-0"
                  >
                    MK
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-cream leading-tight">Mohd Khatab</p>
                    <p className="text-xs text-faint leading-tight">
                      Founder &amp; Lead Engineer
                    </p>
                  </div>
                </div>
                <span className="text-xs text-faint text-right shrink-0">
                  Rajouri, J&amp;K
                  <br />
                  185132, India
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="section-label mb-3">About the founder</p>
            <h2
              className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream mb-7"
              style={{textWrap: 'balance'}}
            >
              Meet Mohd Khatab — the person who will actually build your product.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
              <p>
                Mohd Khatab is an AI developer from Rajouri, a mountain town in Jammu &amp;
                Kashmir, and the founder of Prime Khatab Services. In October 2026 he turned
                years of building software, AI systems and media tooling into a studio with one
                simple promise: <span className="text-cream font-medium">when you hire this
                studio, you work directly with the engineer — start to finish.</span>
              </p>
              <p>
                His work sits at an unusual intersection. On one side, production software:
                Android streaming apps used daily, custom APIs, and AI agents that plug into
                real business workflows. On the other, media technology: a complete Hindi
                dubbing operation that takes donghua, anime and short-drama episodes from raw
                foreign audio to polished Hindi releases — script, voices, timing and mix —
                on a daily publishing schedule.
              </p>
              <p>
                That combination is the studio's edge. The dubbing pipeline demands the same
                things great client software does: automation that does not break, quality
                checks that actually catch defects, and shipping on schedule, every day. It is
                also why the studio takes AI seriously as engineering — not demos, but systems
                that run in production.
              </p>
              <p>
                Prime Khatab Services is bootstrapped and self-funded, and deliberately stays
                small. Every engagement is scoped, built and delivered by Mohd himself, with
                clear milestones, weekly working builds and full source ownership handed over
                at the end.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FOUNDER_DOES.map((item) => (
                <div
                  key={item.title}
                  className="bg-panel border border-line rounded-xl p-5 transition-colors duration-200 hover:border-accent/50"
                >
                  <item.icon className="w-5 h-5 text-accent mb-3" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-cream mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-7 border-t border-line flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href={STUDIO_CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-cream hover:text-accent transition-colors duration-150 underline underline-offset-4 decoration-line hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <span>GitHub (@mohdkhatab)</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={STUDIO_CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-cream hover:text-accent transition-colors duration-150 underline underline-offset-4 decoration-line hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={STUDIO_CONTACT.mailtoHref}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-accent hover:text-accent2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <span>{STUDIO_CONTACT.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
