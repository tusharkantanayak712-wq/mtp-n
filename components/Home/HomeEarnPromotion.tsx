"use client";

import { motion } from "framer-motion";
import { FiZap, FiArrowRight, FiCheckCircle, FiPlay, FiStar } from "react-icons/fi";
import Link from "next/link";

export default function HomeEarnPromotion() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg shadow-purple-500/5 group"
      >
        {/* Animated Background Gradients (Reduced) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[40px] -mr-16 -mt-16 transition-opacity group-hover:opacity-10" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            {/* Main Title */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 text-purple-400 text-[10px]">
                <FiZap strokeWidth={3} />
              </div>
              <h3 className="text-sm font-black text-[var(--foreground)] leading-tight">
                Diamonds for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 italic">FREE</span>
              </h3>
            </div>

            {/* Features Row */}
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tight text-[var(--muted)]">
                <FiPlay className="text-purple-500 text-[9px]" /> Watch Ads
              </span>
              <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tight text-[var(--muted)]">
                <FiCheckCircle className="text-purple-500 text-[9px]" /> Tasks
              </span>
              <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tight text-[var(--muted)]">
                <FiStar className="text-purple-500 text-[9px]" /> Checkin Games
              </span>
            </div>
          </div>

          {/* Compact CTA */}
          <Link href="/dashboard/coins" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-md shadow-purple-500/10"
            >
              Earn <FiArrowRight size={10} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
