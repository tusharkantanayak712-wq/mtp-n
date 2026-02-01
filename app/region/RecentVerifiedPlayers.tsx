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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FiRotateCcw size={14} className="text-[var(--accent)]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] opacity-60">
            RECENT SCANS
          </h3>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-2">
        <AnimatePresence>
          {players.map((p, index) => (
            <motion.button
              key={`${p.playerId}-${p.zoneId}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 3, backgroundColor: "var(--card)" }}
              onClick={() => onSelect(p)}
              className="
                w-full text-left
                rounded-2xl border border-[var(--border)]
                bg-[var(--card)]/40 hover:border-[var(--accent)]/30
                transition-all duration-200
                p-4 group flex items-center justify-between gap-4
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]/60 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                  <FiShield size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-[900] uppercase tracking-tight italic truncate text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-none mb-1.5">
                    {p.username || "UNKNOWN PLAYER"}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--muted)] opacity-40 uppercase tracking-tighter">
                    <span>ID {p.playerId}</span>
                    <span>·</span>
                    <span>SERVER {p.zoneId}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block text-[9px] font-black text-[var(--accent)] tracking-widest uppercase italic mb-1">
                  {p.region || "N/A"}
                </span>
                {p.savedAt && (
                  <div className="flex items-center justify-end gap-1 text-[8px] font-bold text-[var(--muted)] opacity-30 uppercase">
                    <FiClock size={8} />
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
