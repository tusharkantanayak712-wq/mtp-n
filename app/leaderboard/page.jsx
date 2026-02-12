"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import { FiUsers, FiDollarSign } from "react-icons/fi";

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");
  const [type, setType] = useState("purchase"); // "purchase" | "referral"

  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(`/api/leaderboard?limit=${limit}&range=${range}&type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.success ? res.data : []);
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [range, type]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 pb-32 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-6 pt-12 md:pt-24 relative z-10">

          {/* 🏆 HEADER SECTION */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-[900] italic tracking-tighter uppercase leading-none mb-2 transition-colors text-center md:text-left flex flex-col md:block">
              {type === "purchase" ? (
                <>ELITE <span className="text-[var(--accent)]">SPENDORS</span></>
              ) : (
                <>TOP <span className="text-[var(--accent)]">RECRUITERS</span></>
              )}
            </h1>
            <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic text-center md:text-left">
              The Legend Board
            </p>
          </motion.div>

          {/* 🎛️ CONTROLS SECTION */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* TYPE TOGGLE */}
            <div className="bg-[var(--card)] p-1 rounded-2xl flex w-full border border-[var(--border)] transition-colors">
              {[
                { id: "purchase", label: "Top Spenders", icon: FiDollarSign },
                { id: "referral", label: "Top Referrers", icon: FiUsers }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${type === t.id
                    ? "bg-[var(--accent)] text-black shadow-lg"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* RANGE TOGGLE */}
            <div className="bg-[var(--card)] p-1 rounded-2xl flex w-full sm:w-auto border border-[var(--border)] transition-colors">
              {["weekly", "monthly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${range === r
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                  {r === "weekly" ? "Week" : "Month"}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mb-4" />
                <span className="text-[9px] font-black tracking-widest text-[var(--muted)] uppercase opacity-40 italic">Syncing Data...</span>
              </motion.div>
            ) : data.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 text-[var(--muted)] font-black uppercase tracking-[0.3em] text-[11px] italic opacity-20 transition-opacity"
              >
                The Throne is Empty
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 3, backgroundColor: "var(--card)" }}
                    className={`
                      relative group flex items-center p-5 rounded-2xl border transition-all duration-300
                      ${index === 0
                        ? "bg-[var(--card)] border-[var(--accent)]/20 shadow-xl"
                        : "bg-[var(--card)]/40 border-[var(--border)] hover:border-[var(--accent)]/30"
                      }
                    `}
                  >
                    {/* Rank Indicator */}
                    <div className="flex items-center justify-center w-10">
                      {index === 0 ? (
                        <span className="text-2xl drop-shadow-lg">🥇</span>
                      ) : (
                        <span className={`text-xl font-black italic ${index < 3 ? "text-[var(--foreground)]" : "text-[var(--muted)] opacity-20"} group-hover:opacity-100 transition-opacity`}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* User Profile */}
                    <div className="flex-1 min-w-0 ml-4">
                      <p className={`font-[900] uppercase italic tracking-tight truncate leading-none mb-1.5 transition-colors ${index === 0 ? "text-[var(--foreground)] text-lg" : "text-[var(--foreground)] text-base group-hover:text-[var(--accent)]"}`}>
                        {item.user?.name || "ANONYMOUS"}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--muted)] opacity-40 uppercase tracking-tighter">
                        <span>UID {item.user?.userId || "—"}</span>
                        {index === 0 && <span className="text-[var(--accent)] opacity-100 font-black tracking-widest ml-1">#1 CHAMPION</span>}
                      </div>
                    </div>

                    {/* Metric Detail */}
                    <div className="text-right ml-4">
                      <div className={`font-black italic tracking-tighter transition-all origin-right flex items-center justify-end ${index === 0 ? "text-3xl text-[var(--foreground)]" : "text-xl text-[var(--foreground)] group-hover:scale-110"}`}>
                        {type === "purchase" ? (
                          <>
                            <span className="text-[var(--accent)] mr-1">₹</span>
                            {item.totalSpent?.toLocaleString()}
                          </>
                        ) : (
                          <>
                            <span className="text-[var(--accent)] mr-2">{item.referralCount}</span>
                            <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-60 self-center mt-1">Ref</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Subtle Side Glow for Rank #1 */}
                    {index === 0 && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)] rounded-l-2xl shadow-[0_0_15px_rgba(var(--accent-rgb),0.4)]" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  );
}
