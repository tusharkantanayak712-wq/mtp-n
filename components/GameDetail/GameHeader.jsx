"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiZap, FiShield } from "react-icons/fi";
import logo from "@/public/logo.png";

export default function GameHeader({ game }) {
  if (!game) return null;

  return (
    <div className="relative max-w-6xl mx-auto mb-6 mt-1">
      {/* Background Glow similar to BuyPanel */}
      <div className="absolute inset-2 bg-gradient-to-r from-[var(--accent)]/30 to-purple-600/30 blur-[40px] opacity-20 -z-10" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative px-4 py-3 md:p-3 rounded-[2.5rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden transform transition-all hover:scale-[1.005]"
      >
        {/* Decorative Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        {/* LEFT: Game Icon + Name */}
        <div className="relative z-10 flex items-center gap-4 md:pl-2">
          {/* Game Icon - Matching BuyPanel visual style */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 p-1">
            <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-2xl rotate-3" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--background)] shadow-lg ring-1 ring-[var(--border)] group">
              <Image
                src={game.gameImageId?.image || logo}
                alt={game.gameName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Name & Subtitle */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] opacity-80">
                Live Status
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-[900] tracking-tight uppercase text-[var(--foreground)] leading-none">
              {game.gameName}
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase opacity-90 mt-1">
              {game.gameFrom}
            </p>
          </div>
        </div>

        {/* RIGHT: Badges (Mobile Below Name, Desktop Right) */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:pr-4 relative z-10">
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] flex items-center gap-1.5 text-[10px] font-[900] uppercase tracking-wider text-[var(--foreground)] shadow-sm">
              <FiZap className="text-yellow-400" size={14} fill="currentColor" />
              Instant Delivery
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] flex items-center gap-1.5 text-[10px] font-[900] uppercase tracking-wider text-[var(--foreground)] shadow-sm">
              <FiShield className="text-green-400" size={14} />
              Trusted
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
