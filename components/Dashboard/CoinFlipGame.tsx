"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiInfo, FiZap, FiPlay } from "react-icons/fi";
import { ADS_CONFIG } from "@/lib/adsConfig";
import confetti from "canvas-confetti";

interface CoinFlipGameProps {
  coins: number;
  onWin: (amount: number, newBalance: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function CoinFlipGame({ coins, onWin, showToast }: CoinFlipGameProps) {
  const [side, setSide] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [lastOutcome, setLastOutcome] = useState<number | null>(null);
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

  const handleAdClick = () => {
    if (!side || flipping || cooldown > now || hasWatched || isVerifying) return;
    window.open(ADS_CONFIG.ADSTERRA_LINK, '_blank');
    setIsVerifying(true);
    setVerifyTimer(7);
  };

  const handleStartFlip = async () => {
    if (!side || flipping || cooldown > now || !hasWatched) return;

    setFlipping(true);
    setResult(null);
    setLastOutcome(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/coins/game/spin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: "coinflip", side })
      });
      const data = await res.json();

      if (data.success) {
        const winningSide = data.winningSide;
        const outcome = data.outcome;

        setTimeout(() => {
          setResult(winningSide);
          if (outcome > 0) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#818cf8', '#ffffff']
            });
            showToast(`Heads or Tails? You were right! +${outcome} BBC`, "success");
          } else {
            showToast(`Wrong guess! You lost ${Math.abs(outcome)} BBC.`, "error");
          }
          setLastOutcome(outcome);
          onWin(outcome, data.newBalance);
          setCooldown(Date.now() + 25000);
          setFlipping(false);
          setHasWatched(false);
        }, 2000); // 2s animation
      } else {
        showToast(data.message || "Failed to start flip", "error");
        setFlipping(false);
      }
    } catch (err) {
      showToast("Connection error", "error");
      setFlipping(false);
    }
  };

  const timeLeft = Math.max(0, Math.ceil((cooldown - now) / 1000));

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-6 flex flex-col items-center gap-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="text-center space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Coin Flip</h3>
        <p className="text-[9px] font-bold text-[var(--muted)]/60 uppercase">Heads or Tails? Play every 25 seconds!</p>
      </div>

      {/* COIN VISUAL */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          animate={flipping ? { 
            rotateY: [0, 720, 1440, 2160, 2880],
            y: [0, -100, 0]
          } : { rotateY: result === "tails" ? 180 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-24 h-24 relative preserve-3d"
        >
          {/* Heads Side */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 flex items-center justify-center backface-hidden shadow-2xl">
            <span className="text-2xl font-black text-amber-900">H</span>
          </div>
          {/* Tails Side */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-4 border-indigo-300 flex items-center justify-center backface-hidden shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
            <span className="text-2xl font-black text-indigo-900">T</span>
          </div>
        </motion.div>
        
        {/* Shadow under coin */}
        <div className="absolute bottom-0 w-16 h-2 bg-black/20 blur-md rounded-full" />
      </div>

      {/* CHOICES */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
        <button
          onClick={() => setSide("heads")}
          disabled={flipping || timeLeft > 0}
          className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
            side === "heads" ? "bg-amber-500/20 border-amber-500/40 shadow-lg shadow-amber-500/10" : "bg-[var(--card)]/40 border-[var(--border)] hover:bg-amber-500/10"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="font-black text-amber-500">H</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Heads</span>
        </button>

        <button
          onClick={() => setSide("tails")}
          disabled={flipping || timeLeft > 0}
          className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
            side === "tails" ? "bg-indigo-500/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10" : "bg-[var(--card)]/40 border-[var(--border)] hover:bg-indigo-500/10"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="font-black text-indigo-400">T</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Tails</span>
        </button>
      </div>

      {/* FOOTER INFO */}
      <div className="w-full max-w-[240px] space-y-3">
        {/* Last Result Badge */}
        <AnimatePresence>
          {lastOutcome !== null && !flipping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-center gap-1.5 mb-2 text-[10px] font-black uppercase tracking-tighter ${
                lastOutcome > 0 ? "text-emerald-400" : "text-rose-500"
              }`}
            >
              <span>Last Result:</span>
              <span className="bg-[var(--foreground)]/5 px-2 py-0.5 rounded-md border border-[var(--border)]">
                {lastOutcome > 0 ? `+${lastOutcome} BBC` : `${lastOutcome} BBC`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {timeLeft > 0 ? (
          <div className="w-full py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center justify-center gap-2">
            <FiRefreshCw className="animate-spin text-xs" />
            Wait {timeLeft}s
          </div>
        ) : (
          <div className="space-y-3">
            {isVerifying ? (
              <div className="w-full py-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-black uppercase tracking-widest text-amber-500 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="animate-spin text-xs" />
                  Verifying Ad...
                </div>
                <span className="text-[8px] opacity-60">Please wait {verifyTimer}s</span>
              </div>
            ) : !hasWatched ? (
              <button
                onClick={handleAdClick}
                disabled={!side}
                className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  !side 
                    ? "bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--muted)]/40" 
                    : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
                }`}
              >
                <FiPlay className="text-xs" />
                Watch Ad to Flip
              </button>
            ) : (
              <button
                onClick={handleStartFlip}
                disabled={flipping}
                className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400`}
              >
                {flipping ? <FiRefreshCw className="animate-spin text-xs" /> : <FiZap className="text-xs" />}
                {flipping ? "Flipping..." : "Flip Now!"}
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg">
              <span className="text-[7px] font-black text-rose-400 uppercase tracking-widest">High Stakes: +/- 2 BBC</span>
            </div>
          </div>
        )}
      </div>

      {/* Rules Section */}
      <div className="w-full border-t border-[var(--border)] pt-4 mt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-3 bg-indigo-500 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Rules & Rewards</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { t: "Pick Side", d: "Heads or Tails" },
            { t: "Condition", d: "Watch 7s Ad" },
            { t: "Win", d: "Gain +2 BBC" },
            { t: "Loss", d: "Lose -2 BBC" }
          ].map((rule, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-[var(--foreground)]/[0.02] border border-[var(--border)]/50">
              <p className="text-[7px] font-black uppercase text-indigo-500/60 leading-none mb-1">{rule.t}</p>
              <p className="text-[9px] font-bold text-[var(--muted)] leading-tight">{rule.d}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {lastOutcome !== null && !flipping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex items-center justify-center p-6"
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-4 shadow-2xl min-w-[200px]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 ${
                lastOutcome > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
              }`}>
                <FiZap className={`text-2xl animate-bounce ${lastOutcome > 0 ? "text-emerald-500" : "text-rose-500"}`} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase italic">
                  {lastOutcome > 0 ? "Winner!" : "Unlucky!"}
                </h4>
                <p className="text-xs text-[var(--muted)] font-bold uppercase mt-1">
                  {lastOutcome > 0 ? `You won +${lastOutcome} BBC` : `You lost ${Math.abs(lastOutcome)} BBC`}
                </p>
              </div>
              <button 
                onClick={() => setLastOutcome(null)}
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
