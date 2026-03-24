import { useState, FormEvent } from 'react';

export default function ContactDistrict({ visible }: { visible: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
      <div
        className={`max-w-xl w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Section label */}
        <p className="font-display text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-6">
          CONTACT
        </p>

        <h2 className="font-display text-5xl font-bold text-foreground mb-3">
          Start a conversation.
        </h2>
        <p className="font-body text-base text-text-secondary mb-10">
          Open to collaborations, consulting, and research partnerships in AI architecture.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-sm text-foreground block mb-1.5">Name</label>
            <input
              type="text"
              className="w-full font-body text-[15px] text-foreground bg-surface border border-border rounded-md px-4 py-3.5 placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/[0.13] transition-all"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-foreground block mb-1.5">Email</label>
            <input
              type="email"
              className="w-full font-body text-[15px] text-foreground bg-surface border border-border rounded-md px-4 py-3.5 placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/[0.13] transition-all"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="font-body text-sm text-foreground block mb-1.5">Message</label>
            <textarea
              className="w-full font-body text-[15px] text-foreground bg-surface border border-border rounded-md px-4 py-3.5 placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/[0.13] transition-all resize-none h-28"
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Describe your vision..."
              required
            />
          </div>

          <p className="font-body text-xs text-muted-foreground mt-1">
            By sending this message your email address will be processed to respond to your inquiry
            under Art. 6(1)(f) GDPR (legitimate interest). See the{' '}
            <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          </p>
          <button
            type="submit"
            className="font-display text-sm font-medium tracking-[0.05em] bg-accent text-white border-none rounded-md px-8 py-3.5 hover:bg-secondary hover:-translate-y-px transition-all duration-200"
          >
            {sent ? 'Message Sent' : 'Send Message'}
          </button>
        </form>

        <div className="flex gap-6 mt-10">
          {['GitHub', 'LinkedIn', 'X'].map(platform => (
            <a
              key={platform}
              href="#"
              className="font-body text-sm text-text-secondary hover:text-foreground transition-colors duration-200"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
