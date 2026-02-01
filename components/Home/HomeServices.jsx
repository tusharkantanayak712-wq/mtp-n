"use client";

import { motion } from "framer-motion";
import { FiUsers, FiGlobe, FiZap, FiArrowRight, FiMessageCircle } from "react-icons/fi";

const SERVICES = [
  {
    title: "Reseller Program",
    desc: "Scale your business with market-leading rates. Bulk solutions with instant delivery.",
    icon: FiUsers,
    badge: "LOWEST RATES",
    active: true,
  },
  {
    title: "Whitelabel Site",
    desc: "Launch your own branded empire. Fully hosted platform with integrated automation.",
    icon: FiGlobe,
    badge: "READY TO GO",
    active: true,
  },
  {
    title: "Enterprise Solutions",
    desc: "Tailor-made top-up portals designed for specific large-scale business needs.",
    icon: FiZap,
    badge: "CUSTOM BUILD",
    active: true,
  },
];

export default function HomeServices() {
  const whatsappLink = "https://wa.me/916372305866";

  return (
    <section className="py-20 bg-[var(--background)] px-6 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER SECTION - ELITE TYPOGRAPHY */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-[var(--accent)]/5 border border-[var(--accent)]/10 mb-4">
            <span className="text-[var(--accent)] text-[9px] font-black uppercase tracking-widest italic">Expansion Pack</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-[900] italic tracking-tighter uppercase leading-none mb-3">
            ELITE <span className="text-[var(--accent)]">SOLUTIONS</span>
          </h2>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
            Professional Tools for Professional Scale
          </p>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-[40px] bg-[var(--card)]/40 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-3xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]/60 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all shadow-xl group-hover:scale-110 mb-6">
                <service.icon size={28} />
              </div>

              {/* Content */}
              <div className="space-y-3 mb-8">
                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-[var(--accent)]/5 text-[var(--accent)]/60 border border-[var(--accent)]/10 tracking-widest uppercase italic">
                  {service.badge}
                </span>
                <h3 className="text-xl font-[900] uppercase tracking-tighter italic text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-none">
                  {service.title}
                </h3>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed opacity-60 italic">
                  {service.desc}
                </p>
              </div>

              {/* Action Link */}
              <button
                onClick={() => window.open(whatsappLink, "_blank")}
                className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-all"
              >
                CONNECT NOW <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Subtle Side Glow */}
              <div className="absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => window.open(whatsappLink, "_blank")}
            className="px-8 py-4 rounded-full bg-[var(--card)]/40 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all flex items-center gap-3 mx-auto shadow-lg group"
          >
            <FiMessageCircle size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Discuss Custom Architecture</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
