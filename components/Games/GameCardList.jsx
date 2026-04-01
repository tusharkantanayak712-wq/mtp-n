"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { FiArrowRight, FiZap, FiShield } from "react-icons/fi";

export default function GameCardList({ game, isOutOfStock, index = 0 }) {
  const disabled = isOutOfStock(game.gameName);

  return (
    <div>
      <Link
        href={disabled ? "#" : `/games/${game.gameSlug}`}
        className={`group relative flex items-center gap-5 p-3.5 rounded-[2.5rem] border transition-all duration-500 overflow-hidden
        ${disabled
            ? "opacity-40 grayscale cursor-not-allowed border-[var(--border)] bg-[var(--card)]/50"
            : "border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-3xl hover:border-[var(--accent)]/30 hover:bg-[var(--card)]/80 hover:translate-x-1 shadow-2xl hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.1)]"
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
            relative w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden border z-10 transition-all duration-500
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
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
            )}
          </div>
          {/* Ambient Glow behind Image */}
          {!disabled && (
            <div className="absolute inset-0 bg-[var(--accent)]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
          )}
        </div>

        {/* INFO SYSTEM */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-col mb-2.5">
            <h3
              className={`text-lg sm:text-xl font-black uppercase italic tracking-tighter leading-[0.9] transition-all duration-300
              ${disabled ? "text-[var(--muted)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"}`}
            >
              {game.gameName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!disabled && game.tagId && (
              <span
                className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5 shadow-xl flex items-center gap-1.5 transition-all group-hover:translate-y-[-1px]"
                style={{
                  background: `${game.tagId.tagBackground}22`,
                  color: game.tagId.tagColor,
                  borderColor: `${game.tagId.tagBackground}44`,
                }}
              >
                {game.tagId.tagName === "Manual" && <FiZap size={12} fill="currentColor" className="animate-pulse" />}
                {game.tagId.tagName}
              </span>
            )}
            {disabled && (
              <span className="px-3 py-1.5 rounded-xl bg-red-400/10 border border-red-400/20 text-red-500/60 text-[8px] font-black uppercase tracking-widest italic">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* ACTION SYSTEM */}
        {!disabled && (
          <div className="relative shrink-0 pr-4">
            <div className="absolute inset-0 bg-[var(--accent)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:text-black group-hover:bg-[var(--accent)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] group-hover:rotate-[-45deg]">
              <FiArrowRight size={24} className="transition-transform duration-500 group-hover:rotate-[45deg]" />
            </div>
          </div>
        )}

        {/* HOVER ACCENT LINE */}
        {!disabled && (
          <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[var(--accent)] group-hover:h-16 transition-all duration-700 rounded-r-full shadow-[0_0_20px_var(--accent)]" />
        )}
      </Link>
    </div>
  );
}

