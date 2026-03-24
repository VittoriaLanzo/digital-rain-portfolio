import { useNavigate } from 'react-router-dom';

const LAST_UPDATED = 'March 24, 2026';

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
            This Privacy Policy describes how Vittoria Lanzo ("I", "me", "my") handles
            personal data in connection with this website (the "Site"). It is written to
            comply with the EU General Data Protection Regulation (GDPR — Regulation (EU)
            2016/679), the ePrivacy Directive (2002/58/EC as amended), and applicable Italian
            national law.
          </p>
          <p style={body}>
            This Site is a <strong style={{ color: '#F0F0F5' }}>static personal portfolio</strong>.
            It does not operate a backend server, does not run analytics software, and does not
            set cookies. The processing described below is therefore limited to what the hosting
            infrastructure unavoidably handles, and to any direct contact initiated by you.
          </p>

          {/* ── 1. Data Controller ── */}
          <h2 style={heading}>1. Data Controller</h2>
          <p style={body}>
            The data controller for any personal data processed in connection with this Site is:<br />
            <strong style={{ color: '#F0F0F5' }}>Vittoria Lanzo</strong><br />
            Email: <ContactLink label="lanzo.vittoria@gmail.com" />
          </p>
          <p style={body}>
            As a natural person operating a personal portfolio site with no large-scale or
            systematic processing, I am not required to appoint a Data Protection Officer
            (DPO) under Art. 37 GDPR.
          </p>

          {/* ── 2. Personal Data Processed ── */}
          <h2 style={heading}>2. Personal Data Processed</h2>

          <p style={{ ...body, color: '#B0B0CC', fontWeight: 600, marginBottom: '8px' }}>
            2a. Hosting infrastructure — server access logs
          </p>
          <p style={body}>
            When you visit this Site, the hosting provider's servers automatically record
            standard HTTP access log data: your IP address, browser type and version,
            operating system, referring URL, pages requested, timestamps, and HTTP status
            codes. This is an inherent function of all web hosting and is not under my
            direct control.
          </p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Legal basis:</strong> Legitimate interest (Art. 6(1)(f) GDPR) — ensuring the secure and reliable delivery of the Site. This interest is not overridden by your rights, as the processing is minimal, technically necessary, and you initiate contact by visiting the Site.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Retention:</strong> Determined by the hosting provider's own policy; I do not have individual access to these logs.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Processor:</strong> The hosting provider acts as a data processor under Art. 28 GDPR. Contact me to identify the provider currently in use.</li>
          </ul>

          <p style={{ ...body, color: '#B0B0CC', fontWeight: 600, marginBottom: '8px' }}>
            2b. Direct email contact
          </p>
          <p style={body}>
            If you contact me at the email address above, I will process your email address,
            name (if provided), and the content of your message, solely to respond to your inquiry.
          </p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Legal basis:</strong> Legitimate interest (Art. 6(1)(f) GDPR) — responding to communications you have directed to me. You retain the right to object at any time (see Section 5).</li>
            <li><strong style={{ color: '#B0B0CC' }}>Retention:</strong> Retained for as long as necessary to handle the inquiry, and for a reasonable period thereafter not exceeding 12 months from the last exchange, unless a longer period is required by law.</li>
          </ul>

          {/* ── 3. What This Site Does Not Do ── */}
          <h2 style={heading}>3. What This Site Does Not Do</h2>
          <ul style={list}>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> use web analytics tools (e.g. Google Analytics, Plausible, Matomo, or equivalent).</li>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> set first-party cookies or use local storage for tracking or profiling.</li>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> transmit contact form submissions to any server — the contact form is a presentational UI element and sends no data over the network.</li>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> share, sell, rent, or trade personal data with third parties for marketing or commercial purposes.</li>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> process special categories of personal data (Art. 9 GDPR) or data relating to criminal convictions (Art. 10 GDPR).</li>
            <li>Does <strong style={{ color: '#F0F0F5' }}>not</strong> engage in automated decision-making or profiling with legal or similarly significant effects (Art. 22 GDPR).</li>
          </ul>

          {/* ── 4. Cookies ── */}
          <h2 style={heading}>4. Cookies and Tracking</h2>
          <p style={body}>
            This Site does not set first-party cookies. The hosting provider may set a
            technically necessary session or load-balancing cookie as part of serving the
            Site; such cookies do not identify you personally, expire at the end of your
            session or shortly after, and do not require consent under Art. 5(3) of the
            ePrivacy Directive. No third-party tracking, advertising, or analytics cookies
            are present.
          </p>

          {/* ── 5. Your Rights ── */}
          <h2 style={heading}>5. Your Rights Under GDPR</h2>
          <p style={body}>
            Where I process your personal data, you hold the following rights under
            Chapter III GDPR:
          </p>
          <ul style={list}>
            <li><strong style={{ color: '#B0B0CC' }}>Right of access (Art. 15):</strong> Obtain confirmation of whether I process your data and receive a copy.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to rectification (Art. 16):</strong> Request correction of inaccurate personal data.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to erasure (Art. 17):</strong> Request deletion of your data, subject to any overriding legal retention obligation.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to restriction (Art. 18):</strong> Request that processing be restricted under certain circumstances.</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to data portability (Art. 20):</strong> Receive your data in a structured, machine-readable format (applies where processing is based on consent or contract and is carried out by automated means).</li>
            <li><strong style={{ color: '#B0B0CC' }}>Right to object (Art. 21):</strong> Object at any time to processing based on legitimate interest. I will cease processing unless I can demonstrate compelling legitimate grounds that override your interests, rights and freedoms, or for the establishment, exercise, or defence of legal claims.</li>
          </ul>
          <p style={body}>
            To exercise any of these rights, <ContactLink label="contact me by email" />.
            I will respond within <strong style={{ color: '#F0F0F5' }}>one month</strong> of
            receipt (Art. 12(3) GDPR). This period may be extended by a further two months where
            necessary due to complexity or volume, in which case I will notify you within the
            first month. No fee is charged unless requests are manifestly unfounded or excessive
            (Art. 12(5) GDPR).
          </p>

          {/* ── 6. Data Security ── */}
          <h2 style={heading}>6. Data Security</h2>
          <p style={body}>
            I implement appropriate technical and organisational security measures in accordance
            with Art. 32 GDPR. The Site is served exclusively over HTTPS (TLS). Email
            correspondence is stored in a password-protected account with two-factor
            authentication enabled. In the event of a personal data breach, I will notify
            the competent supervisory authority without undue delay and, where feasible, within
            72 hours of becoming aware of it (Art. 33 GDPR), and will inform affected individuals
            where required by Art. 34 GDPR.
          </p>

          {/* ── 7. International Transfers ── */}
          <h2 style={heading}>7. International Data Transfers</h2>
          <p style={body}>
            If the hosting provider or email provider transfers personal data outside the
            European Economic Area (EEA), such transfers are made only where an adequate
            level of protection is ensured — either through an EU Commission adequacy decision
            (Art. 45 GDPR) or Standard Contractual Clauses approved by the European Commission
            (Art. 46(2)(c) GDPR). You may request details of the safeguards in place by
            contacting me.
          </p>

          {/* ── 8. Children ── */}
          <h2 style={heading}>8. Children's Privacy</h2>
          <p style={body}>
            This Site is not directed at children under the age of 14 (the minimum age for
            consent to personal data processing in the digital context under Italian law,
            pursuant to Legislative Decree 101/2018, Art. 2-quinquies). I do not knowingly
            process personal data from children. If you believe a child has sent me personal
            data without appropriate parental consent, please contact me so that I can delete
            it without delay.
          </p>

          {/* ── 9. Supervisory Authority ── */}
          <h2 style={heading}>9. Right to Lodge a Complaint</h2>
          <p style={body}>
            If you consider that the processing of your personal data infringes the GDPR, you
            have the right to lodge a complaint with a supervisory authority — in particular in
            the EU Member State of your habitual residence, place of work, or place of the
            alleged infringement (Art. 77 GDPR).
          </p>
          <p style={body}>
            As this controller is established in Italy, the lead supervisory authority is the{' '}
            <strong style={{ color: '#F0F0F5' }}>Garante per la protezione dei dati personali</strong>
            {' '}(<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={{ color: '#6E6EFF', textDecoration: 'none' }}>www.garanteprivacy.it</a>).
            Exercising this right does not affect any other administrative or judicial remedy
            available to you.
          </p>

          {/* ── 10. Changes ── */}
          <h2 style={heading}>10. Changes to This Policy</h2>
          <p style={body}>
            I may update this Privacy Policy to reflect changes in the Site or in applicable
            law. The "Last updated" date at the top of this page will be revised accordingly.
            Where changes are material, I will take reasonable steps to draw them to your
            attention. Prior versions are available on request.
          </p>
          <p style={body}>
            Continued use of the Site after an update does not constitute consent to revised
            terms. Where GDPR requires consent, it will always be obtained separately and
            explicitly.
          </p>

          {/* ── 11. Contact ── */}
          <h2 style={heading}>11. Contact</h2>
          <p style={body}>
            For any privacy-related questions or to exercise your data subject rights:<br />
            <strong style={{ color: '#F0F0F5' }}>Vittoria Lanzo</strong><br />
            Email: <ContactLink label="lanzo.vittoria@gmail.com" />
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
