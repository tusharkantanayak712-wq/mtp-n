"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiZap, FiShield, FiCheckCircle } from "react-icons/fi";

export default function GameHeader({ game }) {
  if (!game) return null;

  return (
    <div className="relative max-w-6xl mx-auto mb-2 mt-0">
      {/* Subtle Background Glow */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 bg-[var(--accent)]/20 blur-[30px] opacity-10 -z-10" />

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative px-3 py-2 md:px-4 md:py-2.5 rounded-[1.25rem] bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] shadow-lg flex items-center justify-between gap-3 overflow-hidden group hover:border-[var(--accent)]/30 transition-colors"
      >
        {/* Decorative Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

        {/* LEFT: Compact Game Info */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Compact Icon */}
          <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
            <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-xl rotate-3" />
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[var(--background)] ring-1 ring-[var(--border)] shadow-sm">
              <Image
                src={game.gameImageId?.image || "/logo.png"}
                alt={game.gameName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Live Indicator Dot */}
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--card)] rounded-full flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Name & Publisher */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm md:text-base font-[900] tracking-tight uppercase text-[var(--foreground)] leading-tight line-clamp-1">
                {game.gameName}
              </h1>
              <FiCheckCircle className="text-[var(--accent)] text-[10px] md:text-xs shrink-0" />
            </div>
            <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-[var(--muted)] uppercase opacity-80">
              {game.gameFrom}
            </p>
          </div>
        </div>

        {/* RIGHT: Consolidated Badges */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          {/* Mobile: Just Icons */}
          <div className="flex md:hidden gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
              <FiZap size={12} fill="currentColor" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
              <FiShield size={12} />
            </div>
          </div>

          {/* Desktop: Full Badges */}
          <div className="hidden md:flex gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/20 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)]">
              <FiZap className="text-[var(--accent)]" size={12} fill="currentColor" />
              <span>Instant</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-green-500/5 border border-green-500/20 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)]">
              <FiShield className="text-green-500" size={12} />
              <span>Safe</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
