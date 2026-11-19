import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {SERVICES, type ServiceCategory} from '../data/studioData';

const FILTER_TABS: {id: ServiceCategory; label: string}[] = [
  {id: 'all', label: 'All services'},
  {id: 'apps-web', label: 'Apps & Web'},
  {id: 'ai-apis', label: 'AI & APIs'},
  {id: 'media-voice', label: 'Media & Voice'},
];

export function Services() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const visibleServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="section-label mb-3">Services</p>
            <h2
              className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream"
              style={{textWrap: 'balance'}}
            >
              Six focused services. Deep work, not a bloated menu.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter services by discipline"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-panel border border-line rounded-lg self-start md:self-auto"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isSelected
                      ? 'bg-accent text-[#1A1206] font-semibold'
                      : 'text-muted hover:text-cream'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleServices.map((service) => (
            <article
              key={service.index}
              className="group bg-panel border border-line rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-accent/60 hover:bg-panel2 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="font-mono tabular-nums text-sm font-medium text-accent">
                    {service.index}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
                    {service.categoryLabel}
                  </span>
                </div>

                <h3 className="font-display text-[1.35rem] leading-snug font-semibold tracking-tight text-cream mb-3">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-7">
                  {service.summary}
                </p>
              </div>

              <div className="pt-5 border-t border-line/70">
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-faint mb-3.5">
                  What you get
                </p>
                <ul className="space-y-2.5 text-sm text-cream/85">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[9px] w-2.5 h-[2px] bg-accent shrink-0"
                      />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted flex flex-wrap items-center gap-2">
          <span>Not sure which service fits?</span>
          <a
            href="#contact"
            className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent2 transition-colors"
          >
            <span>Describe your project and get a straight answer</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
