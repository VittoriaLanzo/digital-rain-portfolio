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
      longDesc: `You're inside it right now. NEONWALK is a personal portfolio built as a rain-soaked cyberpunk city you navigate by scrolling. No menus, no tabs — the city is the interface. Five glowing kiosks line the sidewalk, each a portal to a different section of work. A single number, scroll position from 0 to 1, drives everything: where the camera is, which panel slides in, when the contact form appears.

## For Designers

The whole experience is one continuous spatial narrative. You arrive on a rain-slicked street at night, particles falling, steam rising from manholes, neon signs flickering overhead. The camera drifts forward as you scroll — a slow flythrough that makes the environment feel inhabited rather than decorative. Depth is real: buildings recede, rain layers, puddles catch light. Nothing is flat.

Navigation is architectural. The kiosks aren't buttons styled to look interesting — they are objects in space, with glowing top caps, pillar frames, and a visible screen face. You approach them, they react to your cursor. The interaction model is show-don't-label: spatial framing does the work that microcopy usually does.

Typography runs on two faces throughout: Syne (geometric, constructed, slightly cold) for headings and UI labels; Inter (neutral, readable) for body text. The palette is deliberately constrained — near-black background (#050512), five accent colors each tied to a specific section, everything else kept dim. Color carries meaning here; it doesn't decorate.

## For Engineers

The 3D scene runs on React Three Fiber (Three.js declarative wrapper) inside a Vite + TypeScript SPA. Every visual element is procedurally generated at runtime — building positions, façade textures (drawn via Canvas 2D API and uploaded as THREE.CanvasTexture), car placements, puddle and manhole layouts, street lamp spacing, neon sign words. No pre-baked assets. On load, the scene is fully constructed from seed functions inside useMemo hooks.

Rain is a single instancedMesh of 300 particles (40 on mobile) with matrix positions updated per frame. Level-of-detail gates (LOD_NEAR = 40, LOD_MID = 80) cull geometry below the visible threshold. R3F's adaptive performance monitor adjusts pixel ratio dynamically under sustained load. On mobile, FloatingDust is disabled entirely and Stars drop from 1200 to 400. Click targets on the 3D kiosks are handled at the group level in R3F — any mesh in the group propagates pointer events upward, making the full physical structure interactive without an invisible hitbox overlay.

The master scroll variable (0–1) is the only stateful control: camera lerp targets, glass panel visibility windows, hero fade, and contact form reveal are all pure functions of that one number — no imperative animation, no timeline library. CI enforces tsc --noEmit strict, ESLint at zero warnings, and vite build on every PR. The contact email is never a complete string in source or bundle; it is assembled from split string literals only at the moment of click.`,
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
