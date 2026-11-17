import {CAPABILITY_STACK} from '../data/studioData';

export function TechStrip() {
  return (
    <section
      aria-label="Core technologies and engineering stack"
      className="border-y border-[#E3E7EE] bg-white"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CAPABILITY_STACK.map((entry) => (
            <div key={entry.group} className="space-y-1.5">
              <h2 className="text-xs font-semibold tracking-wide text-[#0F1419]">
                {entry.group}
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {entry.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
