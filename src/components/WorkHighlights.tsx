import {WORK_HIGHLIGHTS} from '../data/studioData';

export function WorkHighlights() {
  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="section-label mb-3">Work</p>
            <h2
              className="font-display text-3xl sm:text-[2.2rem] leading-[1.15] font-semibold tracking-tight text-cream mb-4"
              style={{textWrap: 'balance'}}
            >
              What we build across mobile, AI and media.
            </h2>
            <p className="text-sm sm:text-[15px] text-muted leading-relaxed">
              The studio's work spans production Android apps, AI systems that run real
              operations, and a dubbing pipeline that ships dubbed episodes on a daily schedule.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-line border-t border-b border-line">
            {WORK_HIGHLIGHTS.map((item) => (
              <article
                key={item.index}
                className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline px-3 -mx-3 rounded-lg transition-colors duration-150 hover:bg-panel"
              >
                <div className="sm:col-span-5 flex items-baseline gap-3">
                  <span className="font-mono text-xs tabular-nums text-accent shrink-0">
                    {item.index}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-cream">
                    {item.category}
                  </h3>
                </div>
                <div className="sm:col-span-7 space-y-1">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
                    {item.scope}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
