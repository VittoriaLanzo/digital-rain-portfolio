import { useNavigate } from 'react-router-dom';
import SectionShell from './SectionShell';
import { WORK } from '../../content/sections';

const COLOR = '#00D4FF';

export default function Work() {
  const navigate = useNavigate();
  return (
    <SectionShell num="03" label="WORK" color={COLOR} nextPath="/lab" nextLabel="LAB">

      {/* ── Headline ── */}
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(40px, 7vw, 72px)',
        fontWeight: 700,
        color: '#F0F0F5',
        lineHeight: 1.1,
        marginBottom: '56px',
        whiteSpace: 'pre-line',
      }}>
        {WORK.headline}
      </h1>

      {/* ── Project list ── */}
      <div>
        {WORK.projects.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/work/${p.slug}`)}
            style={{
              paddingTop: '28px',
              paddingBottom: '28px',
              borderTop: '1px solid #1E1E2E',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderTopColor = `${COLOR}44`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderTopColor = '#1E1E2E'; }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <div style={{ flex: 1 }}>

                {/* Number + year */}
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '10px',
                  color: '#44445A',
                  letterSpacing: '0.2em',
                  marginBottom: '6px',
                }}>
                  {p.id} · {p.year}
                </div>

                {/* Project name */}
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#F0F0F5',
                  marginBottom: '10px',
                  letterSpacing: '0.03em',
                }}>
                  {p.name}
                </div>

                {/* Description */}
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: '#8888AA',
                  lineHeight: 1.75,
                  marginBottom: p.stack.length > 0 ? '14px' : 0,
                }}>
                  {p.desc}
                </div>

                {/* Stack chips */}
                {p.stack.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.stack.map(s => (
                      <span
                        key={s}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '10px',
                          color: '#44445A',
                          padding: '3px 8px',
                          border: '1px solid #1E1E2E',
                          borderRadius: '3px',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Detail page arrow */}
              <div style={{
                color: COLOR, fontSize: '20px',
                flexShrink: 0, marginTop: '28px',
                transition: 'transform 200ms',
              }}>
                →
              </div>
            </div>
          </div>
        ))}

        {/* Hint when array is empty */}
        {WORK.projects.length === 0 && (
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#44445A',
            paddingTop: '28px',
            borderTop: '1px solid #1E1E2E',
          }}>
            No projects yet — add them in{' '}
            <code style={{ color: COLOR }}>src/content/sections.ts</code>
          </div>
        )}
      </div>

    </SectionShell>
  );
}
