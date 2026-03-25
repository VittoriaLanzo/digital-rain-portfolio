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
  tagline: 'Product Designer · Frontend Engineer · AI Architect',
  headline: 'I build the whole\nstack that thinks.',
  bio: 'From brand systems to React components to agentic pipelines — I design and ship the full experience layer, including the AI that powers it.',

  stats: [
    { value: '3',  label: 'Products Shipped' },
    { value: '3',  label: 'Core Languages' },
    { value: '4+', label: 'Years Across Disciplines' },
    { value: '1',  label: 'ML Extended Abstract' },
  ] as Stat[],

  experiences: [
    {
      year: '2026',
      role: 'Independent Researcher',
      org: 'Self-directed · EEML 2026',
      desc: 'Investigated timestep-localization of minority guidance in diffusion denoising. Designed and ran 250 experiments via an agentic pipeline on Kaggle. Extended abstract submitted to EEML 2026.',
    },
    {
      year: '2026',
      role: 'Designer & Engineer',
      org: 'NEONWALK',
      desc: 'Designed and built this portfolio as a fully navigable 3D cyberpunk city in WebGL — procedural geometry, scroll-driven camera, and every UI element engineered from scratch.',
    },
    {
      year: '2026',
      role: 'Product Designer · Frontend Engineer · AI Engineer',
      org: 'Sestara',
      desc: 'Silver Medal — 2nd place overall out of 925 participants at the MEGA Hackathon. Sole product, design, and AI lead on a free edtech platform. Designed the system, wrote all React components, engineered all prompts. 22m11s average session in 90 days.',
    },
    {
      year: '2026',
      role: 'AI Systems Designer',
      org: 'CodeMentor',
      desc: 'Co-built a Chrome extension coaching learners through DSA problems on LeetCode, Codeforces, and HackerRank. Designed a four-level progressive hint system and a stuck-detection response loop.',
    },
  ] as Experience[],
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
      desc: "Silver Medal — 2nd place overall out of 925 participants at the MEGA Hackathon. Sestara is an AI-powered edtech platform that generates your personal study roadmap, tracks every topic, and quizzes you until you actually know it — with a 22-minute average session to prove it works.",
      longDesc: `Silver Medal. 2nd place overall. 925 participants. MEGA Hackathon.

That is the context for everything that follows. Sestara did not place second in a small room — it competed against 925 participants at the MEGA Hackathon, a global event integrating computer science, AI, and STEM aimed at advancing human development, and it took the Silver Medal. The product that earned that result is described below.

Twenty-two minutes and eleven seconds. That is the average session duration on Sestara in its first 90 days — on a free edtech tool built at a hackathon. For context: most consumer web products consider two minutes a success. Students are not bouncing. They are staying and working. That number is the result of every product, design, and AI decision described below.

Sestara is named after the sextant — the instrument sailors used to navigate open ocean with nothing but stars and math. The premise behind the product: learning should feel the same way. Oriented, purposeful, and never lost.

The spark was Chiara. She studied nine hours a day for six months to prepare for Italy's single-shot university medicine entrance exam — the test di ammissione a medicina. Colour-coded binders. Three prep books. Zero social life. She failed by four points. Not because she wasn't smart. Because she studied everything when she needed to study the right things. No system told her where she stood. No feedback loop. No way to distinguish real mastery from false familiarity. Chiara is why Sestara exists — not as evidence of a market, but as a reminder of what it costs when the tools aren't there.

Sestara is a free, open-access edtech platform built at a hackathon — an AI-powered study companion that turns any exam goal into a structured, trackable journey with the precision of a private tutor built into every interaction. It generates a complete curriculum for any exam, tracks every topic in real time, quizzes students with explanations, and deploys an AI companion that knows exactly where they stand. The product launched at sestara.lovable.app and reached 116 unique visitors and 601 pageviews in its first 90 days, with that 22-minute 11-second average session and 5.18 pages per visit. Vittoria was the sole decision-maker for every interaction a user ever touches: what it looks like, how it moves, what the AI says, and what the product does next. She wrote the React components, built the design system from scratch, implemented all animations, drove every product decision on the UI layer, and engineered all AI prompts. Harshit Singh led the backend. The reason the product is coherent is that the same person held the design decisions, the implementation decisions, and the AI interaction decisions simultaneously — no handoff, no translation loss between disciplines. That is rare, and it shows.

## For Product Designers

Productivity apps optimise for completion. Tutors optimise for understanding. That is the design principle that propagates through every surface of Sestara, and every decision either follows from it or it does not belong in the product.

The dashboard is a command center, not a task list. Progress is a live roadmap, not a completion bar. Quizzes explain not just correct and wrong but why. The AI companion responds differently depending on whether a student is ahead, on track, or three weeks behind. Each of these choices follows directly from that principle: the product is not trying to help you finish. It is trying to help you actually know.

The brand is anchored to the sextant metaphor: orientation, measurement, navigation. The name, the logotype, the onboarding language, and the information architecture all carry this thread. The product tells you where you are, how far you have left, and whether you are moving in the right direction. The gap between feeling prepared and being prepared becomes visible, measurable, and closeable. That is the brand promise and it is encoded into every interaction.

The UX architecture separates Sestara into four self-contained modules — curriculum engine, quiz system, flashcards, and StudyBuddy — each independently accessible, each feeding back into the same progress layer. This prevents cognitive fragmentation. A student does not switch between study mode and quiz mode; the system holds the context and carries it forward. Recharts was chosen as the visualisation layer because progress data here is doing real motivational work: topic completion percentages, weekly study time, streak calendars. Data visualisation in Sestara is the primary mechanism through which a student understands where they stand.

During design, Vittoria identified a class of learners systematically underserved by text-based quiz tools: students preparing for visual subjects. Anatomy diagrams cannot be understood through flashcard text alone. Circuit schematics require spatial reasoning. Geometric proofs live on paper. That insight drove the decision to build an in-app drawing canvas — students can sketch and annotate directly inside Sestara without switching tools. That is product thinking before it is a stack choice.

The dual quiz architecture was the most deliberate product decision. Rather than choosing between a native quiz engine and external AI dependency, the product does both: a built-in quiz engine for instant, zero-setup quizzing with answer explanations, and a Custom Quiz Studio that generates a structured JSON schema prompt compatible with any external language model. Streaks, weekly progress indicators, exam countdowns, and recalibration nudges from StudyBuddy are the mechanism that brings students back tomorrow. Habit design and product design are the same thing here.

Before a line of code was written, Vittoria understood that trust is load-bearing infrastructure in a European student product — not a compliance checkbox. She designed the data architecture first: which processors handle which data categories, where Article 28 Data Processing Agreements apply, which data flows are strictly off-limits. GDPR compliance was fully documented before the first feature shipped. In a product that asks students under exam pressure to trust it with their academic trajectory, the architecture of that trust is a senior product decision, not a legal afterthought.

## For Frontend Engineers

The hardest frontend problem on Sestara was maintaining a coherent, consistent experience across four distinct modules that each behave differently but must feel like one product. Every transition, every state change, every piece of AI output had to land with the same visual register. That required building the design system and the component architecture simultaneously, so the visual language and the code structure reinforced each other from the start — and it had to happen under hackathon time pressure. A complete, coherent product experience with this level of module depth is what the 22-minute session number compresses into a single figure.

The decision that no state change should be abrupt led to Framer Motion as the transition layer — module switches, progress updates, and StudyBuddy responses all animate into view. The decision that AI output should feel authoritative rather than ephemeral led to Tiptap as the rich text rendering surface for StudyBuddy responses and Simple Explanations, making the output read like a real document rather than a chat bubble. The decision that formula integrity is non-negotiable for medicine, physics, and engineering exam tracks led to KaTeX for every mathematical expression — typographic precision that affects comprehension directly.

The decision to serve visual learners led to Fabric.js powering the in-app drawing canvas. The decision that malformed language model output should never crash a user session mid-use led to Zod validating every JSON schema exchange between the AI layer and the application.

The full frontend stack: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui built on Radix UI primitives, Framer Motion, TanStack React Query, React Router, Tiptap, KaTeX, Fabric.js, Recharts, Zod, and React Hook Form.

Lovable handled backend scaffolding — authentication, database, edge functions, and file storage. The decision to use it was architectural: compressing weeks of backend setup into days freed the design and frontend work to move at full speed without waiting on infrastructure. The result was a clean separation of concerns between two contributors across two countries, with Harshit owning the backend layer entirely while Vittoria held sole authority over every interaction a user ever touches.

## For AI & Prompt Engineers

The hardest problem in the AI layer is context fidelity at scale: how do you write a system prompt that keeps an AI companion genuinely aware of a student's complete six-month curriculum, their per-topic completion percentages, which sections are ahead of schedule and which are falling behind, and what the exam actually tests in each area — rather than just the topic name in isolation — without the prompt collapsing into generic helpfulness under the weight of that context? That is the central engineering challenge of StudyBuddy's system prompt, and it is where the architecture begins.

Vittoria has developed a methodology for AI learning companion architecture across two products in two different domains. CodeMentor — a Chrome extension built with Harshit Singh (github.com/harshitSingh1/CodeMentor) that coaches learners through data structures and algorithms problems on LeetCode, Codeforces, and HackerRank — established the pattern. CodeMentor uses a four-level progressive hint system: intuitive nudges first, approach outlines second, pseudo-code third, and only then direct guidance. It detects when a user has been stuck for fifteen minutes and responds with constraint-focused questions rather than answers. StudyBuddy is what those patterns became when the domain shifted from competitive programming to high-stakes exam preparation, the user went from one problem to an entire six-month curriculum, and the emotional stakes increased by an order of magnitude. That is a track record, not a footnote.

The interaction model encodes three distinct modes, each triggered by different conditions and each carrying a different tone. Explanation mode unpacks a concept from first principles with typographic care. Simplification mode delivers a plain-language entry point before complexity is introduced — because plain language is the entry point to everything harder, not a concession. Quiz mode performs active recall, not passive re-exposure: the assistant asks, waits, then responds to the specific shape of the student's answer. The system prompt defines these boundaries explicitly so the assistant does not default to a generic helpful-assistant register when a student needs targeted recalibration.

The provider-agnostic architecture of the Custom Quiz Studio is a principled systems decision: a student whose school blocks one tool, or whose device supports a different model, should have exactly the same Sestara experience as everyone else. That reasoning drove the design before the implementation. Sestara generates a ready-to-use prompt with a structured JSON schema that any language model can parse — ChatGPT, Claude, Gemini, Llama, Perplexity. The schema specifies question format, difficulty tier, topic scope, explanation depth, and answer structure. The student pastes the model's output back; Sestara parses it via Zod validation and feeds it into the progress system. The quiz library grows with every session, and no student is locked into a single AI provider.`,
      stack: ['React', 'TypeScript', 'Framer Motion', 'Tiptap', 'KaTeX', 'Fabric.js', 'Prompt Engineering', 'Lovable', 'Tailwind CSS', 'GDPR'],
      link: 'https://sestara.lovable.app' as string | null,
    },
    {
      id: '02',
      slug: 'windowed-minority-guidance',
      name: 'Extended Abstract: Windowed Minority Guidance',
      year: '2026',
      desc: 'Preliminary evidence for timestep-localized effects in diffusion denoising.',
      longDesc: `Minority guidance (Um et al., 2024) steers diffusion sampling toward under-represented data regions by injecting a classifier gradient at every denoising timestep. The premise of this work is a simple question: is that effect actually uniform across the denoising trajectory, or is it concentrated in a specific phase?

## The Research Question

If minority guidance derives most of its effect from a narrow window of timesteps, applying it at every step wastes compute — and may introduce noise outside the effective window. Prior work on the denoising process suggests that different phases of sampling contribute differently to output structure, but whether this asymmetry extends to guidance effectiveness is not established. This extended abstract reports a preliminary investigation of that question under controlled, limited conditions.

## Experimental Design

The denoising trajectory is partitioned into three equal-thirds windows — early (t ∈ [0,333)), mid (t ∈ [333,667)), and late (t ∈ [667,1000)) — defined over the original DDPM noise schedule index space, with \`timestep_respacing=250\` mapping each window to a subset of the 250 executed steps. Each windowed condition is compared against a full-chain minority guidance baseline and a no-guidance baseline. Experiments use the LSUN Bedroom 256×256 model with the frozen minority classifier chain from Um et al. (2024), at a fixed guidance scale of 1.0, with a single target class (class 99) and n=1 sample per seed.

The study ran 50 seeds × 5 conditions = 250 total runs. Primary metric is classifier cross-entropy loss at the minority class, where lower values indicate stronger guidance signal. Two methodological deviations are noted explicitly in the paper: the sample size was pre-registered at n=10 and expanded to n=50 during execution, and the primary metric was switched from classifier confidence to cross-entropy loss — both flagged as protocol deviations in the write-up. These are honest limitations of a pilot study.

## The Agentic System

The experimental pipeline was implemented as an agentic system running on Kaggle (P100, float32): LLM-driven agents handled experiment configuration, execution scheduling, and output parsing across the 250 runs without manual intervention between iterations, and generated interpretive summaries of intermediate results to inform sequencing decisions. This is infrastructure context, not a scientific contribution — the methodological questions here are about diffusion guidance, not the pipeline that ran the experiments.

## Findings and Scope

Within this experimental scope, the mid-chain window is the strongest single contributor to minority guidance effectiveness. Early guidance shows relatively stable behaviour across seeds. Late guidance underperforms both other windows and in some cases reduces minority affinity below the no-guidance baseline — a pattern the paper notes but does not causally explain.

These findings are preliminary in a precise sense: single class, single dataset, fixed guidance scale, one sample per seed. They suggest a testable hypothesis about timestep localisation in minority guidance, not a settled result. No single windowed condition approximates full-chain performance, and the paper's conclusion reflects this directly. Full quantitative results are withheld pending submission outcome.

*Extended abstract submitted to EEML 2026. Vittoria Lanzo — Independent Researcher.*`,
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
