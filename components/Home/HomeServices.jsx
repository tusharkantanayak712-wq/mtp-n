"use client";

import { motion } from "framer-motion";
import { FiUsers, FiGlobe, FiZap, FiArrowRight, FiMessageCircle } from "react-icons/fi";

const SERVICES = [
  {
    title: "Reseller Program",
    desc: "Scale your business with market-leading rates. Bulk solutions with instant delivery.",
    icon: FiUsers,
    badge: "LOWEST RATES",
  },
  {
    title: "Whitelabel Site",
    desc: "Launch your own branded empire. Fully hosted platform with integrated automation.",
    icon: FiGlobe,
    badge: "READY TO GO",
  },
  {
    title: "Enterprise Portals",
    desc: "Tailor-made top-up portals designed for specific large-scale business needs.",
    icon: FiZap,
    badge: "CUSTOM BUILD",
  },
];

export default function HomeServices() {
  const whatsappLink = "https://wa.me/919178521537";

  return (
    <section className="py-12 bg-[var(--background)] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* HEADER SECTION - COMPACT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 px-4"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-[1px] bg-[var(--accent)]/30 sm:block hidden" />
            <span className="text-[var(--accent)] text-[9px] font-black uppercase tracking-[0.3em] italic">Partnership Program</span>
          </div>
          <h2 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">
            GROW YOUR <span className="text-[var(--accent)] text-shadow-glow">EMPIRE</span>
          </h2>
        </motion.div>

        {/* HORIZONTAL SCROLLABLE FLEX */}
        <div className="flex overflow-x-auto gap-4 pb-8 px-4 no-scrollbar -mx-4 scroll-smooth snap-x snap-mandatory">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] snap-center group relative p-6 rounded-[32px] bg-gradient-to-br from-[var(--card)]/60 to-transparent backdrop-blur-md border border-white/5 hover:border-[var(--accent)]/30 transition-all duration-500 flex flex-col items-start shadow-2xl"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-black transition-all duration-500 mb-6">
                <service.icon size={20} />
              </div>

              {/* Content */}
              <div className="space-y-2 mb-8 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="text-[8px] font-black italic text-[var(--accent)]/80 tracking-widest uppercase">
                    {service.badge}
                  </span>
                </div>
                <h3 className="text-xl font-[900] uppercase tracking-tighter italic text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed italic line-clamp-2">
                  {service.desc}
                </p>
              </div>

              {/* Action Link */}
              <button
                onClick={() => window.open(whatsappLink, "_blank")}
                className="mt-auto flex items-center gap-3 py-2 px-4 rounded-full bg-[var(--foreground)]/[0.05] border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60 group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] transition-all"
              >
                Inquire Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Decorative Blur */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[var(--accent)]/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-[var(--accent)]/10 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* COMPACT BOTTOM BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 rounded-3xl bg-[var(--card)]/40 border border-white/5 border-dashed"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] italic">
            Custom infrastructure & business solutions available
          </p>
          <button
            onClick={() => window.open(whatsappLink, "_blank")}
            className="flex items-center gap-2 text-[var(--accent)] hover:brightness-125 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <FiMessageCircle size={14} /> Talk to an Expert
          </button>
        </motion.div>
      </div>
    </section>
  );
}

