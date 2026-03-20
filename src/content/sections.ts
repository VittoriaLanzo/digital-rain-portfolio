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
  name: string;
  year: string;
  desc: string;
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

  // ── Add a project by copying one of these blocks:
  // { id: '04', name: 'MY PROJECT', year: '2025', desc: 'What it does.', stack: ['Python', 'LangChain'], link: 'https://github.com/...' }
  projects: [
    {
      id: '01',
      name: 'PROJECT ONE',
      year: '2025',
      desc: 'Coming soon — details will be added here shortly.',
      stack: [] as string[],
      link: null as string | null,
    },
    {
      id: '02',
      name: 'PROJECT TWO',
      year: '2025',
      desc: 'Coming soon — details will be added here shortly.',
      stack: [] as string[],
      link: null as string | null,
    },
    {
      id: '03',
      name: 'PROJECT THREE',
      year: '2025',
      desc: 'Coming soon — details will be added here shortly.',
      stack: [] as string[],
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
