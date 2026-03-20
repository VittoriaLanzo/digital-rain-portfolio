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
      longDesc: `Sestara is a personalized AI learning companion built on the premise that the hardest part of learning isn't the content — it's knowing what to study next.

The system generates a custom curriculum from a single topic or goal, breaking it into progressive milestones. A prompt-engineered tutor then tracks comprehension in real time, adapting difficulty and spacing repetition based on quiz results.

The core insight: LLMs are excellent curriculum designers when given structured constraints. By combining goal decomposition prompts, spaced repetition logic, and active recall generation into a tightly orchestrated pipeline, Sestara creates a feedback loop that keeps learners progressing — and actually remembering what they study.`,
      stack: ['Python', 'LLM Orchestration', 'Prompt Engineering', 'Frontend'],
      link: null as string | null,
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
      desc: 'This site. A cyberpunk city you scroll through — every building, raindrop, and neon sign generated in real time, with 3D kiosks as navigation.',
      longDesc: `You're inside it right now. NEONWALK is a portfolio built as a fully immersive 3D environment: a rain-soaked cyberpunk street you fly down by scrolling. There are no menus or tabs — the navigation is the city itself. Five glowing kiosks line the sidewalk, each one a portal to a section of work. Scroll past them, or walk up and click.

Everything in the scene is generated fresh in your browser on every load. The buildings, their neon-panel textures, car positions, puddle placements, steam vents, street lamps, and rain particles are all computed procedurally from seed functions — no pre-baked assets, no sprite sheets. A single scroll value (0–1) drives the entire experience: camera position, which glass panel is visible, UI fade state, and contact form appearance are all derived from that one number.

For engineers: the scene runs on React Three Fiber (Three.js declarative layer) inside a Vite + React + TypeScript SPA. Procedural building textures are drawn with the Canvas 2D API at runtime and uploaded to the GPU as THREE.CanvasTexture objects. Rain is an instancedMesh of 300 particles (40 on mobile) repositioned each frame. Level-of-detail gates (LOD_NEAR = 40, LOD_MID = 80) cull distant geometry. Adaptive performance scaling via R3F's performance monitor keeps the frame rate stable on low-end devices. The contact email is never a complete string anywhere in the source or compiled bundle — it is assembled from split literals only at click time.

CI enforces TypeScript strict mode, ESLint at zero warnings, and a successful Vite production build on every pull request. Routing is React Router v6; the contact form uses shadcn/ui with a mailto handler; section pages are full-scroll routes that share a sticky shell component and pull all content from a single typed data file.`,
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
