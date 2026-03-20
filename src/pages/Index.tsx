import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CityScene from '@/components/CityScene';
import CustomCursor from '@/components/CustomCursor';
import HeroDistrict from '@/components/HeroDistrict';
import { ABOUT, SKILLS, WORK } from '@/content/sections';

/* ─── Nav dot definitions ──────────────────────────────────────────────── */
const NAV_DOTS = [
  { label: 'Hero',    range: [0,    0.14] },
  { label: 'About',   range: [0.15, 0.34] },
  { label: 'Skills',  range: [0.35, 0.51] },
  { label: 'Work',    range: [0.52, 0.69] },
  { label: 'Contact', range: [0.70, 1.00] },
];

/* ═══════════════════════════════════════
   INDEX PAGE
   ═══════════════════════════════════════ */
export default function Index() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sp = scrollProgress;

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    setScrollProgress(Math.min(scrollTop / docHeight, 1));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Stall click → navigate to section page */
  const handleStallClick = useCallback((id: string) => {
    if (id === 'contact') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    } else {
      navigate(`/${id}`);
    }
  }, [navigate]);

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

      {/* ─── Glass Panels ───────────────────────────────────────────────────
           Timing derived from camera path z(t)=30-231.25t vs stall positions.
           Windows use stall midpoints as boundaries → only ONE panel visible.
           About   stall z=-20  →  panel: 0.09–0.29
           Skills  stall z=-55  →  panel: 0.29–0.44
           Work    stall z=-90  →  panel: 0.44–0.59
      ─────────────────────────────────────────────────────────────────── */}
      <AboutPanel  visible={sp >= 0.09 && sp < 0.29} onEnter={() => navigate('/about')} />
      <SkillsPanel visible={sp >= 0.29 && sp < 0.44} onEnter={() => navigate('/skills')} />
      <WorkPanel   visible={sp >= 0.44 && sp < 0.59} onEnter={() => navigate('/work')} />

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
      <EntryScrollInvite visible={sp < 0.07} />
      <SectionAdvanceHint visible={sp >= 0.07 && sp < 0.09} label="About"   color="#6E6EFF" />
      <SectionAdvanceHint visible={sp >= 0.60 && sp < 0.68} label="Lab"     color="#FF2D78" />
      <SectionAdvanceHint visible={sp >= 0.75 && sp < 0.82} label="Contact" color="#6E6EFF" />
      <ScrollHint         visible={sp >= 0.82 && sp < 0.93} />
      <BillboardFormOverlay visible={sp > 0.92} />
    </div>
  );
}

/* ═══════════════════════════════════════
   GLASS PANEL (shared wrapper)
   ═══════════════════════════════════════ */

interface GlassPanelProps {
  visible: boolean;
  side: 'left' | 'right';
  /** Which side the 3D stall is on — arrow points that way */
  stallSide: 'left' | 'right';
  /** Accent color for the Enter button + top glow line */
  color: string;
  /** Called when the user clicks "Enter ↗" */
  onEnter: () => void;
  children: React.ReactNode;
}

function GlassPanel({ visible, side, stallSide, color, onEnter, children }: GlassPanelProps) {
  const arrowDir = stallSide === 'left' ? '←' : '→';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left:  side === 'left'  ? '24px' : 'auto',
      right: side === 'right' ? '24px' : 'auto',
      transform: visible
        ? 'translateX(0)'
        : `translateX(${side === 'left' ? '-120%' : '120%'})`,
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
    }}>
      {/* Top glow line */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }} />

      <div style={{ padding: '20px 24px' }}>
        {children}

        {/* ── Enter CTA ── */}
        <button
          onClick={onEnter}
          style={{
            marginTop: '20px',
            width: '100%',
            background: 'transparent',
            border: `1px solid ${color}44`,
            borderRadius: '5px',
            color,
            fontFamily: "'Syne', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.2em',
            padding: '9px 0',
            cursor: 'pointer',
            transition: 'background 200ms, border-color 200ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = `${color}18`;
            (e.currentTarget as HTMLElement).style.borderColor = color;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = `${color}44`;
          }}
        >
          ENTER ↗
        </button>
      </div>

      {/* Stall locator arrow */}
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

