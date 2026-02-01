"use client";

import { motion } from "framer-motion";
import { FiUsers, FiGlobe, FiZap, FiCode, FiArrowRight, FiMessageCircle } from "react-icons/fi";

export default function ServicesPage() {
  const whatsappLink = "https://wa.me/916372305866";

  const services = [
    {
      title: "Reseller Program",
      desc: "Scale your business with the market's lowest rates. Bulk top-up solutions with instant delivery and high profit margins.",
      icon: FiUsers,
      badge: "ELITE PRICING",
      active: true,
    },
    {
      title: "Whitelabel Solution",
      desc: "Launch your own branded empire. Fully hosted, customizable platform with your own domain and integrated payments.",
      icon: FiGlobe,
      badge: "FAST SETUP",
      active: true,
    },
    {
      title: "Custom Development",
      desc: "Tailor-made top-up portals designed for specific business needs. Advanced UI/UX and unique feature integrations.",
      icon: FiZap,
      badge: "BESPOKE",
      active: true,
    },
    {
      title: "Advanced API",
      desc: "Powerful endpoint connectivity for seamless service automation. Integrate our infrastructure directly into your ecosystem.",
      icon: FiCode,
      badge: "DEVELOPMENT",
      active: false,
    },
  ];

  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 transition-colors duration-300 px-6">

      <div className="max-w-4xl mx-auto pt-16 md:pt-24 relative z-10">

        {/* HEADER SECTION - SIMPLER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-[900] italic tracking-tighter uppercase leading-none mb-2">
            OUR <span className="text-[var(--accent)]">SERVICES</span>
          </h1>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic font-sans">
            Solutions for Every Scale
          </p>
        </motion.div>

        {/* SERVICES LIST - CLEANER CARDS */}
        <div className="space-y-4">
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={service.active ? { x: 3, backgroundColor: "var(--card)" } : {}}
                onClick={() => service.active && window.open(whatsappLink, "_blank")}
                className={`group relative p-8 rounded-3xl bg-[var(--card)]/40 border border-[var(--border)] transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 ${service.active
                  ? "cursor-pointer hover:border-[var(--accent)]/30 hover:shadow-xl"
                  : "opacity-30 grayscale cursor-not-allowed border-dashed"
                  }`}
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]/60 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all shadow-lg flex-shrink-0">
                  <Icon size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-[900] uppercase tracking-tighter italic text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-none">
                      {service.title}
                    </h3>
                    <span className="text-[8px] font-black px-2 py-0.5 rounded bg-[var(--accent)]/5 text-[var(--accent)]/60 border border-[var(--accent)]/10 tracking-widest uppercase">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-[var(--muted)] text-xs md:text-sm leading-relaxed opacity-60">
                    {service.desc}
                  </p>
                </div>

                {/* Action Indicator */}
                <div className="flex items-center gap-3 text-right flex-shrink-0 ml-auto md:ml-4">
                  <div className="hidden md:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black uppercase text-[var(--accent)] tracking-widest">Connect Now</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-all group-hover:scale-105">
                    <FiArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM CTA - MINIMALIST */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/20 text-center"
        >
          <h4 className="text-xl font-[900] italic uppercase tracking-tighter mb-2">Ready to expand?</h4>
          <p className="text-[var(--muted)] text-[10px] opacity-60 mb-8 max-w-sm mx-auto uppercase tracking-widest font-black italic">Discuss custom configurations and bulk rates with our enterprise team.</p>
          <button
            onClick={() => window.open(whatsappLink, "_blank")}
            className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-widest text-[10px] italic shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <FiMessageCircle size={14} />
            Connect on WhatsApp
          </button>
        </motion.div>

      </div>
    </section>
  );
}
