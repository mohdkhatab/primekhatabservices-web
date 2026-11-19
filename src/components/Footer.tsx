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

  const homeLinks = [
    {label: 'Services', hash: '#services'},
    {label: 'About', hash: '#about'},
    {label: 'Projects', hash: '#work'},
    {label: 'Process', hash: '#process'},
    {label: 'Founder', hash: '#founder'},
    {label: 'FAQ', hash: '#faq'},
    {label: 'Contact', hash: '#contact'},
  ] as const;

  return (
    <footer className="bg-ink2 border-t border-line pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10 border-b border-line">
          <div className="max-w-sm">
            <p className="flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-md bg-accent text-[#1A1206] font-display font-bold text-sm flex items-center justify-center"
              >
                PK
              </span>
              <span className="font-display text-lg font-semibold text-cream">
                {STUDIO_CONTACT.name}
              </span>
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Founder-led software, AI and media studio. Founded by {STUDIO_CONTACT.founder} ·{' '}
              {STUDIO_CONTACT.fullAddress}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted"
          >
            {homeLinks.map((link) => (
              <a
                key={link.hash}
                href={`/${link.hash}`}
                onClick={(e) => handleHomeLink(e, link.hash)}
                className="hover:text-cream transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/privacy"
              onClick={(e) => handleLegalLink(e, '/privacy')}
              className="hover:text-cream transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleLegalLink(e, '/terms')}
              className="hover:text-cream transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-faint">
          <p>© 2026 Prime Khatab Services. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href={STUDIO_CONTACT.mailtoHref}
              className="hover:text-cream transition-colors"
            >
              {STUDIO_CONTACT.email}
            </a>
            <a
              href={STUDIO_CONTACT.phoneHref}
              className="hover:text-cream transition-colors"
            >
              {STUDIO_CONTACT.phone}
            </a>
            <a
              href={STUDIO_CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              GitHub
            </a>
            <a
              href={STUDIO_CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={STUDIO_CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Instagram
            </a>
            <a
              href={STUDIO_CONTACT.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
