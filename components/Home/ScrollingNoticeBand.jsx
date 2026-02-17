"use client";

import { motion } from "framer-motion";
import { FiZap, FiShield, FiCpu, FiStar, FiTrendingUp, FiGlobe, FiGift } from "react-icons/fi";

const messages = [
  { text: "Welcome to", highlight: "BlueBuff Elite Store", icon: FiStar, color: "#f59e0b" }, // Gold
  { text: "Hot Deal", highlight: "Weekly Bundles Live", icon: FiTrendingUp, color: "#ef4444" }, // Red
  { text: "New Arrival", highlight: "Honor of Kings", icon: FiGlobe, color: "#3b82f6" }, // Blue
  { text: "Special", highlight: "VIP Membership", icon: FiGift, color: "#ec4899" }, // Pink
  { text: "Experience", highlight: "Instant & Secure", icon: FiZap, color: "#eab308" }, // Yellow
  { text: "Reliable", highlight: "24×7 Automated", icon: FiCpu, color: "#10b981" }, // Green
  { text: "The Ultimate", highlight: "Reseller Hub", icon: FiShield, color: "#8b5cf6" }, // Purple
];

export default function ScrollingNoticeBand() {
  const content = (
    <div className="flex items-center gap-12 pr-12">
      {messages.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/10 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]"
            style={{
              backgroundColor: item.color ? `${item.color}20` : undefined,
              borderColor: item.color ? `${item.color}30` : undefined,
              color: item.color || 'var(--accent)'
            }}
          >
            <item.icon size={14} />
          </div>
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] italic text-[var(--muted)]">
            {item.text}{" "}
            <span
              className="text-[var(--foreground)]"
              style={{
                textShadow: `0 0 10px ${item.color || "var(--accent)"}40`
              }}
            >
              {item.highlight}
            </span>
          </p>
          <div
            className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30 mx-2"
            style={{ backgroundColor: item.color ? `${item.color}50` : undefined }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-[var(--card)]/40 backdrop-blur-md border-y border-[var(--border)] py-3 mt-4">
      {/* Decorative Glows / Fades */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear",
          },
        }}
        className="flex w-fit"
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  );
}
