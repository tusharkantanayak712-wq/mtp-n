"use client";

import { motion } from "framer-motion";
import { FiFileText, FiAlertCircle, FiShield, FiGlobe, FiInfo } from "react-icons/fi";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Blue Buff";

export default function TermsAndConditions() {
  const sections = [
    {
      id: "01",
      title: "Eligibility",
      content: "You must be at least 18 years old or have parental/guardian permission to use this platform. You are responsible for maintaining account confidentiality and all activities under your credentials."
    },
    {
      id: "02",
      title: "Platform Use",
      content: "You agree to use Blue Buff only for lawful purposes. Accurate information (Game ID, Server/Zone) is required for order fulfillment. Incorrect data may lead to irreversible transaction failure."
    },
    {
      id: "03",
      title: "Digital Delivery",
      content: "All products are digital services delivered instantly. Once processed, orders are final. We are not liable for user input errors or unauthorized account use after delivery."
    },
    {
      id: "04",
      title: "Payments",
      content: "Transactions are processed through encrypted third-party gateways. We do not store sensitive payment details. We reserve the right to audit or block suspicious transaction patterns."
    },
    {
      id: "05",
      title: "Refund Logic",
      content: "Due to the instant nature of digital fulfillment, successful deliveries are non-refundable. Consideration is limited only to verified technical failures where no credit was issued."
    },
    {
      id: "06",
      title: "Prohibited Acts",
      content: "Exploiting system vulnerabilities, engaging in fraudulent chargebacks, or utilizing unauthorized automation/bots will result in immediate permanent suspension."
    },
    {
      id: "07",
      title: "Intellectual Property",
      content: "All Blue Buff branding remains our property. Game trademarks (Mobile Legends, etc.) belong to their respective publishers. We are an independent service provider."
    },
    {
      id: "08",
      title: "Liability Limits",
      content: "We are not liable for losses due to user error, game server maintenance outages, account restrictions by developers, or indirect consequential damages."
    }
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 pb-32 transition-colors duration-300 px-6">

      <div className="max-w-4xl mx-auto pt-16 md:pt-24 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/5 border border-[var(--accent)]/10 mb-6 font-sans">
            <span className="text-[var(--accent)] text-[10px] font-black uppercase tracking-widest italic">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-none mb-2">
            TERMS & <span className="text-[var(--accent)]">CONDITIONS</span>
          </h1>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
            Defining the Service Standards
          </p>
          <div className="flex items-center gap-4 mt-8 text-[9px] font-black uppercase tracking-widest opacity-30 italic justify-center md:justify-start">
            <FiFileText size={14} className="text-[var(--accent)]" />
            <span>REVISED: JANUARY 2026</span>
          </div>
        </motion.div>

        {/* SECTIONS GRID-LIST */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-3xl bg-[var(--card)]/40 border border-[var(--border)] group hover:border-[var(--accent)]/30 transition-all flex flex-col md:flex-row gap-6"
            >
              <div className="text-2xl font-black italic text-[var(--accent)] opacity-20 group-hover:opacity-100 transition-opacity leading-none pt-1">
                {section.id}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-[900] italic uppercase tracking-tighter text-[var(--foreground)] mb-3">{section.title}</h2>
                <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed opacity-60 italic">{section.content}</p>
              </div>
            </motion.section>
          ))}
        </div>

        {/* FINAL NOTES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 pt-16 border-t border-[var(--border)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-4">
              <FiAlertCircle className="text-rose-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-2">Suspension Policy</h3>
                <p className="text-[9px] font-bold text-[var(--muted)] opacity-50 uppercase leading-relaxed">Violations of these terms result in immediate termination of account access without prior warning.</p>
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-start gap-4">
              <FiGlobe className="text-[var(--accent)] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[10px] font-black uppercase text-[var(--accent)] tracking-widest mb-2">Governing Law</h3>
                <p className="text-[9px] font-bold text-[var(--muted)] opacity-50 uppercase leading-relaxed">All agreements are interpreted under the local jurisdiction of our operational base.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center opacity-30 flex items-center justify-center gap-3">
            <FiInfo size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Contact Support for technical clarifications.</span>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
