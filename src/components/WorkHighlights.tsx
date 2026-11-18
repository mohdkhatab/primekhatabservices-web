import {WORK_HIGHLIGHTS} from '../data/studioData';

export function WorkHighlights() {
  return (
    <section id="work" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">Work</p>
            <h2
              className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F1419] mb-4"
              style={{textWrap: 'balance'}}
            >
              What we build across mobile, AI, and media.
            </h2>
            <p className="text-sm sm:text-[15px] text-[#4B5563] leading-relaxed">
              Our work is organized around the core software systems and media production
              pipelines delivered through Prime Khatab Services.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-[#DCE1E8] border-t border-b border-[#DCE1E8]">
            {WORK_HIGHLIGHTS.map((item) => (
              <article
                key={item.index}
                className="py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-5 flex items-baseline gap-3">
                  <span className="font-mono text-xs tabular-nums text-[#6B7280] shrink-0">
                    {item.index}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-[#0F1419]">
                    {item.category}
                  </h3>
                </div>
                <div className="sm:col-span-7 space-y-1">
                  <p className="text-xs font-medium text-[#6B7280]">{item.scope}</p>
                  <p className="text-sm text-[#374151] leading-relaxed">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
