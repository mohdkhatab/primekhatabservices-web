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
    <section id="contact" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-[#1D4ED8] mb-2">Contact</p>
              <h2
                className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#0F1419] mb-4"
                style={{textWrap: 'balance'}}
              >
                Start a project with Prime Khatab Services.
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-8">
                Have a mobile app, website, AI agent workflow, custom API, or AI dubbing pipeline in
                mind? Reach out directly by email or compose a quick brief.
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-[#E3E7EE]">
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Business Email</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={STUDIO_CONTACT.mailtoHref}
                      className="font-display text-lg font-semibold text-[#0F1419] hover:text-[#1D4ED8] transition-colors"
                    >
                      {STUDIO_CONTACT.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] hover:border-[#0F1419] rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
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

                <div className="p-5 rounded-xl bg-white border border-[#E3E7EE]">
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Studio Address</p>
                  <p className="text-sm font-medium text-[#0F1419]">{STUDIO_CONTACT.fullAddress}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
                  <a
                    href={STUDIO_CONTACT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-[#374151] hover:text-[#0F1419] transition-colors"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={STUDIO_CONTACT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[40px] font-medium text-[#374151] hover:text-[#0F1419] transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#6B7280] mt-8">
              Based in {STUDIO_CONTACT.fullAddress} · Direct replies within 24 hours.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 rounded-xl bg-white border border-[#E3E7EE] space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[#0F1419] mb-1.5"
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
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] rounded-lg placeholder:text-[#9CA3AF] focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-[#B91C1C]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-[#0F1419] mb-1.5"
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
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] rounded-lg placeholder:text-[#9CA3AF] focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-[#B91C1C]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-service"
                  className="block text-sm font-medium text-[#0F1419] mb-1.5"
                >
                  Primary service
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] rounded-lg focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-summary"
                  className="block text-sm font-medium text-[#0F1419] mb-1.5"
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
                  className="w-full px-3.5 py-2.5 text-sm text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] rounded-lg placeholder:text-[#9CA3AF] focus:bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
                {errors.summary && (
                  <p id="contact-summary-error" className="mt-1.5 text-xs text-[#B91C1C]">
                    {errors.summary}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
                >
                  <span>Send via email</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] hover:border-[#0F1419] rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy brief</span>
                </button>
              </div>

              {statusMessage && (
                <p
                  role="status"
                  className="text-sm text-[#0F1419] bg-[#F7F8FA] border border-[#D4DAE3] rounded-lg px-4 py-3"
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
