"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiRefreshCw, FiStar, FiInfo, FiPlay } from "react-icons/fi";
import { ADS_CONFIG } from "@/lib/adsConfig";
import confetti from "canvas-confetti";

interface RouletteGameProps {
  coins: number;
  onWin: (amount: number, newBalance: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function RouletteGame({ coins, onWin, showToast }: RouletteGameProps) {
  const [spinning, setSpinning] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [cooldown, setCooldown] = useState<number>(0);

  // Timer logic to refresh UI every second during cooldown
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

  const outcomes = [0, 0, 0, 1, -1]; // 5 segments
  const colors = [
    "bg-rose-500/20", "bg-sky-500/20", "bg-indigo-500/20", 
    "bg-amber-500/40", "bg-violet-600/40"
  ];

  const handleAdClick = () => {
    if (spinning || cooldown > now || hasWatched || isVerifying) return;
    window.open(ADS_CONFIG.ADSTERRA_LINK, '_blank');
    setIsVerifying(true);
    setVerifyTimer(7);
  };

  const handleStartSpin = async () => {
    if (spinning || cooldown > now || !hasWatched) return;

    setSpinning(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/coins/game/spin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: "roulette" })
      });
      const data = await res.json();
      
      if (data.success) {
        const winAmount = data.outcome;
        const randomIndex = data.index; // Server-side chosen segment

        // Calculate new rotation: 
        const newRotation = rotation + 1800 + (randomIndex * 72); 
        setRotation(newRotation);

        // Wait for animation
        setTimeout(() => {
          setResult(winAmount);
          if (winAmount > 0) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#ffffff']
            });
            showToast(`You won ${winAmount} BBC!`, "success");
            onWin(winAmount, data.newBalance);
          } else if (winAmount < 0) {
            showToast("Unlucky! You lost 1 BBC.", "error");
            onWin(winAmount, data.newBalance);
          } else {
            showToast("Better luck next time!", "success");
          }
          setCooldown(Date.now() + 25000);
          setSpinning(false);
          setHasWatched(false);
        }, 4000); // 4s animation
      } else {
        showToast(data.message || "Failed to start spin", "error");
        setSpinning(false);
      }
    } catch (err) {
      showToast("Connection error", "error");
      setSpinning(false);
    }
  };

  const timeLeft = Math.max(0, Math.ceil((cooldown - now) / 1000));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-6 flex flex-col items-center gap-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="text-center space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Lucky Spin</h3>
        <p className="text-[9px] font-bold text-[var(--muted)]/60 uppercase">Spin to win 1 BBC every 25 seconds!</p>
      </div>

      {/* ROULETTE WHEEL UI */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* The Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-500 drop-shadow-xl" />
        </div>

        {/* The Wheel */}
        <div 
          className="w-full h-full rounded-full border-4 border-[var(--border)] relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1) shadow-2xl overflow-hidden"
          style={{ 
            transform: `rotate(-${rotation}deg)`,
            background: `conic-gradient(
              #f43f5e33 0deg 72deg, 
              #0ea5e933 72deg 144deg, 
              #6366f133 144deg 216deg, 
              #f59e0b66 216deg 288deg, 
              #7c3aed66 288deg 360deg
            )`
          }}
        >
          {/* Prize Labels */}
          {outcomes.map((val, i) => (
            <div 
              key={i}
              className="absolute top-0 left-0 w-full h-full flex items-start justify-center"
              style={{ transform: `rotate(${i * 72 + 36}deg)` }}
            >
              <div className="pt-6 flex flex-col items-center gap-0.5">
                <span className="text-[14px] font-black text-white drop-shadow-md">{val}</span>
                <FiStar className="text-[8px] text-amber-500" />
              </div>
            </div>
          ))}
          
          {/* Inner Circle Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--card)] border-2 border-[var(--border)] z-10 flex items-center justify-center shadow-inner">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* SPIN BUTTON */}
      <div className="w-full max-w-[200px] space-y-3">
        {/* Last Result Badge */}
        <AnimatePresence>
          {result !== null && !spinning && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-center gap-1.5 mb-2 text-[10px] font-black uppercase tracking-tighter ${
                result > 0 ? "text-emerald-400" : result < 0 ? "text-rose-500" : "text-[var(--muted)]"
              }`}
            >
              <span>Last Result:</span>
              <span className="bg-[var(--foreground)]/5 px-2 py-0.5 rounded-md border border-[var(--border)]">
                {result > 0 ? `+${result} BBC` : result < 0 ? `${result} BBC` : "0 BBC"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {timeLeft > 0 ? (
          <div className="w-full py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center justify-center gap-2">
            <FiRefreshCw className="animate-spin text-xs" />
            Wait {timeLeft}s
          </div>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdClick}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400"
          >
            <FiPlay className="text-xs" />
            Watch Ad to Spin
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: spinning ? 1 : 1.05 }}
            whileTap={{ scale: spinning ? 1 : 0.95 }}
            onClick={handleStartSpin}
            disabled={spinning}
            className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${
              spinning 
              ? "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]/40"
              : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
            }`}
          >
            {spinning ? (
              <FiRefreshCw className="animate-spin" />
            ) : (
              <><FiZap className="text-xs" /> Spin Now!</>
            )}
          </motion.button>
        )}

        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-lg">
          <FiInfo className="text-[var(--muted)]/40 text-[10px]" />
          <span className="text-[8px] font-bold text-[var(--muted)]/40 uppercase tracking-wide">Costs 0 BBC to play</span>
        </div>
      </div>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {result !== null && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-center z-30 flex items-center justify-center p-6"
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto border-2 border-amber-500/20">
                <FiStar className="text-amber-500 text-2xl animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase italic">
                  {result > 0 ? "Jackpot!" : result < 0 ? "Oh No!" : "Aww, Snap!"}
                </h4>
                <p className="text-xs text-[var(--muted)] font-bold uppercase mt-1">
                  {result > 0 ? `You got +${result} BBC` : result < 0 ? `You lost ${Math.abs(result)} BBC` : "No luck this time"}
                </p>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="w-full py-2 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
