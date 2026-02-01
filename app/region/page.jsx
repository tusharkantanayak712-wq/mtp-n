"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, User, MapPin, CheckCircle, XCircle } from "lucide-react";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";
import RecentVerifiedPlayers from "./RecentVerifiedPlayers";
import { FiTarget, FiBox } from "react-icons/fi";

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
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-24 transition-colors duration-300 px-6">

      <div className="max-w-lg mx-auto pt-12 md:pt-20">

        {/* HEADER - CLEAN & BOLD */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-[900] italic tracking-tighter uppercase leading-none mb-2">
            REGION <span className="text-[var(--accent)]">SCANNER</span>
          </h1>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
            Verification Portal
          </p>
        </motion.div>

        {/* SCANNER CARD - MINIMAL PREMIUM */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-xl"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player ID */}
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors"
                  size={16}
                />
                <input
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] outline-none text-[12px] font-bold tracking-wider uppercase focus:border-[var(--accent)]/40 transition-all"
                  placeholder="PLAYER ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              {/* Zone ID */}
              <div className="relative group">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors"
                  size={16}
                />
                <input
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] outline-none text-[12px] font-bold tracking-wider uppercase focus:border-[var(--accent)]/40 transition-all"
                  placeholder="ZONE"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
            </div>

            {/* Scan Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCheck}
              disabled={loading || !id || !zone}
              className="
                w-full py-4 rounded-2xl font-black text-black uppercase tracking-[0.2em] italic text-xs
                bg-[var(--accent)] hover:opacity-90 disabled:opacity-30 transition-all
                flex items-center justify-center gap-2
              "
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <FiTarget size={16} />
                  <span>Check Region</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* RESULT SECTION - STREAMLINED */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.success}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                mt-6 rounded-2xl p-6 border
                ${result.success === 200
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-rose-500/5 border-rose-500/20"
                }
              `}
            >
              {result.success === 200 ? (
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1 leading-none">Verified Player</p>
                    <h2 className="text-xl font-[900] italic uppercase text-[var(--foreground)] truncate leading-none mb-2">
                      {result.data?.username}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-emerald-500/80 tracking-tighter">{result.data?.region}</span>
                      <span className="text-[10px] font-bold uppercase text-gray-600">Region Identified</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 py-2 text-rose-500">
                  <XCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Player ID Not Found</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RECENT PLAYERS */}
        <div className="mt-12">
          <RecentVerifiedPlayers
            limit={10}
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
