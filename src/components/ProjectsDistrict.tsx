import { useState } from 'react';

interface Project {
  number: string;
  name: string;
  description: string;
  stack: string;
}

const projects: Project[] = [
  {
    number: '01',
    name: 'Sestara',
    description: "Most learners quit because they don't know what to study next. Sestara fixes that — AI generates your personal roadmap, tracks every topic, and quizzes you until you actually know it.",
    stack: 'Python · LLM Orchestration · Prompt engineering · frontend',
  },
  {
   number: '02',
name: 'Extended Abstract: Windowed Minority Guidance',
description: 'Preliminary evidence for timestep-localized effects in diffusion denoising.',
stack: 'Python · SQL · Kaggle · Agentic AI system',
note: 'Engineered via a self-iterating agentic AI system orchestrating multiple specialized agents to autonomously design experiments, execute large-scale runs, and iteratively refine hypotheses through closed-loop analysis.'
  },
  {
    number: '03',
    name: 'NEURALSCRIPT',
    description: 'Low-latency inference interface with custom instruction design',
    stack: 'C · Python · Agentic Pipeline Design',
  },
];

export default function ProjectsDistrict({ visible }: { visible: boolean }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
      <div
        className={`max-w-[900px] w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Section label */}
        <p className="font-display text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-6">
          SELECTED WORK
        </p>
        <h2 className="font-display text-[42px] font-bold text-foreground mb-12">
          Projects that think.
        </h2>

        {/* Project rows */}
        <div className="flex flex-col">
          {projects.map((project, i) => (
            <div
              key={project.number}
              className={`border-t border-border py-8 group cursor-default transition-all duration-200
                ${hoveredIdx === i ? 'bg-surface' : ''}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-display text-[11px] text-muted-foreground block mb-2">
                    {project.number}
                  </span>
                  <h3
                    className="font-display text-[28px] font-bold text-foreground transition-transform duration-200"
                    style={{
                      transform: hoveredIdx === i ? 'translateX(4px)' : 'translateX(0)',
                    }}
                  >
                    {project.name}
                  </h3>
                  <p className="font-body text-sm text-text-secondary mt-1">
                    {project.description}
                  </p>
                  <p className="font-body text-[11px] text-muted-foreground mt-2">
                    {project.stack}
                  </p>
                </div>
                <span
                  className="text-accent text-xl mt-4 transition-transform duration-200"
                  style={{
                    transform: hoveredIdx === i ? 'translateX(6px)' : 'translateX(0)',
                  }}
                >
                  →
                </span>
              </div>
            </div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}
