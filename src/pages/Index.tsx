import { useEffect, useState, useRef, useCallback } from 'react';
import CityScene from '@/components/CityScene';
import CustomCursor from '@/components/CustomCursor';
import HeroDistrict from '@/components/HeroDistrict';

const STALL_INFO: Record<string, { title: string; color: string; icon: string }> = {
  about:   { title: 'ABOUT',     color: '#6E6EFF', icon: '◈' },
  skills:  { title: 'EXPERTISE', color: '#00FF88', icon: '⬡' },
  work:    { title: 'WORK',      color: '#00D4FF', icon: '◻' },
  lab:     { title: 'LAB',       color: '#FF2D78', icon: '◈' },
  contact: { title: 'CONTACT',   color: '#6E6EFF', icon: '◎' },
};

const NAV_DOTS = [
  { label: 'Hero',    range: [0, 0.14] },
  { label: 'About',   range: [0.15, 0.34] },
  { label: 'Skills',  range: [0.35, 0.51] },
  { label: 'Work',    range: [0.52, 0.69] },
  { label: 'Contact', range: [0.70, 1.00] },
];

export default function Index() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStall, setActiveStall] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sp = scrollProgress;

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = Math.min(scrollTop / docHeight, 1);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!activeStall) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveStall(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeStall]);

  const handleStallClick = useCallback((id: string) => {
    if (id === 'contact') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      setActiveStall(id);
    }
  }, []);

  const scrollToProgress = useCallback((target: number) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: docHeight * target, behavior: 'smooth' });
  }, []);

  // Hero opacity: fade out between 0.10 and 0.15
  const heroOpacity = sp < 0.10 ? 1 : sp < 0.15 ? 1 - ((sp - 0.10) / 0.05) : 0;

  return (
    <div ref={containerRef} className="relative bg-background" style={{ height: '600vh' }}>
      <CustomCursor />
      <div className="scanlines" />
      <div className="scroll-progress" style={{ height: `${sp * 100}%` }} />
      <CityScene scrollProgress={sp} onStallClick={handleStallClick} />

      {/* Hero — fades out before About slides in */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10,
        opacity: heroOpacity,
        pointerEvents: sp < 0.12 ? 'auto' : 'none',
        transition: 'opacity 300ms ease',
      }}>
        <HeroDistrict />
      </div>

      {/* ─── Glass Panels (bottom-anchored, don't cover 3D city center) ─── */}
      <AboutPanel visible={sp >= 0.15 && sp < 0.34} />
      <SkillsPanel visible={sp >= 0.35 && sp < 0.51} />
      <WorkPanel visible={sp >= 0.52 && sp < 0.69} />

      {/* ─── Nav Dots ─── */}
      <NavDots sp={sp} onNavigate={scrollToProgress} />

      {/* ─── Footer ─── */}
      <div style={{
        position: 'fixed', bottom: '12px', left: '50%',
        transform: 'translateX(-50%)', zIndex: 10,
        opacity: sp > 0.95 ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 300ms',
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '11px', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#44445A',
        }}>© 2026 VITTORIA LANZO</p>
      </div>

      {/* ─── Scroll UX Indicators ─── */}
      {/* Entry invite: shown at very start before hero fades */}
      <EntryScrollInvite visible={sp < 0.08} />

      {/* Section advance hints — tell user what's coming next */}
      <SectionAdvanceHint visible={sp >= 0.08 && sp < 0.14} label="About" color="#6E6EFF" />
      <SectionAdvanceHint visible={sp >= 0.30 && sp < 0.35} label="Expertise" color="#00FF88" />
      <SectionAdvanceHint visible={sp >= 0.47 && sp < 0.52} label="Work" color="#00D4FF" />
      <SectionAdvanceHint visible={sp >= 0.65 && sp < 0.70} label="Lab" color="#FF2D78" />

      <ScrollHint visible={sp > 0.75 && sp < 0.92} />
      <BillboardFormOverlay visible={sp > 0.92} />
      <StallMenuOverlay activeStall={activeStall} onClose={() => setActiveStall(null)} />
    </div>
  );
}

/* ═══════════════════════════════════════
   GLASS PANEL (reusable)
   ═══════════════════════════════════════ */

interface GlassPanelProps {
  visible: boolean;
  side: 'left' | 'right';
  /** Which side the 3D stall is on — opposite to side. Used for arrow direction. */
  stallSide: 'left' | 'right';
  children: React.ReactNode;
}

