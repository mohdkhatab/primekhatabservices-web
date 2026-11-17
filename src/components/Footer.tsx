import {STUDIO_CONTACT} from '../data/studioData';

export function Footer() {
  return (
    <footer className="bg-[#F7F8FA] border-t border-[#E3E7EE] py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[#E3E7EE]">
          <div>
            <p className="font-display text-base font-semibold text-[#0F1419]">
              {STUDIO_CONTACT.name}
            </p>
            <p className="text-sm text-[#4B5563] mt-1">
              Founded by {STUDIO_CONTACT.founder} · {STUDIO_CONTACT.location}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-sm text-[#4B5563]">
            <a href="#services" className="hover:text-[#0F1419] transition-colors">
              Services
            </a>
            <a href="#work" className="hover:text-[#0F1419] transition-colors">
              Work
            </a>
            <a href="#process" className="hover:text-[#0F1419] transition-colors">
              Process
            </a>
            <a href="#founder" className="hover:text-[#0F1419] transition-colors">
              Founder
            </a>
            <a href="#faq" className="hover:text-[#0F1419] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#0F1419] transition-colors">
              Contact
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} {STUDIO_CONTACT.name}. All rights reserved.</p>

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
