import {useState} from 'react';
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
    <section id="services" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">Services</p>
            <h2
              className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#0F1419]"
              style={{textWrap: 'balance'}}
            >
              Six focused services, from mobile builds to AI dubbing and media tech.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter services by discipline"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAECEF] rounded-lg self-start md:self-auto"
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
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    isSelected
                      ? 'bg-white text-[#0F1419] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#0F1419]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service) => (
            <article
              key={service.index}
              className="bg-white border border-[#E3E7EE] rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors duration-150 hover:border-[#C5CDD8]"
            >
              <div>
                <div className="flex items-center justify-between gap-4 text-xs text-[#6B7280] mb-4">
                  <span className="font-mono tabular-nums font-medium text-[#0F1419]">
                    {service.index}
                  </span>
                  <span>{service.categoryLabel}</span>
                </div>

                <h3 className="font-display text-xl font-semibold tracking-tight text-[#0F1419] mb-3">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-[15px] text-[#4B5563] leading-relaxed mb-6">
                  {service.summary}
                </p>
              </div>

              <div className="pt-5 border-t border-[#EEF1F5]">
                <p className="text-xs font-semibold text-[#0F1419] mb-3">What you get</p>
                <ul className="space-y-2.5 text-sm text-[#1F2937]">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[9px] w-2.5 h-[1.5px] bg-[#9CA3AF] shrink-0"
                      />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
