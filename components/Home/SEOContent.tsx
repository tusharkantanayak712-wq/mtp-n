"use client";

import { FiInfo, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";

export default function SEOContent() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-[var(--card)]/20 to-transparent relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Title Section */}
          <div 
            className="lg:col-span-5 space-y-6 opacity-100 translate-x-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-[var(--accent)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Market Leader</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-[var(--foreground)]">
              Blue Buff – Cheapest <br />
              <span className="text-[var(--accent)] text-shadow-glow">MLBB Recharge</span> <br />
              in India
            </h1>
            <p className="text-sm text-[var(--muted)] leading-relaxed italic max-w-md">
              Blue Buff stands as the gold standard for <strong className="text-[var(--foreground)]">MLBB top up india instant</strong> services. We specialize in providing the <strong className="text-[var(--foreground)]">cheapest mlbb recharge website</strong> experience, ensuring every diamond is delivered with surgical precision and elite speed.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)]/40 border border-[var(--border)] backdrop-blur-sm">
                <FiShield className="text-[var(--accent)]" />
                <span className="text-[9px] font-black uppercase tracking-widest italic">Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)]/40 border border-[var(--border)] backdrop-blur-sm">
                <FiTrendingUp className="text-[var(--accent)]" />
                <span className="text-[9px] font-black uppercase tracking-widest italic">Fast</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div 
            className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-100 translate-y-0"
          >
            {/* Box 1 */}
            <div className="p-8 rounded-[32px] glass-card premium-gradient hover:border-[var(--accent)]/30 transition-all duration-500 group">
              <div className="w-10 h-10 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform">
                <FiInfo size={18} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-4 italic">Our Strategic MLBB Advantage</h2>
              <ul className="space-y-4">
                {[
                  { label: "MLBB Recharge with UPI", desc: "Native integration with all major Indian UPI apps." },
                  { label: "No Login Required", desc: "Safe top-up via Player ID & Zone ID only." },
                ].map((item, idx) => (
                  <li key={idx} className="space-y-1">
                    <span className="text-xs font-bold text-[var(--foreground)] uppercase italic tracking-wide">• {item.label}</span>
                    <p className="text-[10px] text-[var(--muted)] italic leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-[32px] glass-card premium-gradient hover:border-[var(--accent)]/30 transition-all duration-500 group">
              <div className="w-10 h-10 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform">
                <FiCheckCircle size={18} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-4 italic">Unmatched Trust & Reliability</h2>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed italic mb-4">
                As a <strong className="text-[var(--foreground)]">mlbb recharge trusted site india</strong>, we prioritize your account safety above all else.
              </p>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed italic">
                Our <strong className="text-[var(--foreground)]">mobile legends recharge india fast</strong> protocols ensure that <strong className="text-[var(--foreground)]">mlbb diamonds instant delivery india</strong> is not just a promise, but a consistent reality for our elite community.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className="mt-16 p-6 rounded-3xl bg-[var(--card)]/30 border border-dashed border-[var(--border)] text-center opacity-100"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] italic">
            Elite Gaming Infrastructure • <span className="text-[var(--accent)]">Blue Buff India</span> • High Fidelity Automation
          </p>
        </div>
      </div>
    </section>
  );
}

