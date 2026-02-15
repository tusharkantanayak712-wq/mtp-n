"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiArrowRight, FiClock, FiRotateCcw } from "react-icons/fi";
import { getVerifiedPlayers } from "@/utils/storage/verifiedPlayerStorage";

function timeAgo(ts?: number) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "NOW";
  if (min < 60) return `${min}M AGO`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}H AGO`;
  const d = Math.floor(hr / 24);
  return `${d}D AGO`;
}

export default function RecentVerifiedPlayers({
  onSelect,
  limit = 10,
}: {
  onSelect: (player: any) => void;
  limit?: number;
}) {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    setPlayers(getVerifiedPlayers(limit));
  }, [limit]);

  if (!players.length) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FiRotateCcw size={12} className="text-[var(--accent)]" />
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-60">
            RECENT SCANS
          </h3>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-1.5">
        <AnimatePresence>
          {players.map((p, index) => (
            <motion.button
              key={`${p.playerId}-${p.zoneId}-${index}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 3, backgroundColor: "var(--card)" }}
              onClick={() => onSelect(p)}
              className="
                w-full text-left
                rounded-xl border border-white/5
                bg-white/[0.03] hover:border-[var(--accent)]/30
                transition-all duration-300
                p-2.5 px-3 group flex items-center justify-between gap-3
              "
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center text-[var(--accent)]/60 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                  <FiShield size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-tight italic truncate text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-none mb-1">
                    {p.username || "UNKNOWN PLAYER"}
                  </p>
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-[var(--muted)] opacity-40 uppercase tracking-tighter">
                    <span>{p.playerId}</span>
                    <span className="opacity-50">/</span>
                    <span>{p.zoneId}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block text-[8px] font-black text-[var(--accent)] tracking-widest uppercase italic mb-0.5">
                  {p.region || "N/A"}
                </span>
                {p.savedAt && (
                  <div className="flex items-center justify-end gap-1 text-[7px] font-bold text-[var(--muted)] opacity-30 uppercase">
                    <FiClock size={7} />
                    {timeAgo(p.savedAt)}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

