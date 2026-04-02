"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { FiChevronRight, FiEye, FiZap } from "react-icons/fi";

export default function GameCardGrid({ game, isOutOfStock, index = 0 }) {
  const disabled = isOutOfStock(game.gameName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.03,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ y: -5 }}
    >
      <Link
        href={disabled ? "#" : `/games/${game.gameSlug}`}
        className={`group relative block rounded-2xl overflow-hidden border transition-all duration-500
        ${disabled
            ? "opacity-60 cursor-not-allowed border-[var(--border)] bg-[var(--background)]"
            : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
          }`}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={game.gameImageId?.image || logo}
            alt={game.gameName}
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
            className={`object-cover transition-all duration-700
              ${disabled
                ? "grayscale blur-[2px]"
                : "group-hover:scale-110 group-hover:rotate-1"
              }`}
          />

          {/* OVERLAYS */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* HOVER GLOW */}
          {!disabled && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial-gradient from-[var(--accent)]/20 via-transparent to-transparent pointer-events-none" />
          )}

          {/* TAG / BADGE */}
          {!disabled && game.tagId && (
            <div className="absolute top-3 left-3 z-20">
              <span
                className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-1"
                style={{
                  background: `${game.tagId.tagBackground}cc`,
                  color: game.tagId.tagColor,
                }}
              >
                {game.tagId.tagName === "Manual" && <FiZap size={10} fill="currentColor" />}
                {game.tagId.tagName}
              </span>
            </div>
          )}

          {/* VIEW BUTTON (HOVER ONLY) */}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-95">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                <FiEye size={16} />
              </div>
            </div>
          )}

          {/* OUT OF STOCK OVERLAY */}
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <span className="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-[8px] font-black uppercase tracking-widest italic shadow-2xl text-center leading-tight">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-2 sm:p-2.5 relative">
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className={`text-[10px] sm:text-xs font-black uppercase tracking-tight leading-tight line-clamp-2 transition-colors
              ${disabled ? "text-[var(--muted)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"}`}
            >
              {game.gameName}
            </h3>
            {!disabled && (
              <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-all group-hover:translate-x-0.5" size={12} />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
