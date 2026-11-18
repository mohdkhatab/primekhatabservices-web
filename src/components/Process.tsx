import {PROCESS_STEPS} from '../data/studioData';

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-24 bg-white border-y border-[#E3E7EE]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">Process</p>
          <h2
            className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#0F1419] mb-4"
            style={{textWrap: 'balance'}}
          >
            Straightforward engineering from brief to production handover.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            Every project stays direct and transparent—clear milestones, weekly testable builds,
            and clean handoff documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="pt-6 border-t border-[#D4DAE3]">
              <div className="flex items-center justify-between gap-4 text-xs mb-3">
                <span className="font-mono tabular-nums font-medium text-[#0F1419]">
                  {item.step}
                </span>
                <span className="text-[#6B7280]">{item.duration}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0F1419] mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
