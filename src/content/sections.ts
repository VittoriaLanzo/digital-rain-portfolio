/* ─── src/content/sections.ts ─────────────────────────────────────────────
   Single source of truth for every section's content.

   HOW TO EDIT:
   ─ Add a project     → push an object to WORK.projects
   ─ Add a skill       → push a string to SKILLS.categories[n].items
   ─ Add a category    → push an object to SKILLS.categories
   ─ Add experience    → push an object to ABOUT.experiences
   ─ Add a lab item    → push an object to LAB.experiments
   ─────────────────────────────────────────────────────────────────────── */

// ─── Types ────────────────────────────────────────────────────────────────

export interface Stat {
  value: string;
  label: string;
}

export interface Experience {
  year: string;
  role: string;
  org: string;
  desc: string;
}

export interface SkillCategory {
  name: string;
  /** Accent color for this category (any CSS color string) */
  color: string;
  items: string[];
}

export interface Project {
  id: string;
  /** URL-safe slug for the detail page, e.g. 'sestara' */
  slug: string;
  name: string;
  year: string;
  desc: string;
  /** Extended description shown on the project detail page */
  longDesc?: string;
  /** Tech tags shown as chips */
  stack: string[];
  /** External link, or null if not yet published */
  link: string | null;
}

export type ExperimentStatus = 'active' | 'wip' | 'archived';

export interface Experiment {
  name: string;
  desc: string;
  status: ExperimentStatus;
}

// ─── About ────────────────────────────────────────────────────────────────

export const ABOUT = {
  tagline: 'AI Prompt Engineer · Agentic Systems Designer',
  headline: 'I make AI\nthink precisely.',
  bio: 'I design the cognitive layer between human intent and machine execution — building the prompts, pipelines, and agentic frameworks that make intelligent systems behave precisely.',

  stats: [
    { value: '4+',  label: 'Years in AI' },
    { value: '20+', label: 'Pipelines Built' },
    { value: '3',   label: 'Languages' },
    { value: '∞',   label: 'Prompts Engineered' },
  ] as Stat[],

  // ── Add entries like: { year: '2024', role: 'AI Architect', org: 'Company', desc: 'What you did.' }
  experiences: [] as Experience[],
};

// ─── Skills ───────────────────────────────────────────────────────────────

export const SKILLS = {
  headline: 'The tools\nare language.',

  categories: [
    {
      name: 'Core Practice',
      color: '#6E6EFF',
      items: [
        'Prompt Engineering',
        'Agentic Design',
        'AI Systems Architecture',
        'Chain-of-Thought Design',
        'RAG Pipelines',
        'Human-AI Interaction',
      ],
    },
    {
      name: 'Technical',
      color: '#00FF88',
      items: ['Python', 'C', 'SQL', 'LaTeX', 'LLM Orchestration', 'Structured Outputs'],
    },
    // ── Add a new category: { name: 'Tools', color: '#00D4FF', items: ['LangChain', ...] }
  ] as SkillCategory[],
};

// ─── Work ─────────────────────────────────────────────────────────────────

