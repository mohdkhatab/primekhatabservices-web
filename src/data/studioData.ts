export type ServiceCategory = 'all' | 'apps-web' | 'ai-apis' | 'media-voice';

export interface ServiceItem {
  index: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  summary: string;
  deliverables: string[];
}

export interface WorkHighlightItem {
  index: string;
  category: string;
  scope: string;
  summary: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const STUDIO_CONTACT = {
  name: 'Prime Khatab Services',
  founder: 'Mohd Khatab',
  foundedDate: 'October 2026',
  shortLocation: 'Rajouri, Jammu & Kashmir, India',
  fullAddress: 'Rajouri, Jammu & Kashmir 185132, India',
  postalCode: '185132',
  email: 'startup@primekhatab.in',
  mailtoHref:
    'mailto:startup@primekhatab.in?subject=Project%20Inquiry%20%E2%80%94%20Prime%20Khatab%20Services',
  phone: '+91 96825 44349',
  phoneHref: 'tel:+919682544349',
  github: 'https://github.com/mohdkhatab',
  linkedin: 'https://www.linkedin.com/in/mohd-khatab-3b5b7942a/',
  instagram: 'https://instagram.com/primekhatab',
  instagramHandle: '@primekhatab',
  telegram: 'https://t.me/primekhatab',
  telegramHandle: '@primekhatab',
} as const;

export const STUDIO_IMAGES = {
  heroDesk: {
    src: '/images/hero-studio.jpg',
    alt: 'The Prime Khatab Services studio desk at dusk — an ultrawide monitor with code and audio waveforms, a phone running a media app, and the misty Pir Panjal mountains of Rajouri outside the window',
  },
  mediaDubbing: {
    src: '/images/dubbing-studio.jpg',
    alt: 'Inside the Prime Khatab Services dubbing studio — a broadcast condenser microphone and dual monitors running multi-character voice timelines',
  },
  founderPortrait: {
    src: '/images/founder-workspace.jpg',
    alt: 'The founder\u2019s desk in Rajouri, Jammu & Kashmir — laptop with code, a phone testing a streaming app, hand-sketched app wireframes in a notebook, and the green Himalayan valley outside the window',
  },
} as const;

export const CAPABILITY_STACK: { group: string; items: string }[] = [
  {
    group: 'Mobile & Web',
    items: 'Android (Kotlin, Jetpack Compose) · React · TypeScript · Next.js · Tailwind CSS',
  },
  {
    group: 'Backend & APIs',
    items: 'Node.js · Python · FastAPI · Express · PostgreSQL · REST & Webhooks',
  },
  {
    group: 'AI & Agents',
    items: 'Structured LLM Pipelines · Tool-Use Agents · RAG · Workflow Automation',
  },
  {
    group: 'Voice & Media',
    items: 'AI Dubbing · Voice Synthesis · FFmpeg · Subtitle Sync · Streaming UI',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'App Development',
    category: 'apps-web',
    categoryLabel: 'Apps & Web',
    summary:
      'Native-feel Android applications engineered for fast startup, offline resilience, smooth media playback, and dependable day-to-day performance across varied hardware. Designed for startups and businesses that need clean mobile software shipped to production without bloated agency overhead.',
    deliverables: [
      'Android application architecture in Kotlin or cross-platform builds',
      'Adaptive video and audio playback with offline caching and background sync',
      'Crash-free release packaging, signing, and Play Store submission readiness',
    ],
  },
  {
    index: '02',
    title: 'Web Development',
    category: 'apps-web',
    categoryLabel: 'Apps & Web',
    summary:
      'High-speed web applications, responsive product websites, and operational client portals built with strict TypeScript and clean semantic markup. Every interface is structured for clarity on desktop and mobile, fast page loads, and straightforward long-term maintenance.',
    deliverables: [
      'Responsive React and Next.js frontends with refined typography',
      'Customer portals, content catalogs, and internal admin workflows',
      'Technical SEO, structured Schema.org data, and performance tuning',
    ],
  },
  {
    index: '03',
    title: 'AI Integration & AI Agents',
    category: 'ai-apis',
    categoryLabel: 'AI & APIs',
    summary:
      'Practical AI model integration and task-focused agents embedded directly into your existing software and business operations. From grounded document retrieval to multi-step tool-calling workflows with human approval checkpoints, systems stay predictable, auditable, and cost-controlled.',
    deliverables: [
      'Structured data extraction, classification, and grounded RAG search',
      'Tool-calling AI agents with explicit approval gates and audit logs',
      'Automated ingestion, triage, evaluation harnesses, and fallback routing',
    ],
  },
  {
    index: '04',
    title: 'API Development',
    category: 'ai-apis',
    categoryLabel: 'AI & APIs',
    summary:
      'Durable HTTP APIs, authentication layers, webhook receivers, and integration backends built around clear contracts and predictable error handling. Designed to connect mobile apps, web dashboards, payment providers, and background workers into one reliable system.',
    deliverables: [
      'Versioned REST endpoints, token authentication, and role permissions',
      'Queue-backed asynchronous workers for long-running AI or media jobs',
      'Third-party payment, cloud storage, and webhook orchestration with docs',
    ],
  },
  {
    index: '05',
    title: 'AI Dubbing & Voice Solutions',
    category: 'media-voice',
    categoryLabel: 'Media & Voice',
    summary:
      'End-to-end localization and voice synthesis pipelines tailored for episodic video, donghua, anime, and short dramas. Combines context-aware script adaptation, speaker-matched voice synthesis, and line-duration synchronization to produce natural Hindi-dubbed audio.',
    deliverables: [
      'Script translation and adaptation preserving character tone and pacing',
      'Multi-speaker voice profiling, timing sync, and stem-level audio mixing',
      'Batch episode localization workflows for recurring release schedules',
    ],
  },
  {
    index: '06',
    title: 'Media Tech',
    category: 'media-voice',
    categoryLabel: 'Media & Voice',
    summary:
      'Custom infrastructure and playback tooling for digital publishers, video catalogs, and streaming teams. Covers automated video transcoding, subtitle timing pipelines, and viewer-first mobile or web catalog interfaces built to handle media cleanly at scale.',
    deliverables: [
      'Automated FFmpeg transcoding, subtitle burn-in, and HLS packaging',
      'Playback-first mobile and web streaming catalog interfaces',
      'Editorial content scheduling, metadata, and media asset workflows',
    ],
  },
];

export interface ProjectItem {
  name: string;
  status: string;
  statusTone: 'live' | 'open' | 'soon';
  stack: string;
  summary: string;
  repo?: string;
}

export const FEATURED_PROJECT: ProjectItem = {
  name: 'Live Video Dubbing',
  status: 'Upcoming — Flagship',
  statusTone: 'soon',
  stack: 'Real-time AI voice pipeline · Live streaming infra',
  summary:
    'The studio\'s flagship launch in the making: the proven episode-dubbing pipeline, rebuilt to dub video live as it plays — per-character AI voices, fitted timing and the original music kept, streamed in Hindi in real time. The launch infrastructure is currently being prepared with cloud startup support so the pipeline can run live, at scale, from day one.',
};

export const PROJECTS: ProjectItem[] = [
  {
    name: 'AI Video Dubbing Pipeline',
    status: 'In Production',
    statusTone: 'live',
    stack: 'Python · AI voice synthesis · FFmpeg',
    summary:
      'The production pipeline behind the studio\'s daily Hindi releases: transcription, context-aware script adaptation, per-character voice casting, lip-sync fitted timing and a clean final mix — original music and effects kept. Packaged as an agent skill any AI assistant can run.',
    repo: 'https://github.com/mohdkhatab/video-dubbing-skill',
  },
  {
    name: 'DubFlow — Dubbing Platform',
    status: 'Studio Product',
    statusTone: 'live',
    stack: 'React · TypeScript · Backend job orchestration',
    summary:
      'A full-stack video dubbing and transcription platform: web UI, secure backend job orchestration, file storage, live status polling, agent reports and logs, with OpenRouter-compatible model integration.',
  },
  {
    name: 'Telegram Personal Agent',
    status: 'Open Source',
    statusTone: 'open',
    stack: 'Python · Telethon / MTProto · OpenAI-compatible APIs',
    summary:
      'An AI agent that runs a personal Telegram account end to end — reading and replying in DMs and groups through any OpenAI-compatible model API, from OpenRouter and OpenAI to Groq or a local Ollama bridge.',
    repo: 'https://github.com/mohdkhatab/telegram-personal-agent',
  },
  {
    name: 'Prime AI Agent Skills',
    status: 'Open Source',
    statusTone: 'open',
    stack: '39 skills · Multi-agent orchestration',
    summary:
      'A complete collection of 39 production-ready autonomous AI agent skills — multi-agent orchestration, deep research, full-stack development, a document engine and enterprise automation workflows.',
    repo: 'https://github.com/mohdkhatab/prime-ai-agent-skills',
  },
  {
    name: 'UPI Payment Gateway',
    status: 'Open Source',
    statusTone: 'open',
    stack: 'PHP 8 · MySQL & SQLite · Backend APIs',
    summary:
      'An enterprise-grade, lightweight UPI payment gateway in core PHP: merchant dashboard, a Razorpay-style slide-up checkout SDK, SQL-backed order storage and automated payment-confirmation parsing.',
    repo: 'https://github.com/mohdkhatab/prime-khatab-upi-gateway',
  },
  {
    name: 'Shorts Video Studio',
    status: 'Open Source',
    statusTone: 'open',
    stack: 'Python · Motion graphics engine',
    summary:
      'An agent skill plus Python engine that turns a researched script into a finished 9:16 Short — cue-synced motion graphics, kinetic captions, synthesized music and a loudness-normalised mix. No GPU, no video editor.',
    repo: 'https://github.com/mohdkhatab/shorts-video-studio',
  },
  {
    name: 'AI Agent Voice',
    status: 'Studio Product',
    statusTone: 'open',
    stack: 'TypeScript · Real-time voice AI',
    summary:
      'A voice-first AI agent that holds natural spoken conversations — live speech in, reasoning, and speech back out — built for hands-free assistance and voice-driven workflows.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Scope & Alignment',
    duration: 'Days 1–3',
    description:
      'We define the exact problem, user flows, technical constraints, and delivery milestones over email or a short call—no bloated discovery decks.',
  },
  {
    step: '02',
    title: 'Architecture & Prototype',
    duration: 'Week 1',
    description:
      'Data models, API contracts, UI wireframes, or sample voice/dubbing outputs are validated early so you see working direction before full build.',
  },
  {
    step: '03',
    title: 'Build & Integration',
    duration: 'Weekly Builds',
    description:
      'Iterative engineering in clean commits with regular preview links, staging APKs, or test endpoints so progress stays concrete and reviewable.',
  },
  {
    step: '04',
    title: 'Launch & Handover',
    duration: 'Final Delivery',
    description:
      'Production deployment, documentation, environment setup, and complete source ownership transferred cleanly to your team.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'engagement',
    question: 'How do engagements typically start?',
    answer:
      'Send a brief note to startup@primekhatab.in outlining what you are building, your target timeline, and any existing assets or APIs. Within 24 hours you will get a direct response with clarifying questions, scope options, and a realistic delivery estimate.',
  },
  {
    id: 'services-scope',
    question: 'Can you handle both software engineering and AI dubbing or media tooling?',
    answer:
      'Yes. Prime Khatab Services pairs full-stack app, web, and API engineering with hands-on media localization experience—including AI voice pipelines, subtitle timing, and streaming player integration.',
  },
  {
    id: 'dubbing-quality',
    question: 'How do you keep AI video dubbing natural for Hindi donghua, anime, or short dramas?',
    answer:
      'Automated translation alone sounds flat. Our pipeline combines context-aware script adaptation, line-duration matching, distinct speaker voice profiles, and final stem balancing against background music and sound effects.',
  },
  {
    id: 'ownership',
    question: 'Do we own the source code, model configurations, and deliverables?',
    answer:
      'Completely. All custom application code, APIs, deployment scripts, and localized media assets built for your engagement belong to you upon completion and agreed payment, with clean Git repositories and documentation.',
  },
  {
    id: 'location-timezone',
    question: 'Where is the studio based, and do you work with international teams?',
    answer:
      'Prime Khatab Services operates from Rajouri, Jammu & Kashmir 185132, India (IST / UTC+5:30). We collaborate smoothly with founders, small businesses, and media teams across India and internationally through async updates and scheduled overlap windows.',
  },
];
