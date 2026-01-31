"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

export default function GameCardList({ game, isOutOfStock, index = 0 }) {
  const disabled = isOutOfStock(game.gameName);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        href={disabled ? "#" : `/games/${game.gameSlug}`}
        className={`group flex items-center gap-4 p-3 rounded-xl border
        bg-[var(--card)] backdrop-blur transition-all duration-300
        ${disabled
            ? "opacity-80 pointer-events-none border-[var(--border)]"
            : "hover:shadow-lg hover:border-[var(--accent)] border-[var(--border)]"
          }`}
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={game.gameImageId?.image || logo}
            alt={game.gameName}
            fill
            className={`object-cover transition-all duration-300
              ${disabled
                ? "grayscale blur-[1.5px] scale-105"
                : "group-hover:scale-110"
              }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold truncate mb-0.5 transition-colors
            ${disabled
                ? "text-[var(--muted)]"
                : "group-hover:text-[var(--accent)]"
              }`}
          >
            {game.gameName}
          </h3>

          <p className="text-xs text-[var(--muted)] mb-1.5">{game.gameFrom}</p>

          {!disabled && game.tagId && (
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: game.tagId.tagBackground,
                color: game.tagId.tagColor,
              }}
            >
              {game.tagId.tagName}
            </span>
          )}
        </div>

        {disabled && (
          <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0">
            Out of Stock
          </span>
        )}
      </Link>
    </motion.div>
  );
}
