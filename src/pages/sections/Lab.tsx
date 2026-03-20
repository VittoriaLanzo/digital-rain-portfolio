import SectionShell from './SectionShell';
import { LAB, ExperimentStatus } from '../../content/sections';

const COLOR = '#FF2D78';

const STATUS_COLOR: Record<ExperimentStatus, string> = {
  active:   '#00FF88',
  wip:      '#FFB800',
  archived: '#44445A',
};

export default function Lab() {
  return (
    <SectionShell num="04" label="LAB" color={COLOR}>

      {/* ── Headline ── */}
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(40px, 7vw, 72px)',
        fontWeight: 700,
        color: '#F0F0F5',
        lineHeight: 1.1,
        marginBottom: '20px',
        whiteSpace: 'pre-line',
      }}>
        {LAB.headline}
      </h1>

      {/* ── Tagline ── */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '16px',
        color: '#8888AA',
        lineHeight: 1.9,
        marginBottom: '56px',
      }}>
        {LAB.tagline}
      </p>

      {/* ── Experiments list ── */}
      {LAB.experiments.length > 0 ? (
        <div>
          {LAB.experiments.map((exp, i) => (
            <div
              key={i}
              style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid #1E1E2E',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              {/* Status dot */}
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: STATUS_COLOR[exp.status],
                flexShrink: 0,
                marginTop: '7px',
              }} />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#F0F0F5',
                  marginBottom: '6px',
                }}>
                  {exp.name}
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

              {/* Status badge */}
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '9px',
                color: STATUS_COLOR[exp.status],
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                flexShrink: 0,
                paddingTop: '3px',
              }}>
                {exp.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty-state placeholder */
        <div style={{
          padding: '48px 32px',
          border: '1px solid #1E1E2E',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '28px',
            marginBottom: '16px',
            opacity: 0.3,
          }}>
            ◈
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '11px',
            color: '#44445A',
            letterSpacing: '0.25em',
            marginBottom: '12px',
          }}>
            STAND BY
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#44445A',
          }}>
            Add experiments in{' '}
            <code style={{ color: COLOR }}>src/content/sections.ts</code>
          </div>
        </div>
      )}

    </SectionShell>
  );
}
