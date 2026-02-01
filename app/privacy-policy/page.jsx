"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiShield, FiInfo } from "react-icons/fi";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Blue Buff";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "01",
      title: "Data Collection",
      content: "We collect account details (Email, Phone, Game ID) and technical data (IP, Browser) exclusively for order delivery and fraud prevention."
    },
    {
      id: "02",
      title: "Usage Protocol",
      content: "Your data is used solely to process orders and improve platform security. We never sell or trade your personal information for marketing."
    },
    {
      id: "03",
      title: "Security & Retention",
      content: "We utilize encrypted gateways and retain logs only as long as legally required for transaction verification and auditing."
    },
    {
      id: "04",
      title: "Third-Party Apps",
      content: "Our platform integrates with verified payment and analytics providers who operate under their own strict privacy standards."
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 pb-32 transition-colors duration-300 px-6">

      <div className="max-w-4xl mx-auto pt-16 md:pt-24 relative z-10">

        {/* HEADER - SIMPLIFIED */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-none mb-2">
            PRIVACY <span className="text-[var(--accent)]">POLICY</span>
          </h1>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
            Data Protection Standards
          </p>
        </motion.div>

        {/* COMPACT LIST */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ backgroundColor: "var(--card)" }}
              className="p-6 rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] group flex items-start gap-5 transition-all"
            >
              <div className="text-xl font-black italic text-[var(--accent)] opacity-20 group-hover:opacity-100 transition-opacity pt-0.5">
                {section.id}
              </div>
              <div>
                <h2 className="text-base font-[900] italic uppercase tracking-tighter text-[var(--foreground)] mb-1.5">{section.title}</h2>
                <p className="text-[11px] md:text-xs text-[var(--muted)] leading-relaxed opacity-60 italic">{section.content}</p>
              </div>
            </motion.section>
          ))}
        </div>

        {/* FULL POLICY LINK */}
        <div className="mt-12 p-8 rounded-3xl border border-[var(--border)] text-center opacity-40">
          <FiShield className="mx-auto mb-4 text-[var(--accent)]" size={20} />
          <p className="text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto mb-6">Standard compliance protocols are active. For full legal disclosure, contact our data protection officer.</p>
          <Link href="/contact" className="text-[9px] font-black uppercase text-[var(--accent)] border-b border-[var(--accent)]/30 pb-1">Legal Support Access</Link>
        </div>

      </div>
    </main>
  );
}