function GlassPanel({ visible, side, stallSide, children }: GlassPanelProps) {
  // Arrow points toward the 3D stall (which is on the opposite side of the screen)
  const arrowDir = stallSide === 'left' ? '←' : '→';

  return (
    <div style={{
      position: 'fixed',
      // Bottom-anchored: keeps upper 3D city view unobstructed
      bottom: '24px',
      left: side === 'left' ? '24px' : 'auto',
      right: side === 'right' ? '24px' : 'auto',
      transform: visible
        ? 'translateY(0) translateX(0)'
        : `translateY(0) translateX(${side === 'left' ? '-120%' : '120%'})`,
      opacity: visible ? 1 : 0,
      transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease',
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 50,
      width: '340px',
      maxWidth: '38vw',
      maxHeight: '54vh',
      overflowY: 'auto',
      background: 'rgba(5, 5, 18, 0.84)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(110, 110, 255, 0.18)',
      borderRadius: '8px',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 -4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      backgroundImage: 'linear-gradient(rgba(5,5,18,0.84), rgba(5,5,18,0.84)), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
    }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #6E6EFF55, transparent)' }} />
      <div style={{ padding: '20px 24px' }}>{children}</div>
      {/* Stall locator arrow — points toward the physical panel in the 3D scene */}
      <div style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [stallSide === 'left' ? 'left' : 'right']: '-36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: '18px',
          color: '#6E6EFF', opacity: 0.7,
          animation: `stallArrowPulse${stallSide} 1.6s ease-in-out infinite`,
        }}>{arrowDir}</div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: '7px',
          color: '#44445A', letterSpacing: '0.1em', textTransform: 'uppercase',
          writingMode: 'vertical-lr',
          transform: stallSide === 'left' ? 'rotate(180deg)' : 'none',
        }}>panel</div>
      </div>
      <style>{`
        @keyframes stallArrowPulse${stallSide} {
          0%, 100% { opacity: 0.4; transform: translateY(-50%) translateX(0); }
          50% { opacity: 1; transform: translateY(-50%) translateX(${stallSide === 'left' ? '-4px' : '4px'}); }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 600,
      color: '#44445A', letterSpacing: '0.3em', textTransform: 'uppercase',
      marginBottom: '12px',
    }}>{label}</div>
  );
}

/* ─── About Panel ─── */
// About stall is on the LEFT side of the road → panel appears on the RIGHT
function AboutPanel({ visible }: { visible: boolean }) {
  return (
    <GlassPanel visible={visible} side="right" stallSide="left">
      <SectionLabel label="About" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '16px' }}>
        I make AI<br />think precisely.
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#8888AA', lineHeight: 1.8, marginBottom: '24px' }}>
        I design the cognitive layer between human intent and machine execution — building the prompts, pipelines, and agentic frameworks that make intelligent systems behave precisely.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '20px', borderTop: '1px solid #1E1E2E' }}>
        {[
          { n: '4+', l: 'Years in AI' },
          { n: '20+', l: 'Pipelines Built' },
          { n: '3', l: 'Languages' },
          { n: '∞', l: 'Prompts Engineered' },
        ].map(s => (
          <div key={s.l}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 700, color: '#6E6EFF', lineHeight: 1, marginBottom: '4px' }}>{s.n}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#44445A', letterSpacing: '0.05em' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ─── Skills Panel ─── */
// Expertise stall is on the RIGHT side of the road → panel appears on the LEFT
function SkillsPanel({ visible }: { visible: boolean }) {
  return (
    <GlassPanel visible={visible} side="left" stallSide="right">
      <SectionLabel label="Expertise" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '20px' }}>
        The tools<br />are language.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {[
          { heading: 'Core Practice', items: ['Prompt Engineering', 'Agentic Design', 'AI Systems Architecture', 'Chain-of-Thought Design', 'RAG Pipelines', 'Human-AI Interaction'] },
          { heading: 'Technical', items: ['Python', 'C', 'SQL', 'LaTeX', 'LLM Orchestration', 'Structured Outputs'] },
        ].map(col => (
          <div key={col.heading}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 600, color: '#44445A', letterSpacing: '0.2em', marginBottom: '12px', textTransform: 'uppercase' }}>{col.heading}</div>
            {col.items.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '4px', height: '4px', background: '#6E6EFF', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#8888AA' }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ─── Work Panel ─── */
// Work stall is on the LEFT side of the road → panel appears on the RIGHT
function WorkPanel({ visible }: { visible: boolean }) {
  return (
    <GlassPanel visible={visible} side="right" stallSide="left">
      <SectionLabel label="Selected Work" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '20px' }}>
        Projects<br />that think.
      </h2>
      {[
        { n: '01', name: 'PROJECT ONE', desc: 'Coming soon — details will be added here shortly.', stack: 'Stack · TBD' },
        { n: '02', name: 'PROJECT TWO', desc: 'Coming soon — details will be added here shortly.', stack: 'Stack · TBD' },
        { n: '03', name: 'PROJECT THREE', desc: 'Coming soon — details will be added here shortly.', stack: 'Stack · TBD' },
      ].map((p, i) => (
        <div key={p.n} style={{ paddingTop: i === 0 ? '0' : '16px', paddingBottom: '16px', borderBottom: '1px solid #1E1E2E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', color: '#44445A', letterSpacing: '0.2em', marginBottom: '4px' }}>{p.n}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#F0F0F5', marginBottom: '4px', letterSpacing: '0.05em' }}>{p.name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#8888AA', marginBottom: '6px', lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#44445A', letterSpacing: '0.05em' }}>{p.stack}</div>
            </div>
            <div style={{ color: '#6E6EFF', fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</div>
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

/* ─── Nav Dots ─── */
function NavDots({ sp, onNavigate }: { sp: number; onNavigate: (t: number) => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Nav dots are on the right; all panels now bottom-anchored so no conflict
  const hidden = false;

  return (
    <div style={{
      position: 'fixed', right: '20px', top: '50%',
      transform: 'translateY(-50%)', zIndex: 60,
      display: 'flex', flexDirection: 'column', gap: '14px',
      alignItems: 'center',
      opacity: hidden ? 0 : 1,
      transition: 'opacity 300ms',
      pointerEvents: hidden ? 'none' : 'auto',
    }}>
      {NAV_DOTS.map((dot, i) => {
        const active = sp >= dot.range[0] && sp <= dot.range[1];
        return (
          <div key={dot.label} style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <button
              onClick={() => onNavigate((dot.range[0] + dot.range[1]) / 2)}
              style={{
                width: active ? '8px' : '6px',
                height: active ? '8px' : '6px',
                borderRadius: '50%',
                background: active ? '#6E6EFF' : '#1E1E2E',
                border: active ? 'none' : '1px solid #2A2A3A',
                cursor: 'pointer',
                transition: 'all 200ms',
                transform: active ? 'scale(1.4)' : 'scale(1)',
                padding: 0,
              }}
            />
            {hoveredIdx === i && (
              <div style={{
                position: 'absolute', right: '16px', top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: "'Syne', sans-serif", fontSize: '9px',
                color: '#6E6EFF', letterSpacing: '0.2em',
                whiteSpace: 'nowrap', pointerEvents: 'none',
              }}>{dot.label.toUpperCase()}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Scroll Hint ─── */
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: 'all 400ms ease',
      pointerEvents: 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '8px', zIndex: 90,
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', color: '#6E6EFF', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Keep scrolling</div>
      <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, #6E6EFF, transparent)', animation: 'pulse 1.5s ease infinite' }} />
    </div>
  );
}

/* ─── Entry Scroll Invite (shown at page start) ─── */
function EntryScrollInvite({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '40px', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 600ms ease, transform 600ms ease',
      pointerEvents: 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '10px', zIndex: 90,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: '10px',
        color: '#6E6EFF', letterSpacing: '0.35em', textTransform: 'uppercase',
      }}>Scroll to explore</div>
      {/* Animated chevrons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '10px', height: '10px',
            borderRight: '1.5px solid #6E6EFF',
            borderBottom: '1.5px solid #6E6EFF',
            transform: 'rotate(45deg)',
            opacity: 0,
            animation: `chevronFade 1.4s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes chevronFade {
          0%, 100% { opacity: 0; transform: rotate(45deg) translateY(-3px); }
          50% { opacity: 0.9; transform: rotate(45deg) translateY(2px); }
        }
      `}</style>
    </div>
  );
}

/* ─── Section Advance Hint (tells user what's next) ─── */
function SectionAdvanceHint({ visible, label, color }: { visible: boolean; label: string; color: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 400ms ease, transform 400ms ease',
      pointerEvents: 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '6px', zIndex: 88,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '1px', background: color, opacity: 0.5 }} />
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: '9px',
          color, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8,
        }}>scroll down · {label}</div>
        <div style={{ width: '20px', height: '1px', background: color, opacity: 0.5 }} />
      </div>
      <div style={{
        width: '1px', height: '22px',
        background: `linear-gradient(to bottom, ${color}, transparent)`,
        animation: 'pulse 1.5s ease infinite',
      }} />
    </div>
  );
}

/* ─── Billboard Form Overlay ─── */
function BillboardFormOverlay({ visible }: { visible: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', email: '', message: '' }); }, 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#0F0F1A', border: '1px solid #1E1E2E',
    borderRadius: '6px', color: '#F0F0F5',
    fontFamily: "'Inter', sans-serif", fontSize: '13px',
    padding: '10px 12px', marginBottom: '10px',
    outline: 'none', transition: 'border-color 200ms',
  };

  return (
    <div style={{
      position: 'fixed', bottom: '5vh', left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(40px)',
      zIndex: 100, opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 500ms ease, transform 500ms ease',
      width: '460px', maxWidth: '92vw', maxHeight: '85vh', overflowY: 'auto',
      background: 'rgba(8,8,20,0.97)',
      border: '1px solid #6E6EFF', borderRadius: '12px', padding: '32px',
      boxShadow: '0 0 60px rgba(110,110,255,0.15)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    }}>
      <button
        onClick={() => window.scrollTo({ top: window.scrollY - window.innerHeight * 0.15, behavior: 'smooth' })}
        style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: '1px solid #1E1E2E',
          color: '#8888AA', width: '28px', height: '28px',
          borderRadius: '50%', cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", fontSize: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#6E6EFF'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#1E1E2E'; }}
      >×</button>

      <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid #6E6EFF', background: '#0F0F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 700, color: '#6E6EFF', margin: '0 auto 12px' }}>VL</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', color: '#F0F0F5', textAlign: 'center', letterSpacing: '0.15em', marginBottom: '4px' }}>VITTORIA LANZO</div>
      <div style={{ fontSize: '11px', color: '#8888AA', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '20px' }}>AI Prompt Engineer · Agentic Systems Designer</div>
      <div style={{ height: '1px', background: '#1E1E2E', marginBottom: '20px' }} />
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '22px', color: '#F0F0F5', marginBottom: '6px' }}>Start a conversation.</div>
      <div style={{ fontSize: '13px', color: '#8888AA', marginBottom: '20px' }}>Open to collaborations and AI architecture consulting.</div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6E6EFF'; }} onBlur={e => { e.target.style.borderColor = '#1E1E2E'; }} />
        <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#6E6EFF'; }} onBlur={e => { e.target.style.borderColor = '#1E1E2E'; }} />
        <textarea placeholder="Describe your vision..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, height: '90px', resize: 'none' }} onFocus={e => { e.target.style.borderColor = '#6E6EFF'; }} onBlur={e => { e.target.style.borderColor = '#1E1E2E'; }} />
        <button type="submit" style={{ width: '100%', background: '#6E6EFF', color: 'white', border: 'none', borderRadius: '6px', fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 500, letterSpacing: '0.05em', padding: '13px', cursor: 'pointer', marginTop: '4px' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8A8AFF'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = '#6E6EFF'; }}
        >{sent ? 'Sent ✓' : 'Send Message'}</button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
        {(['GitHub', 'LinkedIn', 'X'] as const).map(p => (
          <a key={p} href="#" style={{ fontSize: '11px', color: '#44445A', letterSpacing: '0.15em', textDecoration: 'none' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#8888AA'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#44445A'; }}
          >{p}</a>
        ))}
      </div>
    </div>
  );
}

/* ─── Stall Menu Overlay (glass style) ─── */
function StallMenuOverlay({ activeStall, onClose }: { activeStall: string | null; onClose: () => void }) {
  const info = activeStall ? STALL_INFO[activeStall] : null;

  useEffect(() => {
    if (!activeStall) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeStall, onClose]);

  const stallColor = info?.color ?? '#6E6EFF';

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: activeStall ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
      opacity: activeStall ? 1 : 0,
      pointerEvents: activeStall ? 'auto' : 'none',
      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 200, width: '340px', maxWidth: '90vw',
      background: 'rgba(5, 5, 18, 0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${stallColor}33`,
      borderRadius: '8px', padding: '32px',
      boxShadow: `0 0 40px ${stallColor}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}>
      <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${stallColor}55, transparent)`, marginBottom: '0', position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '8px 8px 0 0' }} />
      <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', color: '#8888AA', fontSize: '18px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>×</button>
      {info && (
        <>
          <div style={{ fontSize: '32px', color: stallColor, marginBottom: '16px', textAlign: 'center' }}>{info.icon}</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '28px', color: '#F0F0F5', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '12px' }}>{info.title}</div>
          <div style={{ height: '1px', background: stallColor, opacity: 0.3, marginBottom: '16px' }} />
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#8888AA', lineHeight: 1.7, textAlign: 'center' }}>
            This section is under construction.<br />Check back soon — something is being built here.
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: `1px solid ${stallColor}44`, borderRadius: '20px', fontFamily: "'Syne', sans-serif", fontSize: '10px', letterSpacing: '0.2em', color: stallColor }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stallColor, animation: 'pulse 1.5s infinite' }} />
              COMING SOON
            </span>
          </div>
        </>
      )}
    </div>
  );
}

