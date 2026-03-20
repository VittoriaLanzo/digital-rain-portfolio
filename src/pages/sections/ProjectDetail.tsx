import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WORK } from '@/content/sections';

const COLOR = '#00D4FF';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = WORK.projects.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!project) navigate('/work');
  }, [project, navigate]);

  if (!project) return null;

  const projectIndex = WORK.projects.findIndex(p => p.slug === slug);
  const next = WORK.projects[projectIndex + 1] ?? null;

  return (
    <div style={{ minHeight: '100vh', background: '#050512', color: '#F0F0F5', position: 'relative' }}>

      {/* Scanlines */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 3px)',
      }} />

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px',
        background: 'rgba(5,5,18,0.92)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E1E2E',
      }}>
        <button
          onClick={() => navigate('/work')}
          style={{
            background: 'none', border: '1px solid #1E1E2E', borderRadius: '6px',
            color: '#8888AA', padding: '7px 16px',
            fontFamily: "'Syne', sans-serif", fontSize: '11px', letterSpacing: '0.2em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'border-color 200ms, color 200ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = COLOR;
            (e.currentTarget as HTMLElement).style.color = COLOR;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#1E1E2E';
            (e.currentTarget as HTMLElement).style.color = '#8888AA';
          }}
        >← WORK</button>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: '10px',
          letterSpacing: '0.3em', color: COLOR, opacity: 0.8,
        }}>
          {project.id} · PROJECT
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 40px 80px' }}>

        {/* Number + year */}
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: '11px',
          color: '#44445A', letterSpacing: '0.25em', marginBottom: '16px',
        }}>
          {project.id} · {project.year}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 700, color: '#F0F0F5',
          lineHeight: 1.1, marginBottom: '32px',
        }}>
          {project.name}
        </h1>

        {/* Stack chips */}
        {project.stack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
            {project.stack.map(s => (
              <span
                key={s}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '11px',
                  color: COLOR, padding: '4px 10px',
                  border: `1px solid ${COLOR}44`, borderRadius: '3px',
                  letterSpacing: '0.05em',
                }}
              >{s}</span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: '#1E1E2E', marginBottom: '40px' }} />

        {/* Short desc */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: '18px',
          fontWeight: 600, color: '#CCCCEE', lineHeight: 1.5,
          marginBottom: '32px',
        }}>
          {project.desc}
        </p>

        {/* Long description */}
        {project.longDesc && (
          <div style={{ marginBottom: '48px' }}>
            {project.longDesc.split('\n\n').map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '15px',
                  color: '#8888AA', lineHeight: 1.85,
                  marginBottom: '20px',
                }}
              >{para}</p>
            ))}
          </div>
        )}

        {/* External link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: "'Syne', sans-serif", fontSize: '12px',
              letterSpacing: '0.15em', color: COLOR,
              border: `1px solid ${COLOR}44`, borderRadius: '6px',
              padding: '10px 20px', textDecoration: 'none',
              transition: 'background 200ms, border-color 200ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${COLOR}18`;
              (e.currentTarget as HTMLElement).style.borderColor = COLOR;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = `${COLOR}44`;
            }}
          >
            VIEW PROJECT ↗
          </a>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: '1px solid #1E1E2E',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '720px', margin: '0 auto',
      }}>
        <button
          onClick={() => navigate('/work')}
          style={{
            background: 'none', border: 'none',
            color: '#8888AA', fontFamily: "'Syne', sans-serif",
            fontSize: '11px', letterSpacing: '0.2em', cursor: 'pointer',
            transition: 'color 200ms',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = COLOR; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8888AA'; }}
        >← BACK TO CITY</button>

        {next && (
          <button
            onClick={() => navigate(`/work/${next.slug}`)}
            style={{
              background: 'transparent', border: `1px solid ${COLOR}33`,
              borderRadius: '6px', fontFamily: "'Syne', sans-serif",
              fontSize: '11px', letterSpacing: '0.2em',
              color: COLOR, padding: '7px 16px', cursor: 'pointer',
              transition: 'background 200ms, border-color 200ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${COLOR}18`;
              (e.currentTarget as HTMLElement).style.borderColor = COLOR;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = `${COLOR}33`;
            }}
          >
            {next.name} →
          </button>
        )}
      </div>
    </div>
  );
}
