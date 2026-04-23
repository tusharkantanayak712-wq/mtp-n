"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiRefreshCw, FiInfo, FiBox, FiUnlock, FiLock, FiPlay, FiAlertCircle } from "react-icons/fi";
import { ADS_CONFIG } from "@/lib/adsConfig";
import confetti from "canvas-confetti";

interface TreasureGameProps {
  coins: number;
  onWin: (amount: number, newBalance: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function TreasureGame({ coins, onWin, showToast }: TreasureGameProps) {
  const [hasWatched, setHasWatched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [opening, setOpening] = useState<number | null>(null);
  const [result, setResult] = useState<{ index: number; win: number } | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (cooldown > now) {
      const timer = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown, now]);

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

  const handleWatchAd = () => {
    window.open(ADS_CONFIG.ADSTERRA_LINK, '_blank');
    setIsVerifying(true);
    setVerifyTimer(7); // 7 second verification
  };

  const handlePick = async (index: number) => {
    if (!hasWatched || opening !== null || cooldown > now || result !== null) return;

    setOpening(index);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/coins/game/spin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: "treasure" })
      });
      const data = await res.json();

      if (data.success) {
        const winAmount = data.outcome;

        // Simulate delay for excitement
        setTimeout(() => {
          setResult({ index, win: winAmount });
          if (winAmount > 0) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#3b82f6', '#60a5fa', '#ffffff']
            });
            showToast("Jackpot! You found a BBC coin!", "success");
            onWin(winAmount, data.newBalance);
          } else if (winAmount < 0) {
            showToast("Oops! You lost 1 BBC coin.", "error");
            onWin(winAmount, data.newBalance);
          } else {
            showToast("Empty chest! Try another one later.", "success");
          }
          setCooldown(Date.now() + 25000); // 25s cooldown
          setOpening(null);
          setHasWatched(false); // Reset ad state
        }, 1500);
      } else {
        showToast(data.message || "Failed to open chest", "error");
        setOpening(null);
      }
    } catch (err) {
      showToast("Connection error", "error");
      setOpening(null);
    }
  };

  const timeLeft = Math.max(0, Math.ceil((cooldown - now) / 1000));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-6 flex flex-col items-center gap-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="text-center space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">Treasure Pick</h3>
        <p className="text-[9px] font-bold text-[var(--muted)]/60 uppercase">Pick 1 of 6 chests! High stakes: Win or Lose BBC</p>
      </div>

      {/* CHESTS GRID */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.button
            key={i}
            whileHover={hasWatched && opening === null && timeLeft === 0 && result === null ? { scale: 1.05, y: -5 } : {}}
            whileTap={hasWatched && opening === null && timeLeft === 0 && result === null ? { scale: 0.95 } : {}}
            onClick={() => handlePick(i)}
            disabled={!hasWatched || opening !== null || timeLeft > 0 || result !== null}
            className={`relative aspect-square rounded-2xl border transition-all flex items-center justify-center group ${
              opening === i 
                ? "bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/10" 
                : result?.index === i
                  ? result.win > 0 
                    ? "bg-amber-500/20 border-amber-500/40" 
                    : result.win < 0 
                      ? "bg-rose-500/20 border-rose-500/40"
                      : "bg-gray-500/10 border-[var(--border)] opacity-40"
                  : !hasWatched && timeLeft === 0
                    ? "bg-[var(--card)]/20 border-[var(--border)]/50 grayscale opacity-50 cursor-not-allowed"
                    : "bg-[var(--card)]/40 border-[var(--border)] hover:bg-[var(--foreground)]/[0.03]"
            }`}
          >
            {opening === i ? (
              <FiRefreshCw className="text-blue-400 text-xl animate-spin" />
            ) : result?.index === i ? (
              result.win > 0 ? (
                <div className="flex flex-col items-center">
                  <FiStar className="text-amber-400 text-2xl animate-bounce" />
                  <span className="text-[8px] font-black text-amber-400 mt-1">+1 BBC</span>
                </div>
              ) : result.win < 0 ? (
                <div className="flex flex-col items-center">
                  <FiAlertCircle className="text-rose-400 text-2xl animate-pulse" />
                  <span className="text-[8px] font-black text-rose-400 mt-1">-1 BBC</span>
                </div>
              ) : (
                <FiBox className="text-[var(--muted)]/20 text-xl" />
              )
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FiBox className={`text-xl transition-colors ${timeLeft > 0 || !hasWatched ? "text-[var(--muted)]/20" : "text-blue-400/40 group-hover:text-blue-400"}`} />
                <span className="text-[7px] font-black text-[var(--muted)]/20 uppercase tracking-widest">Chest {i+1}</span>
              </div>
            )}

            {!hasWatched && timeLeft === 0 && result === null && (
              <FiLock className="absolute top-2 right-2 text-[var(--muted)]/40 text-[8px]" />
            )}
          </motion.button>
        ))}
      </div>

      {/* FOOTER INFO */}
      <div className="w-full max-w-[240px] space-y-3">
        {timeLeft > 0 ? (
          <div className="w-full py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center justify-center gap-2">
            <FiRefreshCw className="animate-spin text-xs" />
            Next Pick in {timeLeft}s
          </div>
        ) : result !== null ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setResult(null);
              setHasWatched(false);
            }}
            className="w-full py-3.5 rounded-xl bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
          >
            Play Again
          </motion.button>
        ) : isVerifying ? (
          <div className="w-full py-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-black uppercase tracking-widest text-amber-500 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <FiRefreshCw className="animate-spin text-xs" />
              Verifying Ad...
            </div>
            <span className="text-[8px] opacity-60">Please wait {verifyTimer}s</span>
          </div>
        ) : !hasWatched ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWatchAd}
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            <FiPlay className="text-xs" />
            Watch Ad to Unlock
          </motion.button>
        ) : (
          <div className="w-full py-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-center gap-2 animate-pulse">
            <FiUnlock className="text-xs" />
            Pick a Chest Now!
          </div>
        )}
      </div>

    </div>
  );
}
