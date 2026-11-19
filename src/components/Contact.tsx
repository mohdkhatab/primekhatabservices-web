import {useState, type FormEvent} from 'react';
import {ArrowUpRight, Check, Copy} from 'lucide-react';
import {STUDIO_CONTACT} from '../data/studioData';

const SERVICE_OPTIONS = [
  'App Development',
  'Web Development',
  'AI Integration & AI Agents',
  'API Development',
  'AI Dubbing & Voice Solutions',
  'Media Tech',
] as const;

interface FormErrors {
  name?: string;
  email?: string;
  summary?: string;
}

const inputClassName =
  'w-full min-h-[44px] px-3.5 py-2.5 text-sm text-cream bg-ink2 border border-line rounded-lg placeholder:text-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25';

export function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState<string>(SERVICE_OPTIONS[0]);
  const [summary, setSummary] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_CONTACT.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setStatusMessage(`Email address: ${STUDIO_CONTACT.email}`);
    }
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (summary.trim().length < 15) {
      nextErrors.summary = 'Please share a brief summary of at least 15 characters.';
    }
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatusMessage(null);
      return;
    }

    const subject = encodeURIComponent(
      `Project Inquiry (${serviceArea}) — ${name.trim()}`
    );
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nReply Email: ${email.trim()}\nService Area: ${serviceArea}\n\nProject Brief:\n${summary.trim()}`
    );

    setStatusMessage(
      'Your project brief is ready. Opening your email client addressed to startup@primekhatab.in.'
    );

    window.location.href = `mailto:${STUDIO_CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyBrief = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setStatusMessage(null);
      return;
    }

    const formatted = `To: ${STUDIO_CONTACT.email}\nSubject: Project Inquiry (${serviceArea}) — ${name.trim()}\n\nName: ${name.trim()}\nReply Email: ${email.trim()}\nService Area: ${serviceArea}\n\nProject Brief:\n${summary.trim()}`;

    try {
      await navigator.clipboard.writeText(formatted);
      setStatusMessage(
        'Project brief copied to clipboard. Paste it into an email to startup@primekhatab.in.'
      );
    } catch {
      setStatusMessage(`Please email your brief directly to ${STUDIO_CONTACT.email}.`);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative overflow-hidden hero-glow">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="section-label mb-3">Contact</p>
              <h2
                className="font-display text-3xl sm:text-[2.6rem] leading-[1.12] font-semibold tracking-tight text-cream mb-4"
                style={{textWrap: 'balance'}}
              >
                Start a project with Prime Khatab Services.
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed mb-9">
                Have a mobile app, website, AI agent workflow, custom API, or an AI dubbing
                pipeline in mind? Reach out directly by email, or compose a quick brief here —
                it lands with the founder, not a sales desk.
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-panel border border-line">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-faint mb-1.5">
                    Business Email
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={STUDIO_CONTACT.mailtoHref}
                      className="font-display text-lg font-semibold text-cream hover:text-accent transition-colors"
                    >
                      {STUDIO_CONTACT.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-cream bg-ink2 border border-line hover:border-accent/70 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-panel border border-line">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-faint mb-1.5">
                    Call / WhatsApp
                  </p>
                  <a
                    href={STUDIO_CONTACT.phoneHref}
                    className="font-display text-lg font-semibold text-cream hover:text-accent transition-colors"
                  >
                    {STUDIO_CONTACT.phone}
                  </a>
                </div>

                <div className="p-5 rounded-xl bg-panel border border-line">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-faint mb-1.5">
                    Studio Address
                  </p>
                  <p className="text-sm font-medium text-cream">{STUDIO_CONTACT.fullAddress}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
                  <a
                    href={STUDIO_CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-muted hover:text-cream transition-colors"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={STUDIO_CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-muted hover:text-cream transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={STUDIO_CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-muted hover:text-cream transition-colors"
                  >
                    <span>Instagram {STUDIO_CONTACT.instagramHandle}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={STUDIO_CONTACT.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-muted hover:text-cream transition-colors"
                  >
                    <span>Telegram {STUDIO_CONTACT.telegramHandle}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-faint mt-9">
              Based in {STUDIO_CONTACT.fullAddress} · Direct replies within 24 hours.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 rounded-2xl bg-panel border border-line space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-cream mb-1.5"
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayesha Sharma"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={inputClassName}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-[#F08A80]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-cream mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={inputClassName}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-[#F08A80]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-service"
                  className="block text-sm font-medium text-cream mb-1.5"
                >
                  Primary service
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className={inputClassName}
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-panel">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-summary"
                  className="block text-sm font-medium text-cream mb-1.5"
                >
                  Project details
                </label>
                <textarea
                  id="contact-summary"
                  name="summary"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Share your goals, target platforms, timeline, or episode/API volume."
                  aria-invalid={Boolean(errors.summary)}
                  aria-describedby={errors.summary ? 'contact-summary-error' : undefined}
                  className={inputClassName}
                />
                {errors.summary && (
                  <p id="contact-summary-error" className="mt-1.5 text-xs text-[#F08A80]">
                    {errors.summary}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 text-sm font-semibold text-[#1A1206] bg-accent hover:bg-accent2 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
                >
                  <span>Send via email</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-medium text-cream bg-ink2 border border-line hover:border-accent/70 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy brief</span>
                </button>
              </div>

              {statusMessage && (
                <p
                  role="status"
                  className="text-sm text-cream bg-ink2 border border-line rounded-lg px-4 py-3"
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
