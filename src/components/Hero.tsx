import {ArrowUpRight} from 'lucide-react';
import {motion} from 'motion/react';
import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

export function Hero() {
  return (
    <section id="top" className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-medium text-[#4B5563] mb-5">
                <span>Prime Khatab Services</span>
                <span aria-hidden="true" className="mx-2 text-[#9CA3AF]">·</span>
                <span>Rajouri, Jammu &amp; Kashmir</span>
                <span aria-hidden="true" className="mx-2 text-[#9CA3AF]">·</span>
                <span>Operating since October 2026</span>
              </p>

              <h1
                className="font-display font-semibold tracking-tight text-[#0F1419] leading-[1.08] mb-6"
                style={{
                  fontSize: 'clamp(2.25rem, 4.2vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                Apps, web software, AI agents, and voice dubbing built to ship.
              </h1>

              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mb-8">
                A bootstrapped and self-funded engineering studio led by founder Mohd Khatab.
                Operating since October 2026, Prime Khatab Services helps small businesses and
                startups ship dependable Android apps, web platforms, AI agents, custom APIs, and
                AI dubbing systems without full in-house team overhead.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={STUDIO_CONTACT.mailtoHref}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
              >
                <span>Start a project</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 text-sm font-medium text-[#0F1419] border border-[#D4DAE3] bg-white hover:border-[#0F1419] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                Explore services
              </a>

              <span className="text-xs sm:text-sm text-[#6B7280] sm:ml-2">
                {STUDIO_CONTACT.email}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="h-full rounded-xl overflow-hidden border border-[#DCE1E8] bg-white flex flex-col">
              <div className="relative flex-1 min-h-[240px] lg:min-h-[340px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.heroDesk.src}
                  alt={STUDIO_IMAGES.heroDesk.alt}
                  fallbackLabel="Prime Khatab Services Studio"
                  aspectClassName="h-full w-full"
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-3 border-t border-[#E6EAF0] bg-white flex items-center justify-between gap-4 text-xs text-[#4B5563]">
                <span>Software, APIs &amp; Voice Production</span>
                <span className="font-mono tabular-nums text-[#6B7280]">IST · UTC+5:30</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
