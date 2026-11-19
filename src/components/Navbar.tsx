import {useState} from 'react';
import {Menu, X} from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string, hash?: string) => void;
}

const NAV_LINKS = [
  {label: 'Services', hash: '#services'},
  {label: 'About', hash: '#about'},
  {label: 'Projects', hash: '#work'},
  {label: 'Process', hash: '#process'},
  {label: 'Founder', hash: '#founder'},
  {label: 'FAQ', hash: '#faq'},
] as const;

export function Navbar({onNavigate}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    hash?: string
  ) => {
    event.preventDefault();
    setMobileOpen(false);
    onNavigate(path, hash);
  };

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="/"
          onClick={(event) => handleLinkClick(event, '/', '#top')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-md bg-accent text-[#1A1206] font-display font-bold text-sm flex items-center justify-center"
          >
            PK
          </span>
          <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-cream">
            Prime Khatab Services
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-muted"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.hash}
              href={`/${item.hash}`}
              onClick={(event) => handleLinkClick(event, '/', item.hash)}
              className="whitespace-nowrap shrink-0 py-1 hover:text-cream transition-colors duration-150 underline-offset-4 hover:underline decoration-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/#contact"
            onClick={(event) => handleLinkClick(event, '/', '#contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#1A1206] bg-accent hover:bg-accent2 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Start a project
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-cream hover:bg-panel rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="md:hidden border-t border-line bg-ink px-5 py-4"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.hash}
                href={`/${item.hash}`}
                onClick={(event) => handleLinkClick(event, '/', item.hash)}
                className="min-h-[44px] flex items-center text-sm font-medium text-cream/90 hover:text-accent border-b border-line/60 last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={(event) => handleLinkClick(event, '/', '#contact')}
              className="mt-3 inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#1A1206] bg-accent hover:bg-accent2 rounded-lg transition-colors duration-150"
            >
              Start a project
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
