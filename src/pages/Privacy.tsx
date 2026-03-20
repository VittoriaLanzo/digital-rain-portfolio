import { useNavigate } from 'react-router-dom';

const LAST_UPDATED = 'March 20, 2026';

// Bot-safe email: assembled at interaction time, never a complete string in source
function ContactLink({ label }: { label?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const u = 'lanzo' + '.' + 'vittoria';
    const d = 'gmail' + '.' + 'com';
    window.location.href = 'mailto:' + u + '@' + d;
  };
  return (
    <a href="#" onClick={handleClick} style={{ color: '#6E6EFF', textDecoration: 'none' }}>
      {label ?? 'contact me by email'}
    </a>
  );
}

export default function Privacy() {
  const navigate = useNavigate();

  const heading: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '18px',
    color: '#F0F0F5', letterSpacing: '0.05em', marginTop: '32px', marginBottom: '12px',
  };
  const body: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#8888AA',
    lineHeight: 1.85, marginBottom: '16px',
  };
  const list: React.CSSProperties = { ...body, paddingLeft: '20px' };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050512',
      display: 'flex', justifyContent: 'center',
      padding: '60px 20px 80px',
    }}>
      <div style={{
        width: '680px', maxWidth: '100%',
        background: 'rgba(5, 5, 18, 0.82)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(110, 110, 255, 0.15)',
        borderRadius: '12px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        backgroundImage: 'linear-gradient(rgba(5,5,18,0.82), rgba(5,5,18,0.82)), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
      }}>
        {/* Accent line */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #6E6EFF55, transparent)', borderRadius: '12px 12px 0 0' }} />

        <div style={{ padding: '40px 36px' }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: '1px solid #1E1E2E', borderRadius: '20px',
              color: '#6E6EFF', fontFamily: "'Syne', sans-serif", fontSize: '10px',
              letterSpacing: '0.2em', padding: '6px 16px', cursor: 'pointer',
              marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#6E6EFF'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#1E1E2E'; }}
          >
            ← BACK TO CITY
          </button>

          {/* Section label */}
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 600,
            color: '#44445A', letterSpacing: '0.3em', textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Legal</div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '32px',
            color: '#F0F0F5', lineHeight: 1.2, marginBottom: '8px',
          }}>Privacy Policy</h1>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#44445A', marginBottom: '28px' }}>
            Last updated: {LAST_UPDATED}
          </p>

          <div style={{ height: '1px', background: '#1E1E2E', marginBottom: '24px' }} />

          {/* ── Introduction ── */}
          <p style={body}>
            This Privacy Policy explains how Vittoria Lanzo ("I", "me", "my") collects, uses,
            and protects your personal data when you visit this website (the "Site"). This policy
            is designed to comply with the EU General Data Protection Regulation (GDPR – Regulation
            (EU) 2016/679), the ePrivacy Directive (2002/58/EC), and any applicable national
            implementing legislation.
          </p>
          <p style={body}>
            By using this Site, you acknowledge that you have read and understood this Privacy Policy.
            If you do not agree, please refrain from using the Site.
          </p>

          {/* ── 1. Data Controller ── */}
          <h2 style={heading}>1. Data Controller</h2>
          <p style={body}>
            The data controller responsible for processing your personal data is:<br />
            <strong style={{ color: '#F0F0F5' }}>Vittoria Lanzo</strong><br />
            Email: <ContactLink label="lanzo [dot] vittoria [at] gmail [dot] com" />
          </p>
          <p style={body}>
            You may contact me at any time regarding questions about this policy or your data rights.
          </p>

          {/* ── 2. Data We Collect ── */}
          <h2 style={heading}>2. Personal Data We Collect</h2>
          <p style={body}>I may collect the following categories of personal data:</p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Contact form data:</strong> name, email address, and message content — provided voluntarily when you use the contact form.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Technical data:</strong> IP address (anonymized), browser type and version, operating system, referral source, pages visited, time and date of visit, and time spent on pages — collected automatically through server logs and analytics.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Cookies and similar technologies:</strong> see Section 7 below.</li>
          </ul>
          <p style={body}>
            I do <strong style={{ color: '#F0F0F5' }}>not</strong> collect special categories of personal data (e.g. health data, political opinions, biometric data).
          </p>

          {/* ── 3. Legal Basis ── */}
          <h2 style={heading}>3. Legal Basis for Processing (Art. 6 GDPR)</h2>
          <p style={body}>I process your personal data on the following legal bases:</p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Consent (Art. 6(1)(a)):</strong> When you submit the contact form or accept optional cookies, you provide explicit consent.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Legitimate interest (Art. 6(1)(f)):</strong> For website security, fraud prevention, and anonymous analytics to improve the Site.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Contractual necessity (Art. 6(1)(b)):</strong> When processing is necessary to respond to your inquiry.</li>
          </ul>

          {/* ── 4. Purpose ── */}
          <h2 style={heading}>4. Purpose of Data Processing</h2>
          <p style={body}>Your data is processed for the following purposes:</p>
          <ul style={list}>
            <li>To respond to your contact form submissions</li>
            <li>To ensure the technical functionality and security of the Site</li>
            <li>To analyze anonymized usage statistics for improving user experience</li>
            <li>To comply with legal obligations</li>
          </ul>

          {/* ── 5. Data Retention ── */}
          <h2 style={heading}>5. Data Retention</h2>
          <p style={body}>
            Contact form submissions are retained for a maximum of <strong style={{ color: '#F0F0F5' }}>12 months</strong> after the last interaction,
            unless a longer retention period is required by law. Server logs and anonymized analytics
            data are retained for up to <strong style={{ color: '#F0F0F5' }}>26 months</strong>.
          </p>
          <p style={body}>
            When data is no longer needed for the purposes for which it was collected, it is
            securely deleted or anonymized.
          </p>

          {/* ── 6. Data Sharing ── */}
          <h2 style={heading}>6. Data Sharing and Third-Party Processors</h2>
          <p style={body}>
            I do not sell, rent, or trade your personal data. Data may be shared with the following
            categories of processors, all of which are bound by data processing agreements (DPAs):
          </p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Hosting provider:</strong> for website hosting and server infrastructure (EU-based or with adequate safeguards per Chapter V GDPR).</li>
            <li><strong style={{ color: '#B0B0CC' }}>Email service provider:</strong> for handling contact form submissions.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Analytics provider:</strong> for anonymized traffic analysis (configured to not store personal data or IP addresses).</li>
          </ul>
          <p style={body}>
            If data is transferred outside the EEA, I ensure appropriate safeguards are in place,
            such as Standard Contractual Clauses (SCCs) approved by the European Commission, or
            an adequacy decision under Art. 45 GDPR.
          </p>

          {/* ── 7. Cookies ── */}
          <h2 style={heading}>7. Cookies and Tracking Technologies</h2>
          <p style={body}>This Site uses the following categories of cookies:</p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Strictly necessary cookies:</strong> Required for the Site to function. No consent required (Art. 5(3) ePrivacy Directive).</li>
            <li><strong style={{ color: '#B0B0CC' }}>Analytics cookies (optional):</strong> Used to collect anonymized usage data. Only placed after obtaining your explicit consent via the cookie banner.</li>
          </ul>
          <p style={body}>
            You can withdraw your cookie consent at any time by clearing cookies in your browser
            settings or contacting me directly. You may also configure your browser to refuse
            cookies entirely.
          </p>

          {/* ── 8. Your Rights ── */}
          <h2 style={heading}>8. Your Rights Under GDPR</h2>
          <p style={body}>Under the GDPR, you have the following rights regarding your personal data:</p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Right of access (Art. 15):</strong> Obtain confirmation of whether your data is being processed and request a copy.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to rectification (Art. 16):</strong> Request correction of inaccurate data.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to erasure (Art. 17):</strong> Request deletion of your personal data ("right to be forgotten").</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to restrict processing (Art. 18):</strong> Request that processing be limited under certain conditions.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to data portability (Art. 20):</strong> Receive your data in a structured, commonly used, machine-readable format.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to object (Art. 21):</strong> Object to processing based on legitimate interest at any time.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to withdraw consent (Art. 7(3)):</strong> Withdraw consent at any time, without affecting the lawfulness of prior processing.</li>
          </ul>
          <p style={body}>
            To exercise any of these rights, <ContactLink label="contact me by email" />.
            I will respond within <strong style={{ color: '#F0F0F5' }}>30 days</strong> as required by Art. 12(3) GDPR.
          </p>

          {/* ── 9. Security ── */}
          <h2 style={heading}>9. Data Security</h2>
          <p style={body}>
            I implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, alteration, disclosure, or destruction, in accordance
            with Art. 32 GDPR. These measures include HTTPS encryption, access controls, and
            regular security reviews.
          </p>

          {/* ── 10. Children ── */}
          <h2 style={heading}>10. Children's Privacy</h2>
          <p style={body}>
            This Site is not directed at children under the age of 16. I do not knowingly collect
            personal data from children. If you believe a child has provided me with personal data,
            please contact me so I can promptly delete it.
          </p>

          {/* ── 11. Supervisory Authority ── */}
          <h2 style={heading}>11. Right to Lodge a Complaint</h2>
          <p style={body}>
            If you believe that your data protection rights have been violated, you have the right
            to lodge a complaint with a supervisory authority under Art. 77 GDPR. In Italy, the
            relevant authority is the <strong style={{ color: '#F0F0F5' }}>Garante per la protezione dei dati personali</strong>{' '}
            (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={{ color: '#6E6EFF', textDecoration: 'none' }}>www.garanteprivacy.it</a>).
          </p>

          {/* ── 12. Changes ── */}
          <h2 style={heading}>12. Changes to This Policy</h2>
          <p style={body}>
            I reserve the right to update this Privacy Policy at any time. Changes will be posted
            on this page with an updated "Last updated" date. Material changes will be communicated
            where feasible. Continued use of the Site after changes constitutes acceptance of the
            revised policy.
          </p>

          {/* ── 13. Contact ── */}
          <h2 style={heading}>13. Contact</h2>
          <p style={body}>
            For any privacy-related inquiries or data subject requests, contact:<br />
            <strong style={{ color: '#F0F0F5' }}>Vittoria Lanzo</strong><br />
            Email: <ContactLink label="lanzo [dot] vittoria [at] gmail [dot] com" />
          </p>

          <div style={{ height: '1px', background: '#1E1E2E', margin: '32px 0 20px' }} />

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#44445A', textAlign: 'center' }}>
            © 2026 Vittoria Lanzo · All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
