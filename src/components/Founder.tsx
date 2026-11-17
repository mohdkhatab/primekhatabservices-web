import {ArrowUpRight} from 'lucide-react';
import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

export function Founder() {
  return (
    <section id="founder" className="py-16 sm:py-24 bg-white border-y border-[#E3E7EE]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full rounded-xl overflow-hidden border border-[#DCE1E8] bg-[#F7F8FA] flex flex-col">
              <div className="relative flex-1 min-h-[320px] sm:min-h-[380px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.founderPortrait.src}
                  alt={STUDIO_IMAGES.founderPortrait.alt}
                  fallbackLabel="Mohd Khatab — Founder"
                  aspectClassName="aspect-[3/4] h-full w-full"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="px-5 py-3.5 bg-white border-t border-[#E6EAF0] flex items-center justify-between gap-4 text-xs text-[#4B5563]">
                <span className="font-medium text-[#0F1419]">Mohd Khatab</span>
                <span>Rajouri, Jammu &amp; Kashmir</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">About the Founder</p>
            <h2
              className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#0F1419] mb-6"
              style={{textWrap: 'balance'}}
            >
              Built and led directly by Mohd Khatab from Rajouri, Jammu &amp; Kashmir.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#374151] leading-relaxed max-w-2xl">
              <p>
                Prime Khatab Services is a focused studio where you work directly with the person
                architecting and shipping your product. Over the past several years, Mohd Khatab has
                built Android applications, full-stack web software, developer utilities, and
                automated API backends for independent creators and growing teams.
              </p>
              <p>
                Alongside traditional software engineering, the studio maintains deep hands-on
                experience in media technology—producing Hindi-dubbed donghua, anime, and
                short-drama localization pipelines powered by practical voice AI and clean audio
                workflows.
              </p>
              <p>
                Operating out of Rajouri in Jammu &amp; Kashmir, India, the studio keeps overhead
                low and engineering standards high: clear communication, realistic timelines, and
                software that holds up after launch day.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6EAF0] flex flex-wrap items-center gap-6">
              <a
                href={STUDIO_CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-[#0F1419] hover:text-[#1D4ED8] transition-colors duration-150 underline underline-offset-4 decoration-[#D4DAE3] hover:decoration-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm"
              >
                <span>GitHub (@mohdkhatab)</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={STUDIO_CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-[#0F1419] hover:text-[#1D4ED8] transition-colors duration-150 underline underline-offset-4 decoration-[#D4DAE3] hover:decoration-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={STUDIO_CONTACT.mailtoHref}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-[#1D4ED8] hover:text-[#1E40AF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm"
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
