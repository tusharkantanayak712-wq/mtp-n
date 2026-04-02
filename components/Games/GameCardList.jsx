"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { FiArrowRight, FiZap, FiShield } from "react-icons/fi";

export default function GameCardList({ game, isOutOfStock, index = 0 }) {
  const disabled = isOutOfStock(game.gameName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={disabled ? "#" : `/games/${game.gameSlug}`}
        className={`group relative flex items-center gap-4.5 p-3 rounded-[2.5rem] border transition-all duration-500 overflow-hidden
        ${disabled
            ? "opacity-40 grayscale cursor-not-allowed border-[var(--border)] bg-[var(--card)]/50"
            : "border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/80 hover:translate-x-1 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(var(--accent-rgb),0.15)] hover:scale-[1.01] active:scale-[0.99]"
          }`}
      >
        {/* LIGHT SWEEP EFFECT */}
        {!disabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
          </div>
        )}

        {/* AVATAR SYSTEM */}
        <div className="relative flex-shrink-0">
          <div className={`
            relative w-20 h-20 sm:w-24 sm:h-24 rounded-[1.8rem] overflow-hidden border z-10 transition-all duration-500
            ${disabled
              ? "border-white/10"
              : "border-white/10 group-hover:border-[var(--accent)]/30 group-hover:rounded-[1.2rem] group-hover:scale-95 group-hover:rotate-[-2deg]"
            }
          `}>
            <Image
              src={game.gameImageId?.image || logo}
              alt={game.gameName}
              fill
              sizes="120px"
              className={`object-cover transition-transform duration-700
                ${disabled ? "" : "group-hover:scale-110 group-hover:rotate-4"}
              `}
            />
            {/* INNER GLOW */}
            {!disabled && (
              <div className="absolute inset-0 rounded-[1.8rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
            )}
          </div>
          {/* Ambient Glow behind Image */}
          {!disabled && (
            <div className="absolute inset-0 bg-[var(--accent)]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
          )}
        </div>

        {/* INFO SYSTEM */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-col mb-1.5 sm:mb-2">
            <h3
              className={`text-base sm:text-lg font-[1000] uppercase italic tracking-tighter leading-tight transition-all duration-300
              ${disabled ? "text-[var(--muted)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"}`}
            >
              {game.gameName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!disabled && game.tagId && (
              <span
                className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-[0.12em] px-3 py-1 rounded-lg backdrop-blur-md border shadow-sm flex items-center gap-1.5 transition-all group-hover:translate-y-[-1px]"
                style={{
                  background: `${game.tagId.tagBackground}55`,
                  color: game.tagId.tagColor,
                  borderColor: `${game.tagId.tagBackground}77`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)'
                }}
              >
                {game.tagId.tagName === "Manual" && <FiZap size={12} fill="currentColor" className="animate-pulse" />}
                {game.tagId.tagName}
              </span>
            )}
            {disabled && (
              <span className="px-3 py-1 rounded-lg bg-red-400/10 border border-red-400/20 text-red-500/60 text-[7.5px] sm:text-[8px] font-black uppercase tracking-widest italic">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* ACTION SYSTEM */}
        {!disabled && (
          <div className="relative shrink-0 pr-3 sm:pr-4">
            <div className="absolute inset-0 bg-[var(--accent)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--background)] group-hover:bg-[var(--accent)] transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.3)] group-hover:rotate-[-45deg] group-hover:scale-105 active:scale-95">
              <FiArrowRight size={20} className="transition-transform duration-500 group-hover:rotate-[45deg]" />
            </div>
          </div>
        )}

        {/* HOVER ACCENT LINE */}
        {!disabled && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-full shadow-[0_0_15px_var(--accent)]" />
        )}
      </Link>
    </motion.div>
  );
}

