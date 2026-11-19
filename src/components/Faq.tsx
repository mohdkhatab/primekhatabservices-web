import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {FAQ_ITEMS} from '../data/studioData';

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-ink2 border-y border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="section-label mb-3">FAQ</p>
            <h2
              className="font-display text-3xl sm:text-[2.2rem] leading-[1.15] font-semibold tracking-tight text-cream mb-4"
              style={{textWrap: 'balance'}}
            >
              Common questions before starting.
            </h2>
            <p className="text-sm sm:text-[15px] text-muted leading-relaxed">
              Practical details on timelines, source-code ownership, voice AI workflows, and how
              the studio collaborates across time zones.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-line border-t border-b border-line">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div key={item.id} className="py-1">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full min-h-[56px] py-4 flex items-center justify-between gap-4 text-left text-base font-medium text-cream hover:text-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    >
                      <span className="font-display font-semibold">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-faint shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-accent' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="pb-5 pr-8 text-sm sm:text-[15px] text-muted leading-relaxed"
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
