import {STUDIO_CONTACT, STUDIO_IMAGES} from '../data/studioData';
import {ImageWithFallback} from './ImageWithFallback';

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-y border-[#E3E7EE]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">About the Studio</p>
            <h2
              className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#0F1419] mb-6"
              style={{textWrap: 'balance'}}
            >
              A founder-led, bootstrapped engineering studio built for shipping real software.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#374151] leading-relaxed max-w-2xl">
              <p>
                Prime Khatab Services is a founder-led startup operating since October 2026 in{' '}
                {STUDIO_CONTACT.fullAddress}. Founded by Mohd Khatab, the studio is fully
                bootstrapped and self-funded, focused on direct execution rather than layers of
                account management.
              </p>
              <p>
                We exist to solve a straightforward problem: small businesses and startups often
                struggle to get reliable, affordable mobile apps, websites, and AI solutions built
                and shipped because hiring a full in-house engineering team is out of reach or
                moves too slowly.
              </p>
              <p>
                Prime Khatab Services serves businesses and startups that need dependable mobile
                apps, websites, custom APIs, AI integrations and AI agents, AI dubbing and voice
                solutions, and media technology. Every client works directly with founder Mohd
                Khatab from initial scoping through weekly working builds and final source handover.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E3E7EE] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Operating Since</p>
                <p className="font-display text-base font-semibold text-[#0F1419]">
                  October 2026
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Structure</p>
                <p className="font-display text-base font-semibold text-[#0F1419]">
                  Bootstrapped &amp; self-funded
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Studio Base</p>
                <p className="font-display text-base font-semibold text-[#0F1419]">
                  Rajouri, J&amp;K 185132
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full rounded-xl overflow-hidden border border-[#DCE1E8] bg-white flex flex-col">
              <div className="relative flex-1 min-h-[260px] lg:min-h-[340px]">
                <ImageWithFallback
                  src={STUDIO_IMAGES.mediaDubbing.src}
                  alt={STUDIO_IMAGES.mediaDubbing.alt}
                  fallbackLabel="Prime Khatab Services — Software & Media Studio"
                  aspectClassName="aspect-[4/3] h-full w-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-5 py-3.5 border-t border-[#E6EAF0] bg-white flex items-center justify-between gap-4 text-xs text-[#4B5563]">
                <span className="font-medium text-[#0F1419]">Software, AI &amp; Media Engineering</span>
                <span>{STUDIO_CONTACT.shortLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
