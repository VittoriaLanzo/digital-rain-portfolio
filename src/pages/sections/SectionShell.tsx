/* ─── SectionShell ─────────────────────────────────────────────────────────
   Shared layout wrapper for every section page.
   Provides: sticky header with back-to-city button, max-width content
   column, and a bottom nav row with prev/next links.
   ─────────────────────────────────────────────────────────────────────── */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SectionShellProps {
  /** e.g. '01' */
  num: string;
  /** e.g. 'ABOUT' */
  label: string;
  /** Accent color for this section */
  color: string;
  /** Route path for the "next" button, e.g. '/skills' */
  nextPath?: string;
  /** Label for the next button, e.g. 'EXPERTISE' */
  nextLabel?: string;
  children: React.ReactNode;
}

export default function SectionShell({
  num,
  label,
  color,
  nextPath,
  nextLabel,
  children,
}: SectionShellProps) {
  const navigate = useNavigate();

  // Always start at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050512', color: '#F0F0F5', position: 'relative' }}>

      {/* Scanlines overlay (non-interactive) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 3px)',
      }} />

      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        background: 'rgba(5,5,18,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E1E2E',
      }}>
        <BackBtn color={color} onClick={() => navigate('/')} />
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '10px',
          letterSpacing: '0.3em',
          color,
          opacity: 0.8,
        }}>
          {num} · {label}
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 40px 80px' }}>
        {children}
      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        borderTop: '1px solid #1E1E2E',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '720px',
        margin: '0 auto',
      }}>
        <BackBtn color={color} onClick={() => navigate('/')} small />
        {nextPath && nextLabel && (
          <button
            onClick={() => navigate(nextPath)}
            style={nextBtnStyle(color)}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${color}18`;
              (e.currentTarget as HTMLElement).style.borderColor = color;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = `${color}33`;
            }}
          >
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────── */

function BackBtn({ color, onClick, small }: { color: string; onClick: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: small ? 'none' : '1px solid #1E1E2E',
        borderRadius: '6px',
        color: '#8888AA',
        padding: small ? '0' : '7px 16px',
        fontFamily: "'Syne', sans-serif",
        fontSize: '11px',
        letterSpacing: '0.2em',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'border-color 200ms, color 200ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = color;
        (e.currentTarget as HTMLElement).style.color = color;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = small ? 'transparent' : '#1E1E2E';
        (e.currentTarget as HTMLElement).style.color = '#8888AA';
      }}
    >
      ← BACK TO CITY
    </button>
  );
}

function nextBtnStyle(color: string): React.CSSProperties {
  return {
    background: 'transparent',
    border: `1px solid ${color}33`,
    borderRadius: '6px',
    fontFamily: "'Syne', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.2em',
    color,
    padding: '7px 16px',
    cursor: 'pointer',
    transition: 'background 200ms, border-color 200ms',
  };
}
