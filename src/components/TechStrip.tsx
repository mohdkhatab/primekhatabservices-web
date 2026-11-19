import {CAPABILITY_STACK} from '../data/studioData';

export function TechStrip() {
  return (
    <section
      aria-label="Core technologies and engineering stack"
      className="border-y border-line bg-ink2"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-9">
          {CAPABILITY_STACK.map((entry) => (
            <div key={entry.group} className="space-y-2">
              <h2 className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-accent">
                {entry.group}
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{entry.items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
