"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiRefreshCw, FiPlay, FiTarget, FiAlertCircle, FiClock, FiStar } from "react-icons/fi";
import { ADS_CONFIG } from "@/lib/adsConfig";
import confetti from "canvas-confetti";

interface CrashGameProps {
  coins: number;
  onWin: (amount: number, newBalance: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function CrashGame({ coins, onWin, showToast }: CrashGameProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "crashed" | "cashed_out">("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [now, setNow] = useState(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleAdClick = () => {
    if (gameState === "playing" || isVerifying || hasWatched) return;
    window.open(ADS_CONFIG.ADSTERRA_LINK, '_blank');
    setIsVerifying(true);
    setVerifyTimer(7);
  };

  useEffect(() => {
    if (isVerifying && verifyTimer > 0) {
      const timer = setInterval(() => {
        setVerifyTimer(prev => {
          if (prev <= 1) {
            setIsVerifying(false);
            setHasWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVerifying, verifyTimer]);

  const startGame = () => {
    if (!hasWatched || gameState === "playing") return;
    setGameState("playing");
    setMultiplier(1.0);
    setCrashPoint(null);
    startTimeRef.current = Date.now();

    // The "fake" local multiplier just for UI
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      // Faster growth: multiplier = 1.25^elapsed, capped at 10
      const nextMult = Math.min(10, Math.pow(1.25, elapsed));
      setMultiplier(nextMult);

      // Auto-cap if it hits 10.0
      if (nextMult >= 10) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 50);
  };

  const handleCashOut = async () => {
    if (gameState !== "playing" || loading) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    const finalMult = Math.min(10, multiplier);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/coins/game/spin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: "crash", multiplier: finalMult })
      });
      const data = await res.json();

      if (data.success) {
        setCooldown(Date.now() + 25000);
        if (data.outcome > 0) {
          setGameState("cashed_out");
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#60a5fa', '#ffffff']
          });
          showToast(`Won +${data.outcome} BBC!`, "success");
        } else {
          setGameState("crashed");
          setMultiplier(data.crashPoint);
          showToast(`Blast at ${data.crashPoint.toFixed(2)}x! Lost -2 BBC`, "error");
        }
        onWin(data.outcome, data.newBalance);
      } else if (data.message?.includes("Wait")) {
        const seconds = parseInt(data.message.match(/\d+/)?.[0] || "25");
        setCooldown(Date.now() + (seconds * 1000));
        showToast(data.message, "error");
        setGameState("idle");
      } else {
        showToast(data.message || "Failed to cash out", "error");
        setGameState("idle");
      }
    } catch (err) {
      showToast("Connection error", "error");
      setGameState("idle");
    } finally {
      setLoading(false);
      setHasWatched(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-6 flex flex-col gap-6 relative overflow-hidden">

      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">Crash Race</h3>
          <p className="text-[9px] font-bold text-[var(--muted)]/60 uppercase">Max 10x Reward · High Velocity</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[7px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">High Stakes</span>
        </div>
      </div>

      {/* MULTIPLIER DISPLAY */}
      <div className="relative h-48 bg-[var(--background)]/40 rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center overflow-hidden">

        {/* Simple Graph Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <motion.div
          key={gameState}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <span className={`text-6xl font-[1000] tabular-nums tracking-tighter ${gameState === "crashed" ? "text-rose-500" : gameState === "cashed_out" ? "text-emerald-400" : "text-blue-400"
            }`}>
            {multiplier.toFixed(2)}x
          </span>
          {gameState === "crashed" && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/60 mt-2">Blast!</span>
          )}
          {gameState === "cashed_out" && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mt-2">Safe!</span>
          )}
        </motion.div>

        {/* Glow behind multiplier */}
        <div className={`absolute w-32 h-32 blur-[80px] rounded-full transition-colors duration-500 ${gameState === "crashed" ? "bg-rose-500/20" : "bg-blue-500/20"
          }`} />
      </div>

      {/* CONTROLS */}
      <div className="space-y-3">
        {gameState === "idle" || gameState === "crashed" || gameState === "cashed_out" ? (
          <>
            {cooldown > now ? (
              <div className="w-full py-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center justify-center gap-2">
                <FiRefreshCw className="animate-spin text-xs" />
                Wait {Math.ceil((cooldown - now) / 1000)}s
              </div>
            ) : !hasWatched && !isVerifying ? (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAdClick}
                className="w-full py-4 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <FiPlay /> Watch Ad to Start
              </motion.button>
            ) : isVerifying ? (
              <div className="w-full py-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] font-black uppercase tracking-widest text-blue-400 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="animate-spin text-xs" />
                  Verifying...
                </div>
                <span className="text-[8px] opacity-60">Wait {verifyTimer}s</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="w-full py-4 rounded-xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <FiZap /> Start Race
              </motion.button>
            )}
          </>
        ) : (
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}
            onClick={handleCashOut}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <><FiTarget /> Cash Out Now</>}
          </motion.button>
        )}

        <div className="flex items-center justify-center gap-4 py-2 border-t border-[var(--border)]/30">
          <div className="flex items-center gap-1.5">
            <FiZap className="text-rose-500 text-[10px]" />
            <span className="text-[8px] font-bold text-[var(--muted)]/40 uppercase tracking-wide">High Stakes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiStar className="text-[var(--muted)]/40 text-[10px]" />
            <span className="text-[8px] font-bold text-[var(--muted)]/40 uppercase tracking-wide">Fee: 2 BBC on Blast</span>
          </div>
        </div>
      </div>

    </div>
  );
}
