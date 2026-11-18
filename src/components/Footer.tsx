import {STUDIO_CONTACT} from '../data/studioData';

interface FooterProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function Footer({onNavigate}: FooterProps) {
  const handleHomeLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    event.preventDefault();
    onNavigate('/', hash);
  };

  const handleLegalLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    event.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-white border-t border-[#E3E7EE] py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[#E3E7EE]">
          <div>
            <p className="font-display text-base font-semibold text-[#0F1419]">
              {STUDIO_CONTACT.name}
            </p>
            <p className="text-sm text-[#4B5563] mt-1">
              Founded by {STUDIO_CONTACT.founder} · {STUDIO_CONTACT.fullAddress}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-sm text-[#4B5563]">
            <a
              href="/#services"
              onClick={(e) => handleHomeLink(e, '#services')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Services
            </a>
            <a
              href="/#about"
              onClick={(e) => handleHomeLink(e, '#about')}
              className="hover:text-[#0F1419] transition-colors"
            >
              About
            </a>
            <a
              href="/#work"
              onClick={(e) => handleHomeLink(e, '#work')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Work
            </a>
            <a
              href="/#process"
              onClick={(e) => handleHomeLink(e, '#process')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Process
            </a>
            <a
              href="/#founder"
              onClick={(e) => handleHomeLink(e, '#founder')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Founder
            </a>
            <a
              href="/#faq"
              onClick={(e) => handleHomeLink(e, '#faq')}
              className="hover:text-[#0F1419] transition-colors"
            >
              FAQ
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleHomeLink(e, '#contact')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Contact
            </a>
            <a
              href="/privacy"
              onClick={(e) => handleLegalLink(e, '/privacy')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLegalLink(e, '/terms')}
              className="hover:text-[#0F1419] transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© 2026 Prime Khatab Services. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href={STUDIO_CONTACT.mailtoHref}
              className="hover:text-[#0F1419] transition-colors"
            >
              {STUDIO_CONTACT.email}
            </a>
            <a
              href={STUDIO_CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0F1419] transition-colors"
            >
              GitHub
            </a>
            <a
              href={STUDIO_CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0F1419] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
