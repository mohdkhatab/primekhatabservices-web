export type ServiceCategory = 'all' | 'apps-web' | 'ai-apis' | 'media-voice';

export interface ServiceItem {
  index: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  summary: string;
  deliverables: string[];
  featured?: boolean;
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
  location: 'Rajouri, Jammu & Kashmir, India',
  email: 'startup@primekhatab.in',
  mailtoHref:
    'mailto:startup@primekhatab.in?subject=Project%20Inquiry%20%E2%80%94%20Prime%20Khatab%20Services',
  github: 'https://github.com/mohdkhatab',
  linkedin: 'https://www.linkedin.com/in/mohd-khatab-3b5b7942a/',
} as const;

export const STUDIO_IMAGES = {
  heroDesk: {
    src: '/src/assets/images/hero_studio_desk_1794901602064.jpg',
    alt: 'Prime Khatab Services engineering workstation showing interface architecture and audio waveform tools beside a misty mountain window',
  },
  mediaDubbing: {
    src: '/src/assets/images/service_media_dubbing_1794901602820.jpg',
    alt: 'Voice AI and multilingual video dubbing workstation with broadcast microphone and dual timeline monitors',
  },
  founderPortrait: {
    src: '/src/assets/images/founder_portrait_khatab_1794901605301.jpg',
    alt: 'Mohd Khatab, founder of Prime Khatab Services, seated in a daylight studio in Rajouri, Jammu and Kashmir',
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
    items: 'AI Video Dubbing · Voice Synthesis · FFmpeg · Subtitle Sync · Streaming UI',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'App Development',
    category: 'apps-web',
    categoryLabel: 'Apps & Web',
    summary:
      'Native-feel Android applications engineered for fast startup, offline resilience, media playback, and clean Play Store release cycles.',
    deliverables: [
      'Android architecture in Kotlin or cross-platform builds',
      'Adaptive video & audio playback with background sync',
      'Crash-free release packaging, telemetry, and store readiness',
    ],
  },
  {
    index: '02',
    title: 'Web Development',
    category: 'apps-web',
    categoryLabel: 'Apps & Web',
    summary:
      'High-speed web applications, editorial product sites, and internal operational consoles built with strict TypeScript and accessible markup.',
    deliverables: [
      'Responsive React & Next.js frontends with clean typography',
      'Client portals, content catalogs, and admin workflows',
      'Technical SEO, structured data, and Core Web Vitals tuning',
    ],
  },
  {
    index: '03',
    title: 'AI Integration',
    category: 'ai-apis',
    categoryLabel: 'AI & APIs',
    summary:
      'Practical model integration embedded directly into existing software—grounded in your data, predictable in output format, and cost-controlled.',
    deliverables: [
      'Structured extraction, classification, and document pipelines',
      'Grounded search and retrieval over internal knowledge bases',
      'Evaluation harnesses, fallback routing, and latency budgets',
    ],
  },
  {
    index: '04',
    title: 'AI Agents & Automation',
    category: 'ai-apis',
    categoryLabel: 'AI & APIs',
    summary:
      'Task-focused agents and deterministic background automations that handle repetitive research, content prep, and multi-system handoffs.',
    deliverables: [
      'Tool-calling agents with explicit approval checkpoints',
      'Scheduled ingestion, triage, and notification pipelines',
      'Audit logs and human-in-the-loop review interfaces',
    ],
  },
  {
    index: '05',
    title: 'API Development',
    category: 'ai-apis',
    categoryLabel: 'AI & APIs',
    summary:
      'Durable HTTP APIs, webhook receivers, and integration layers designed with clear contracts, rate limits, and straightforward documentation.',
    deliverables: [
      'Versioned REST endpoints, auth, and role permissions',
      'Queue-backed workers for long-running media or AI jobs',
      'Third-party payment, storage, and webhook orchestration',
    ],
  },
  {
    index: '06',
    title: 'AI Video Dubbing & Voice AI',
    category: 'media-voice',
    categoryLabel: 'Media & Voice',
    featured: true,
    summary:
      'End-to-end localization pipelines for episodic video, donghua, anime, and short dramas—combining translation, timing alignment, and expressive Hindi voice synthesis.',
    deliverables: [
      'Script adaptation preserving character tone and pacing',
      'Multi-speaker voice cloning, timing sync, and stem mixing',
      'Batch episode processing for high-volume release schedules',
    ],
  },
  {
    index: '07',
    title: 'Media & Content Technology',
    category: 'media-voice',
    categoryLabel: 'Media & Voice',
    summary:
      'Custom infrastructure for digital publishers and streaming teams—from subtitle timing utilities and FFmpeg pipelines to catalog discovery interfaces.',
    deliverables: [
      'Automated transcoding, subtitle burn-in, and HLS packaging',
      'Playback-first mobile and web viewer experiences',
      'Editorial content scheduling and catalog management tools',
    ],
  },
];

export const WORK_HIGHLIGHTS: WorkHighlightItem[] = [
  {
    index: '01',
    category: 'Shipped Android Apps',
    scope: 'Mobile Engineering',
    summary:
      'Consumer-facing Android applications built for smooth playback, clean offline caching, and dependable day-to-day performance across varied devices.',
  },
  {
    index: '02',
    category: 'AI Tools, APIs & Automation',
    scope: 'Applied AI Systems',
    summary:
      'Custom REST APIs, model-orchestration backends, and automated task runners that turn multi-hour manual workflows into predictable pipelines.',
  },
  {
    index: '03',
    category: 'Hindi Dubbed Donghua, Anime & Short-Drama Production',
    scope: 'Voice AI & Localization',
    summary:
      'Episodic Hindi dubbing workflows blending timing-accurate script localization, multi-voice synthesis, and clean audio post-processing.',
  },
  {
    index: '04',
    category: 'Media & Streaming App Experience',
    scope: 'Content Platforms',
    summary:
      'Playback-centric mobile and web interfaces engineered for fast catalog browsing, subtitle switching, and uninterrupted episode continuity.',
  },
  {
    index: '05',
    category: 'Developer Tools',
    scope: 'Engineering Utilities',
    summary:
      'Focused command-line utilities, API testing helpers, and internal workflow tools built to keep small teams shipping without friction.',
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
    question: 'Do we own the source code, models configuration, and deliverables?',
    answer:
      'Completely. All custom application code, APIs, deployment scripts, and localized media assets built for your engagement belong to you upon completion, with clean Git repositories and documentation.',
  },
  {
    id: 'location-timezone',
    question: 'Where is the studio based, and do you work with international teams?',
    answer:
      'Prime Khatab Services operates from Rajouri, Jammu & Kashmir, India (IST / UTC+5:30). We collaborate smoothly with founders, media producers, and engineering teams across India, Europe, the Middle East, and North America through async updates and scheduled overlap windows.',
  },
];