function SectionLabel({ label, color = '#44445A' }: { label: string; color?: string }) {
  return (
    <div style={{
      fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 600,
      color, letterSpacing: '0.3em', textTransform: 'uppercase',
      marginBottom: '12px',
    }}>{label}</div>
  );
}

/* ─── About Panel ─── */
function AboutPanel({ visible, onEnter }: { visible: boolean; onEnter: () => void }) {
  return (
    <GlassPanel visible={visible} side="right" stallSide="left" color="#6E6EFF" onEnter={onEnter}>
      <SectionLabel label="About" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '16px' }}>
        {ABOUT.headline.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#8888AA', lineHeight: 1.8, marginBottom: '24px' }}>
        {ABOUT.bio}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '20px', borderTop: '1px solid #1E1E2E' }}>
        {ABOUT.stats.map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 700, color: '#6E6EFF', lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#44445A', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ─── Skills Panel ─── */
function SkillsPanel({ visible, onEnter }: { visible: boolean; onEnter: () => void }) {
  return (
    <GlassPanel visible={visible} side="left" stallSide="right" color="#00FF88" onEnter={onEnter}>
      <SectionLabel label="Expertise" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '20px' }}>
        {SKILLS.headline.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {SKILLS.categories.map(cat => (
          <div key={cat.name}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 600, color: '#44445A', letterSpacing: '0.2em', marginBottom: '12px', textTransform: 'uppercase' }}>{cat.name}</div>
            {cat.items.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '4px', height: '4px', background: cat.color, flexShrink: 0 }} />
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
function WorkPanel({ visible, onEnter }: { visible: boolean; onEnter: () => void }) {
  return (
    <GlassPanel visible={visible} side="right" stallSide="left" color="#00D4FF" onEnter={onEnter}>
      <SectionLabel label="Selected Work" />
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 700, color: '#F0F0F5', lineHeight: 1.2, marginBottom: '20px' }}>
        {WORK.headline.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </h2>
      {WORK.projects.map((p, i) => (
        <div key={p.id} style={{ paddingTop: i === 0 ? '0' : '16px', paddingBottom: '16px', borderBottom: '1px solid #1E1E2E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', color: '#44445A', letterSpacing: '0.2em', marginBottom: '4px' }}>{p.id}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#F0F0F5', marginBottom: '4px', letterSpacing: '0.05em' }}>{p.name}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#8888AA', marginBottom: '6px', lineHeight: 1.5 }}>{p.desc}</div>
              {p.stack.length > 0 && (
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: '#44445A', letterSpacing: '0.05em' }}>{p.stack.join(' · ')}</div>
              )}
            </div>
            <div style={{ color: '#00D4FF', fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</div>
          </div>
        </div>
      ))}
    </GlassPanel>
  );
}

/* ─── Nav Dots ─── */
function NavDots({ sp, onNavigate }: { sp: number; onNavigate: (t: number) => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div style={{
      position: 'fixed', right: '20px', top: '50%',
      transform: 'translateY(-50%)', zIndex: 60,
      display: 'flex', flexDirection: 'column', gap: '14px',
      alignItems: 'center',
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
                width: active ? '8px' : '6px', height: active ? '8px' : '6px',
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

/* ─── Entry Scroll Invite ─── */
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

/* ─── Section Advance Hint ─── */
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
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', color, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8 }}>
          scroll down · {label}
        </div>
        <div style={{ width: '20px', height: '1px', background: color, opacity: 0.5 }} />
      </div>
      <div style={{ width: '1px', height: '22px', background: `linear-gradient(to bottom, ${color}, transparent)`, animation: 'pulse 1.5s ease infinite' }} />
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
