"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, User, MapPin, CheckCircle, XCircle } from "lucide-react";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";
import RecentVerifiedPlayers from "./RecentVerifiedPlayers";
import { FiTarget, FiBox, FiUser, FiCheckCircle } from "react-icons/fi";

export default function RegionPage() {
  const [id, setId] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!id || !zone) return;
    setLoading(true);

    const res = await fetch("/api/check-region", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, zone }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);

    if (data?.success === 200) {
      saveVerifiedPlayer({
        playerId: id,
        zoneId: zone,
        username: data.data.username,
        region: data.data.region,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <section className="min-h-screen bg-[var(--background)] px-4 py-12 flex items-center justify-center">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--accent)]/20 shadow-inner">
            <FiTarget className="text-3xl text-[var(--accent)]" />
          </div>
          <h1 className="text-3xl font-[1000] uppercase tracking-tighter italic text-[var(--foreground)] mb-2">
            Region <span className="text-[var(--accent)]">Scanner</span>
          </h1>
          <p className="text-xs text-[var(--muted)] font-black uppercase tracking-[0.3em] opacity-60">Instant Database Verification</p>
        </motion.div>

        {/* SCANNER CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card)]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-3xl overflow-hidden relative"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Player ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] ml-1 opacity-60">Account ID</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-bold text-[var(--foreground)] placeholder-[var(--muted)]/30 focus:border-[var(--accent)]/50 focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
              </div>

              {/* Zone ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] ml-1 opacity-60">Region Node</label>
                <div className="relative group">
                  <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-bold text-[var(--foreground)] placeholder-[var(--muted)]/30 focus:border-[var(--accent)]/50 focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all"
                    placeholder="ZONE"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Scan Button */}
            <div className="relative group mt-6">
              <div className="absolute inset-0 bg-[var(--accent)] opacity-10 blur-xl group-hover:opacity-20 transition-opacity rounded-2xl" />
              <button
                onClick={handleCheck}
                disabled={loading || !id || !zone}
                className="relative w-full py-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-[0.2em] text-[13px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Synchronizing</span>
                  </>
                ) : (
                  <>
                    <span>Identify Region</span>
                    <FiCheckCircle className="text-lg" />
                  </>
                )}

                {/* Button Shimmer */}
                {!loading && (
                  <motion.div
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full skew-x-[-30deg]"
                  />
                )}
              </button>
            </div>
          </div>

          {/* RESULT AREA */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-8 rounded-3xl p-5 border shadow-inner ${result.success === 200 ? "bg-emerald-500/5 border-emerald-500/10" : "bg-rose-500/5 border-rose-500/10"
                  }`}
              >
                {result.success === 200 ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <CheckCircle size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60 mb-1 leading-none">Scanned Account</p>
                      <h2 className="text-xl font-[1000] italic uppercase text-[var(--foreground)] truncate leading-none mb-2">
                        {result.data?.username}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{result.data?.region}</span>
                        <span className="text-[10px] font-bold uppercase text-[var(--muted)] opacity-40">Active Instance</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 py-2 text-rose-400">
                    <XCircle size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Node Not Identified</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RECENT PLAYERS */}
        <div className="mt-12 opacity-80 hover:opacity-100 transition-opacity">
          <RecentVerifiedPlayers
            limit={LIMIT_RECENT}
            onSelect={(player) => {
              setId(player.playerId);
              setZone(player.zoneId);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    </section>
  );
}

const LIMIT_RECENT = 5;

