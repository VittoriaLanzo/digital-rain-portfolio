import SectionShell from './SectionShell';
import { SKILLS } from '../../content/sections';

const COLOR = '#00FF88';

export default function Skills() {
  return (
    <SectionShell num="02" label="EXPERTISE" color={COLOR} nextPath="/work" nextLabel="WORK">

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
        {SKILLS.headline}
      </h1>

      {/* ── Skill categories ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
        {SKILLS.categories.map(cat => (
          <div key={cat.name}>

            {/* Category label */}
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              color: cat.color,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              {cat.name}
            </div>

            {/* Skill chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {cat.items.map(item => (
                <div
                  key={item}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    color: '#8888AA',
                    padding: '8px 18px',
                    border: `1px solid ${cat.color}22`,
                    borderRadius: '4px',
                    transition: 'border-color 200ms, color 200ms',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                    (e.currentTarget as HTMLElement).style.color = '#F0F0F5';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}22`;
                    (e.currentTarget as HTMLElement).style.color = '#8888AA';
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </SectionShell>
  );
}
