import { useEffect, useState } from 'react';

function scrollToProgress(p: number) {
  const d = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: d * p, behavior: 'smooth' });
}

const roles = [
  'Product Designer & Frontend Engineer',
  'AI Systems Architect',
  'I ship the part most people split into three jobs.',
];

export default function HeroDistrict() {
  const [displayText, setDisplayText] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const role = roles[roleIdx];
    let i = 0;
    let typeId: ReturnType<typeof setInterval> | null = null;
    let pauseId: ReturnType<typeof setTimeout> | null = null;
    let eraseId: ReturnType<typeof setInterval> | null = null;

    typeId = setInterval(() => {
      setDisplayText(role.slice(0, i + 1));
      i++;
      if (i >= role.length) {
        clearInterval(typeId!);
        typeId = null;
        pauseId = setTimeout(() => {
          pauseId = null;
          eraseId = setInterval(() => {
            i--;
            setDisplayText(role.slice(0, i));
            if (i <= 0) {
              clearInterval(eraseId!);
              eraseId = null;
              setRoleIdx(prev => (prev + 1) % roles.length);
            }
          }, 30);
        }, 2000);
      }
    }, 80);

    return () => {
      if (typeId !== null) clearInterval(typeId);
      if (pauseId !== null) clearTimeout(pauseId);
      if (eraseId !== null) clearInterval(eraseId);
    };
  }, [roleIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative z-10 flex items-center justify-center min-h-screen px-4">
      {/* Decorative arc elements — partial circumference strokes */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Arc 1 — large, upper-left, ~1/4 arc (r=210, circ≈1319) */}
        <circle cx="140" cy="170" r="210" stroke="#00D4FF" strokeWidth="1.2" fill="none"
          strokeDasharray="330 989" strokeDashoffset="-60" opacity="0.22" />
        {/* Arc 2 — medium, right-center, ~1/3 arc (r=130, circ≈817) */}
        <circle cx="1360" cy="540" r="130" stroke="#00D4FF" strokeWidth="1.5" fill="none"
          strokeDasharray="272 545" strokeDashoffset="50" opacity="0.20" />
        {/* Arc 3 — small, lower-left, ~1/3 arc (r=78, circ≈490) */}
        <circle cx="280" cy="860" r="78" stroke="#00D4FF" strokeWidth="0.8" fill="none"
          strokeDasharray="163 327" strokeDashoffset="-25" opacity="0.14" />
      </svg>
      <div className="text-center max-w-4xl">
        <h1
          className={`font-display text-[40px] sm:text-6xl md:text-[72px] font-extrabold tracking-[0.08em] uppercase text-foreground glitch-text ${isGlitching ? 'glitching' : ''}`}
          style={{ textShadow: '0 0 40px rgba(110, 110, 255, 0.3)' }}
          data-text="VITTORIA LANZO"
        >
          VITTORIA LANZO
        </h1>

        <div className="mt-6 h-8 text-lg sm:text-xl tracking-wide">
          <span className="text-text-secondary font-body">{displayText}</span>
          <span className="typewriter-cursor" />
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-16">
          <button
            onClick={() => scrollToProgress(0.46)}
            className="font-display text-[13px] font-medium tracking-[0.1em] uppercase text-foreground border border-border px-7 py-3 rounded-md hover:border-accent hover:text-accent transition-all duration-200"
          >
            View Work
          </button>
          <button
            onClick={() => scrollToProgress(0.93)}
            className="font-body text-[13px] tracking-wide text-text-secondary hover:text-foreground transition-colors duration-200"
          >
            Get in touch
          </button>
        </div>
      </div>
    </section>
  );
}
