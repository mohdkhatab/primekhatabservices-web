import {ArrowUpRight, Rocket} from 'lucide-react';
import {FEATURED_PROJECT, PROJECTS, type ProjectItem} from '../data/studioData';

const TONE_CLASSES: Record<ProjectItem['statusTone'], string> = {
  live: 'text-emerald-300 border-emerald-300/30 bg-emerald-300/10',
  open: 'text-sky-300 border-sky-300/30 bg-sky-300/10',
  soon: 'text-accent border-accent/40 bg-accent/10',
};

function StatusBadge({project}: {project: ProjectItem}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border font-mono text-[10px] tracking-[0.12em] uppercase ${TONE_CLASSES[project.statusTone]}`}
    >
      {project.status}
    </span>
  );
}

export function WorkHighlights() {
  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12">
          <p className="section-label mb-3">Projects</p>
          <h2
            className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream mb-4"
            style={{textWrap: 'balance'}}
          >
            Built here, running in the real world.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Products and open-source work from the studio — from a dubbing pipeline that ships
            episodes daily to agents, gateways and games. Source lives on{' '}
            <a
              href="https://github.com/mohdkhatab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent2 underline underline-offset-4 decoration-accent/40"
            >
              GitHub (@mohdkhatab)
            </a>
            .
          </p>
        </div>

        {/* Featured upcoming flagship */}
        <article className="relative overflow-hidden rounded-2xl border border-accent/40 bg-panel p-7 sm:p-10 mb-6 hero-glow">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <Rocket className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                Next launch
              </span>
            </span>
            <StatusBadge project={FEATURED_PROJECT} />
          </div>
          <h3 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-cream mb-4">
            {FEATURED_PROJECT.name}
          </h3>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl mb-5">
            {FEATURED_PROJECT.summary}
          </p>
          <p className="font-mono text-xs text-faint">{FEATURED_PROJECT.stack}</p>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project) => (
            <article
              key={project.name}
              className="group bg-panel border border-line rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-accent/50 hover:bg-panel2 hover:-translate-y-0.5"
            >
              <div>
                <div className="mb-4">
                  <StatusBadge project={project} />
                </div>
                <h3 className="font-display text-lg leading-snug font-semibold tracking-tight text-cream mb-2.5">
                  {project.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6">{project.summary}</p>
              </div>
              <div className="pt-4 border-t border-line/70 flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-faint leading-snug">
                  {project.stack}
                </span>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} on GitHub`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent2 shrink-0 transition-colors"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
