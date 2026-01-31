"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, User, MapPin, CheckCircle, XCircle } from "lucide-react";
import HelpImagePopup from "../../components/HelpImage/HelpImagePopup";
import { saveVerifiedPlayer } from "@/utils/storage/verifiedPlayerStorage";
import RecentVerifiedPlayers from "./RecentVerifiedPlayers";

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
    <section className="min-h-screen pt-7 px-4 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-md mx-auto">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold">Check Player Region</h2>
            <p className="text-sm text-[var(--muted)]">
              Verify MLBB Player ID & Server
            </p>
          </div>
          <HelpImagePopup />
        </motion.div>

        {/* ================= CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-lg space-y-4"
        >
          {/* Player ID */}
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              size={18}
            />
            <input
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent border border-[var(--border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              placeholder="Player ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          {/* Zone ID */}
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              size={18}
            />
            <input
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent border border-[var(--border)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              placeholder="Zone ID"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={loading || !id || !zone}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]
              hover:opacity-90 disabled:opacity-50 transition
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Checking...
              </>
            ) : (
              "Check Region"
            )}
          </motion.button>
        </motion.div>

        {/* ================= RESULT ================= */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`
              mt-6 rounded-2xl p-4 border
              ${result.success === 200
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
              }
            `}
          >
            {result.success === 200 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle size={18} />
                  Player Verified
                </div>

                <p className="text-sm">
                  <span className="text-[var(--muted)]">Username:</span>{" "}
                  <span className="font-medium">{result.data?.username}</span>
                </p>

                <p className="text-sm">
                  <span className="text-[var(--muted)]">Region:</span>{" "}
                  <span className="font-medium">{result.data?.region}</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <XCircle size={18} />
                ID not found
              </div>
            )}
          </motion.div>
        )}

        {/* ================= RECENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <RecentVerifiedPlayers
            limit={10}
            onSelect={(player) => {
              setId(player.playerId);
              setZone(player.zoneId);
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