export const WORK = {
  headline: 'Projects\nthat think.',

  projects: [
    {
      id: '01',
      slug: 'sestara',
      name: 'Sestara',
      year: '2025',
      desc: "Most learners quit because they don't know what to study next. Sestara fixes that — AI generates your personal roadmap, tracks every topic, and quizzes you until you actually know it.",
      longDesc: `Sestara is named after the sextant — the instrument sailors used to navigate open ocean with nothing but stars and math. The premise behind the product: learning should feel the same way. Oriented, purposeful, and never lost.

The spark was Chiara. She studied nine hours a day for six months to prepare for Italy's single-shot university medicine entrance exam — the test di ammissione a medicina. Colour-coded binders. Three prep books. Zero social life. She failed by four points. Not because she wasn't smart. Because she studied everything when she needed to study the right things. No system told her where she stood. No feedback loop. No way to distinguish real mastery from false familiarity. Chiara is why Sestara exists — not as evidence of a market, but as a reminder of what it costs when the tools aren't there.

Sestara is a free, open-access edtech platform built at a hackathon — an AI-powered study companion that turns any exam goal into a structured, trackable journey with the precision of a private tutor built into every interaction. It generates a complete curriculum for any exam, tracks every topic in real time, quizzes students with explanations, and deploys an AI companion that knows exactly where they stand. The product launched at sestara.lovable.app and accumulated 116 unique visitors and 601 pageviews in its first 90 days, with an average session duration of 22 minutes 11 seconds and 5.18 pages per visit — engagement numbers that reflect real use, not curiosity clicks. Vittoria led the full frontend and design: she wrote the React components, built the design system from scratch, implemented all animations, and drove every product decision on the UI layer. Harshit Singh led the backend.

## For Product Designers

Productivity apps optimise for completion. Tutors optimise for understanding. That single distinction is the design principle that propagates through every surface of Sestara — and it is where every design decision begins.

The dashboard is a command center, not a task list. Progress is a live roadmap, not a completion bar. Quizzes explain not just correct and wrong but why. The AI companion responds differently depending on whether a student is ahead, on track, or three weeks behind. Each of these choices follows directly from that one principle: the product is not trying to help you finish. It is trying to help you actually know.

The brand is anchored to the sextant metaphor: orientation, measurement, navigation. The name, the logotype, the onboarding language, and the information architecture all carry this thread. The product tells you where you are, how far you have left, and whether you are moving in the right direction. The gap between feeling prepared and being prepared becomes visible, measurable, and closeable. That is the brand promise and it is encoded into every interaction.

The UX architecture separates Sestara into four self-contained modules — curriculum engine, quiz system, flashcards, and StudyBuddy — each independently accessible, each feeding back into the same progress layer. This prevents cognitive fragmentation. A student does not switch between study mode and quiz mode; the system holds the context and carries it forward. Recharts turns raw progress data into feedback that actually motivates: topic completion percentages, weekly study time, streak calendars. Data visualisation here is not decoration — it is the primary mechanism through which a student understands where they stand.

The dual quiz architecture was the most deliberate product decision. Rather than choosing between a native quiz engine and external AI dependency, the product does both: a built-in quiz engine for instant, zero-setup quizzing with answer explanations, and a Custom Quiz Studio that generates a structured JSON schema prompt compatible with any external language model. Streaks, weekly progress indicators, exam countdowns, and recalibration nudges from StudyBuddy are not gamification — they are the mechanism that brings students back tomorrow. Habit design and product design are the same thing here.

## For Frontend Engineers

The hardest frontend problem on Sestara was not the component count — it was maintaining a coherent, consistent experience across four distinct modules that each behave differently but must feel like one product. Every transition, every state change, every piece of AI output had to land with the same visual register. That required building the design system and the component architecture simultaneously, so the visual language and the code structure reinforced each other from the start.

Framer Motion handles all transitions across the application — module switches, progress updates, and StudyBuddy responses all animate into view. No state change is abrupt. Tiptap provides the rich text rendering surface for StudyBuddy responses and the Simple Explanations feature, making AI output feel like a real document rather than a chat bubble. KaTeX renders every mathematical formula with typographic precision, which is non-negotiable for medicine, physics, and engineering exam tracks where formula integrity directly affects comprehension.

Fabric.js powers an in-app drawing canvas. Students preparing for visual subjects — anatomy diagrams, circuit schematics, geometric proofs — can sketch and annotate directly inside Sestara without switching tools. Zod validates every JSON schema exchange between the AI layer and the application, so malformed language model outputs never crash a user session mid-use.

The full frontend stack: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui built on Radix UI primitives, Framer Motion, TanStack React Query, React Router, Tiptap, KaTeX, Fabric.js, Recharts, Zod, and React Hook Form.

The backend runs on Lovable — authentication, database, edge functions, and file storage. Using Lovable for backend scaffolding was a deliberate architectural decision, not a shortcut: it compressed weeks of backend setup into days and freed the design and frontend work to move at full speed without waiting on infrastructure. The result was a clean separation of concerns between two contributors across two countries, with Harshit owning the backend layer entirely while Vittoria owned the frontend and product layer entirely.

GDPR compliance was built in from day one, not retrofitted. Before the first feature shipped, the data architecture was documented: which processors handle which data categories, where Article 28 Data Processing Agreements apply, and which data flows are strictly off-limits. All data is encrypted in transit. No student data is resold. In a European edtech product aimed at students under exam pressure, trust is infrastructure — and that means the compliance model has to be legible before the product asks anyone to sign up.

## For AI & Prompt Engineers

StudyBuddy is Sestara's on-site AI companion, and its system prompt is the central engineering challenge of the AI layer. The prompt is designed so the assistant operates with full awareness of the student's context: their specific exam, its macro-topic structure, the complete curriculum generated for them, their current completion percentage per section, which topics are ahead of schedule and which are falling behind, and what the exam actually tests in each area — not just the topic name in isolation.

The design patterns behind StudyBuddy were not invented for Sestara. CodeMentor — a Chrome extension built with Harshit Singh (github.com/harshitSingh1/CodeMentor) that coaches learners through data structures and algorithms problems on LeetCode, Codeforces, and HackerRank — was the proving ground. CodeMentor uses a four-level progressive hint system: intuitive nudges first, approach outlines second, pseudo-code third, and only then direct guidance. It detects when a user has been stuck for fifteen minutes and responds with constraint-focused questions rather than answers. StudyBuddy is what those patterns became when the domain shifted from competitive programming to high-stakes exam preparation, the user went from one problem to an entire six-month curriculum, and the emotional stakes increased by an order of magnitude.

The interaction model encodes three distinct modes, each triggered by different conditions and each carrying a different tone. Explanation mode unpacks a concept from first principles with typographic care. Simplification mode delivers a plain-language entry point before complexity is introduced — because simplicity is the entry point to everything harder, not a dumbed-down alternative. Quiz mode performs active recall, not passive re-exposure: the assistant asks, waits, then responds to the specific shape of the student's answer. The system prompt defines these boundaries explicitly so the assistant does not default to a generic helpful-assistant register when a student needs targeted recalibration.

The Custom Quiz Studio extends this architecture outward. Sestara generates a ready-to-use prompt with a structured JSON schema that any language model can parse — ChatGPT, Claude, Gemini, Llama, Perplexity. The schema specifies question format, difficulty tier, topic scope, explanation depth, and answer structure. The student pastes the model's output back; Sestara parses it via Zod validation and feeds it into the progress system. The quiz library grows with every session. No student is locked into a single AI provider — the architecture is deliberately agnostic so that a student whose school blocks one tool, or whose device supports a different model, has exactly the same Sestara experience as everyone else.`,
      stack: ['React', 'TypeScript', 'Framer Motion', 'Tiptap', 'KaTeX', 'Fabric.js', 'Prompt Engineering', 'Lovable', 'Tailwind CSS', 'GDPR'],
      link: 'https://sestara.lovable.app' as string | null,
    },
    {
      id: '02',
      slug: 'windowed-minority-guidance',
      name: 'Extended Abstract: Windowed Minority Guidance',
      year: '2025',
      desc: 'Preliminary evidence for timestep-localized effects in diffusion denoising.',
      longDesc: `This extended abstract presents preliminary evidence that minority guidance — a technique for steering diffusion models toward underrepresented data modes — produces statistically significant effects only within specific timestep windows during the denoising trajectory.

The research was engineered via a self-iterating agentic AI system: multiple specialized agents autonomously designed experiments, executed large-scale Kaggle runs, and iteratively refined hypotheses through closed-loop analysis. No human intervention was required between experimental iterations.

The key finding: applying guidance uniformly across all timesteps dilutes its effect and can destabilize generation. Windowing guidance to the mid-denoising phase (roughly timesteps 300–700 in a 1000-step schedule) yields measurably better mode coverage without sacrificing sample quality.

This work demonstrates both a technique improvement for diffusion models and a proof-of-concept for agentic scientific research pipelines.`,
      stack: ['Python', 'SQL', 'Kaggle', 'Agentic AI', 'Diffusion Models'],
      link: null as string | null,
    },
    {
      id: '03',
      slug: 'neonwalk',
      name: 'NEONWALK',
      year: '2026',
      desc: 'This site. A rain-soaked cyberpunk street you scroll through — every building, particle, and light procedurally generated in WebGL, with the environment itself as the navigation.',
      longDesc: `You are inside it right now. NEONWALK is a personal portfolio built as a fully navigable 3D environment: a rain-slicked cyberpunk street seen from street level, advanced by scrolling. A single normalized float — scroll progress, 0 to 1 — drives the camera position, every panel's visibility, every UI fade. Nothing is on a timeline.

## For Designers

The camera starts at the mouth of the street and flies forward continuously as you scroll. Depth is physical: buildings recede into exponential fog, overhead cables droop between facades, rain falls in front of nearer objects and behind farther ones. Steam rises from pipe vents at the sidewalk curb. Puddles sit flat on the pavement at y = 0.01. Three DJI-style drone models orbit at different points along the route — each one a social link, each with a holographic label panel that floats upright regardless of camera angle.

Section navigation uses five illuminated panel structures spaced along the sidewalks. Each one is a physical object: a metallic plinth, a tall dark screen body with a glass face, side pillars, a top cap glowing at 6× emissive intensity, and a color-coded torus-ring arrow bobbing above it on a stem. They are not buttons that look like panels; they are panels. At scroll milestones, frosted glass cards slide in from left or right — section teasers that layer over the 3D view and let you enter a full page without leaving the environment.

The palette is load-bearing. Four accent colors are assigned to the four sections and are used nowhere else: violet (#6E6EFF) for About and Contact, matrix green (#00FF88) for Skills, cyan (#00D4FF) for Work, magenta (#FF2D78) for Lab. Every panel structure, drone, and glass card inherits its section color. Two fonts, Syne for structure and labels, Inter for body text, are used without exception.

## For Engineers

Stack: React 18.3 + TypeScript (strict), Vite 5, React Three Fiber 8, Drei 9, React Router v6, shadcn/ui (contact form only). The WebGL canvas is a full-viewport R3F Canvas: antialias disabled for performance, ACESFilmic tonemapping at 1.2 exposure, DPR locked at 1, far plane at 400 units, performance={{ min: 0.5 }} so R3F can regress the render factor to 50% under sustained load. Everything outside the canvas is standard React DOM.

Every scene element is procedurally generated inside useMemo hooks on first render — no pre-baked meshes, no imported 3D files. Building geometry is assembled from stacked box primitives (body, rooftop trim, windows, doors, balconies, fire escapes, water towers, antennas) with façade textures drawn at runtime via the Canvas 2D API and uploaded as THREE.CanvasTexture. Rain is a Points mesh with a custom Float32Array position buffer, updated per frame in useFrame — 300 particles on desktop, 40 on mobile. Steam is an instancedMesh of 50 spheres per vent across 4 vents, matrix-repositioned each frame. The LOD system has three levels per building gated at LOD_NEAR = 40 and LOD_MID = 80 camera-distance units; far buildings drop to a single box with a baked emissive window strip.

Navigation panel click handling sits on the R3F group wrapping each panel structure. Child mesh pointer events bubble to the group's onClick — no invisible hitbox mesh, no raycasting workaround. The Html component from Drei renders the drone hologram panels and the mural identity card as DOM nodes transformed into 3D space; all Html overlays carry pointerEvents: none so they pass clicks through to the canvas. On mobile, FloatingDust (200 instanced spheres) is disabled, background silhouette buildings are removed, Stars drop from 1200 to 400, and vendor stalls are omitted. The contact email address is never present as a complete string anywhere in source or compiled output — it is assembled from split literals at the moment of user interaction.`,
      stack: ['React', 'TypeScript', 'Three.js', 'React Three Fiber', 'Vite', 'Procedural Generation'],
      link: null as string | null,
    },
  ] as Project[],
};

// ─── Lab ──────────────────────────────────────────────────────────────────

export const LAB = {
  headline: 'Where ideas\ncollide.',
  tagline: 'Experiments, tools, and things that might not work.',

  // ── Add an experiment: { name: '...', desc: '...', status: 'active' | 'wip' | 'archived' }
  experiments: [] as Experiment[],
};
