import {PROCESS_STEPS} from '../data/studioData';

export function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-ink2 border-y border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <p className="section-label mb-3">Process</p>
          <h2
            className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream mb-4"
            style={{textWrap: 'balance'}}
          >
            From brief to production, without the agency theatre.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Clear milestones, weekly testable builds, and a clean handover. You always know what
            is done, what is next, and what it will look like.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="group pt-6 border-t-2 border-line transition-colors duration-200 hover:border-accent"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-mono tabular-nums text-sm font-medium text-accent">
                  {item.step}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-faint">
                  {item.duration}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-cream mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
