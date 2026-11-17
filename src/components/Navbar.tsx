import {useState} from 'react';
import {Menu, X} from 'lucide-react';

const NAV_LINKS = [
  {label: 'Services', href: '#services'},
  {label: 'Work', href: '#work'},
  {label: 'Process', href: '#process'},
  {label: 'Founder', href: '#founder'},
  {label: 'FAQ', href: '#faq'},
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8FA]/95 backdrop-blur-sm border-b border-[#E3E7EE]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark only */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#0F1419] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm"
        >
          Prime Khatab Services
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#0F1419] transition-colors duration-150 underline-offset-4 hover:underline decoration-[#1D4ED8]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + accessible mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#0F1419] hover:bg-[#1D4ED8] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            Start a project
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-[#0F1419] hover:bg-[#EAECEF] rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="md:hidden border-t border-[#E3E7EE] bg-[#F7F8FA] px-5 py-4"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-[#1F2937] hover:text-[#1D4ED8] border-b border-[#E8ECF2] last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm font-medium text-white bg-[#0F1419] hover:bg-[#1D4ED8] rounded-lg transition-colors duration-150"
            >
              Start a project
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
