import { useEffect, useState, useCallback } from 'react';

const roles = [
  'AI Prompt Engineer',
  'Agentic Systems Designer',
  'I make AI think precisely.',
];

export default function HeroDistrict() {
  const [displayText, setDisplayText] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const role = roles[roleIdx];
    let i = 0;
    let typing = true;

    const interval = setInterval(() => {
      if (typing) {
        setDisplayText(role.slice(0, i + 1));
        i++;
        if (i >= role.length) {
          typing = false;
          setTimeout(() => {
            const eraseInterval = setInterval(() => {
              i--;
              setDisplayText(role.slice(0, i));
              if (i <= 0) {
                clearInterval(eraseInterval);
                setRoleIdx(prev => (prev + 1) % roles.length);
              }
            }, 30);
          }, 2000);
          clearInterval(interval);
        }
      }
    }, 80);

    return () => clearInterval(interval);
  }, [roleIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <section className="relative z-10 flex items-center justify-center min-h-screen px-4">
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
            onClick={scrollDown}
            className="font-display text-[13px] font-medium tracking-[0.1em] uppercase text-foreground border border-border px-7 py-3 rounded-md hover:border-accent hover:text-accent transition-all duration-200"
          >
            View Work
          </button>
          <a
            href="#contact"
            className="font-body text-[13px] tracking-wide text-text-secondary hover:text-foreground transition-colors duration-200"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
