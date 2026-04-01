"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiZap, FiShield, FiCheckCircle } from "react-icons/fi";

export default function GameHeader({ game }) {
  if (!game) return null;

  return (
    <div className="relative max-w-6xl mx-auto mb-3 mt-0">
      {/* Subtle Ambient Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-12 bg-[var(--accent)]/10 blur-[40px] opacity-10 -z-10" />

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative px-3 py-2 md:px-5 md:py-2 bg-[var(--card)]/60 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4 overflow-hidden group transition-all duration-500"
      >
        {/* LEFT: Game Identity */}
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          {/* Clean Game Icon Container */}
          <div className="relative shrink-0">
            <div className="relative w-10 h-10 md:w-13 md:h-13 rounded-xl md:rounded-2xl overflow-hidden bg-[var(--background)] ring-1 ring-white/10 shadow-xl transition-transform duration-500 group-hover:scale-105">
              <Image
                src={game.gameImageId?.image || "/logo.png"}
                alt={game.gameName}
                fill
                className="object-cover"
              />
            </div>

            {/* Live Indicator Dot */}
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--background)] rounded-full flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Name & Origin Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-sm md:text-base font-black tracking-tight text-[var(--foreground)] leading-none line-clamp-1 uppercase">
                {game.gameName}
              </h1>
              <FiCheckCircle className="text-[var(--accent)]" size={12} />
            </div>


            {game.isValidationRequired === false && game.gameDescription && (
              <p className="text-[8px] font-bold text-[var(--accent)] uppercase tracking-tight mt-0.5 opacity-80 italic line-clamp-1">
                {game.gameDescription}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Minimalist Trust Badges */}
        <div className="flex items-center gap-2 md:gap-3 relative z-10 shrink-0">
          {/* Instant/Manual Delivery Badge */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl border transition-all duration-300 group/badge 
            ${game.isValidationRequired === false
              ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30"
              : "bg-[var(--accent)]/5 border-[var(--accent)]/10 hover:border-[var(--accent)]/30"
            }`}>
            <FiZap className={`${(game.isValidationRequired === false && game.gameSlug !== 'bgmi-manual') ? "text-amber-500" : "text-[var(--accent)]"} transition-transform group-hover/badge:scale-110`} size={14} fill="currentColor" />
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-80">
              {(game.isValidationRequired === false && game.gameSlug !== 'bgmi-manual') ? "Manual" : "Instant"}
            </span>
          </div>

          {/* Secure Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group/badge">
            <FiShield className="text-emerald-500 transition-transform group-hover/badge:scale-110" size={14} />
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-80">Secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
