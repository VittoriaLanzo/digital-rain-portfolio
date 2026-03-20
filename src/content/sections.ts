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
      longDesc: `Sestara is named after the sextant — the instrument sailors used to navigate open ocean with nothing but stars and math. Learning should feel the same way: oriented, purposeful, and never lost.

The spark was Chiara. She studied nine hours a day for six months preparing for Italy's single-shot university medicine entrance exam. Colour-coded binders. Three prep books. Zero social life. She failed by four points — not because she wasn't smart, but because she studied everything when she needed to study the right things. No system told her where she stood. No feedback loop. No way to distinguish real mastery from false familiarity.

Sestara is the system she never had: an AI-powered learning platform that turns any exam goal into a structured, trackable, and emotionally supported study journey.

## Design & Product

The entire product vision, brand identity, and UX system were built from scratch. Sestara needed to feel like a private tutor — warm, precise, and honest about where you stand — not another productivity app.

The brand is built around the sextant metaphor: orientation, measurement, navigation. Every surface reflects this. The dashboard is a command center, not a to-do list: a live roadmap with completion percentages, weekly study time, and streaks. Recharts turns raw numbers into feedback that actually motivates. The colour system and typography were chosen to feel premium without being cold.

The UX architecture separates the product into four self-contained modules — curriculum engine, quiz system, flashcards, and StudyBuddy — each accessible without friction, each feeding back into the same progress layer. The dual quiz architecture was a deliberate product decision: a native quiz engine for instant, no-setup quizzing with explanations, and a Custom Quiz Studio that generates structured JSON schema prompts compatible with any external model. AI-agnostic by design, so no student is ever locked out by a paywall or a provider.

Framer Motion handles all transitions. shadcn/ui (Radix primitives) + Tailwind CSS provides the component foundation. Tiptap gives StudyBuddy and Simple Explanations a rich text surface that feels like a real document, not a chat window. KaTeX renders every mathematical formula — critical for medicine, physics, and engineering tracks. Fabric.js powers a drawing canvas so students can sketch diagrams and work through problems visually, not just textually.

## StudyBuddy — The AI Companion

StudyBuddy is Sestara's on-site AI assistant, and its system prompt is the core of the AI layer. The prompt is engineered so the assistant knows the student's full curriculum, their current completion percentage, which sections are behind schedule, and what the exam actually tests — not just the topic in isolation.

The design intent: a student who is stuck, frustrated, or three weeks behind schedule shouldn't get a generic chatbot. They should get someone who checks in, recalibrates, and encourages. The prompt distinguishes between explaining a concept, simplifying it for a first-pass, and actively quizzing the student on it — each mode triggered differently, each with a distinct tone. It checks in. It encourages. It recalibrates when you're spiralling.

The Custom Quiz Studio extends this further: Sestara generates a ready-to-use prompt with a structured JSON schema that any LLM can parse — ChatGPT, Claude, Gemini, Llama, Perplexity. Paste the JSON back. The quiz feeds into the progress system. The library grows with every session.

## Stack

React 18 + TypeScript · Vite · Tailwind CSS + shadcn/ui · Framer Motion · TanStack React Query · React Router · Tiptap · KaTeX · Fabric.js · Recharts · Zod · React Hook Form · Lovable Cloud (auth, database, edge functions, storage) · GDPR-compliant (Article 28 DPAs, TLS in transit, no data resale)`,
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prompt Engineering', 'shadcn/ui', 'KaTeX', 'Lovable'],
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
