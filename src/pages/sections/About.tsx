import SectionShell from './SectionShell';
import { ABOUT } from '../../content/sections';

const COLOR = '#6E6EFF';

export default function About() {
  return (
    <SectionShell num="01" label="ABOUT" color={COLOR} nextPath="/skills" nextLabel="EXPERTISE">

      {/* ── Tagline ── */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '10px',
        color: '#44445A',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        marginBottom: '24px',
      }}>
        {ABOUT.tagline}
      </div>

      {/* ── Headline ── */}
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(40px, 7vw, 72px)',
        fontWeight: 700,
        color: '#F0F0F5',
        lineHeight: 1.1,
        marginBottom: '32px',
        whiteSpace: 'pre-line',
      }}>
        {ABOUT.headline}
      </h1>

      {/* ── Bio ── */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '16px',
        color: '#8888AA',
        lineHeight: 1.9,
        maxWidth: '560px',
        marginBottom: '56px',
      }}>
        {ABOUT.bio}
      </p>

      {/* ── Stats grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        paddingTop: '32px',
        borderTop: '1px solid #1E1E2E',
        marginBottom: '64px',
      }}>
        {ABOUT.stats.map(s => (
          <div key={s.label}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '40px',
              fontWeight: 700,
              color: COLOR,
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              color: '#44445A',
              letterSpacing: '0.05em',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Experience timeline (populated from sections.ts) ── */}
      {ABOUT.experiences.length > 0 && (
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '10px',
            color: '#44445A',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            Experience
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {ABOUT.experiences.map((exp, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 1fr',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '11px',
                  color: '#44445A',
                  letterSpacing: '0.1em',
                  paddingTop: '2px',
                }}>
                  {exp.year}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#F0F0F5',
                    marginBottom: '2px',
                  }}>
                    {exp.role}
                  </div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: COLOR,
                    marginBottom: '8px',
                  }}>
                    {exp.org}
                  </div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    color: '#8888AA',
                    lineHeight: 1.75,
                  }}>
                    {exp.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </SectionShell>
  );
}
