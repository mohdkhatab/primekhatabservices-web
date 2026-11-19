import {ArrowUpRight, MapPin} from 'lucide-react';
import {motion} from 'motion/react';
import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

const HERO_STATS = [
  {value: 'Oct 2026', label: 'Operating since'},
  {value: '06', label: 'Service lines, one studio'},
  {value: '100%', label: 'Founder-led delivery'},
  {value: '24 hrs', label: 'Direct reply window'},
] as const;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden hero-glow">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-7"
          >
            <p className="section-label mb-6 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Rajouri · Jammu &amp; Kashmir · India</span>
            </p>

            <h1
              className="font-display font-semibold tracking-tight text-cream leading-[1.04] mb-7"
              style={{fontSize: 'clamp(2.6rem, 5vw, 4.3rem)', textWrap: 'balance'}}
            >
              Apps, websites, AI agents &amp; dubbed worlds —{' '}
              <span className="text-accent">built to ship.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mb-10">
              Prime Khatab Services is a founder-led, bootstrapped engineering studio. We design
              and build dependable Android apps, fast websites, custom APIs and AI agents — and we
              run a complete AI dubbing pipeline that turns donghua, anime and short dramas into
              natural Hindi releases. One studio, one accountable founder, no agency layers.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={STUDIO_CONTACT.mailtoHref}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 text-sm font-semibold text-[#1A1206] bg-accent hover:bg-accent2 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span>Start a project</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm font-medium text-cream border border-line bg-panel hover:border-accent/70 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Explore services
              </a>

              <span className="text-xs sm:text-sm text-faint sm:ml-2 font-mono">
                {STUDIO_CONTACT.email}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl overflow-hidden border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              <div className="relative min-h-[260px] lg:min-h-[360px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.heroDesk.src}
                  alt={STUDIO_IMAGES.heroDesk.alt}
                  fallbackLabel="Prime Khatab Services Studio"
                  aspectClassName="h-full w-full"
                  loading="eager"
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="px-5 py-4 border-t border-line bg-panel flex items-center justify-between gap-4 text-xs">
                <span className="text-muted">
                  <span className="text-cream font-medium">The studio desk</span> — code, waveforms
                  &amp; the Pir Panjal skyline
                </span>
                <span className="font-mono tabular-nums text-faint shrink-0">IST · UTC+5:30</span>
              </div>
            </div>
          </motion.div>
        </div>

        <dl className="mt-16 pt-8 border-t border-line grid grid-cols-2 lg:grid-cols-4 gap-8">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl sm:text-3xl font-semibold text-cream mb-1">
                {stat.value}
              </dd>
              <dd className="text-xs sm:text-sm text-faint">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
