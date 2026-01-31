"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, History } from "lucide-react";
import { getVerifiedPlayers } from "@/utils/storage/verifiedPlayerStorage";

function timeAgo(ts?: number) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <History size={16} className="text-[var(--accent)]" />
          Recent Verified IDs
        </div>
        <span className="text-xs text-[var(--muted)]">
          {players.length} saved
        </span>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-2">
        {players.map((p, index) => (
          <motion.button
            key={`${p.playerId}-${p.zoneId}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            onClick={() => onSelect(p)}
            className="
              w-full text-left
              rounded-xl border border-[var(--border)]
              bg-[var(--muted)]/5 hover:bg-[var(--muted)]/10
              hover:border-[var(--accent)]
              transition-all
              p-3
            "
          >
            <div className="flex items-start justify-between gap-3">
              {/* LEFT */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight truncate">
                  {p.username || "Unknown Player"}
                </p>

                <p className="text-xs text-[var(--muted)] mt-0.5">
                  ID {p.playerId} · Zone {p.zoneId}
                </p>

                {p.savedAt && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--muted)]">
                    <Clock size={12} />
                    {timeAgo(p.savedAt)}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <span
                className="
                  text-[10px] font-medium
                  px-2 py-1 rounded-full
                  bg-[var(--accent)]/10
                  text-[var(--accent)]
                  whitespace-nowrap
                  flex-shrink-0
                "
              >
                {p.region}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
