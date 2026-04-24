"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiRefreshCw, FiPlay, FiZap, FiInfo } from "react-icons/fi";
import { ADS_CONFIG } from "@/lib/adsConfig";
import confetti from "canvas-confetti";

interface SlotMachineGameProps {
  coins: number;
  onWin: (amount: number, newBalance: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎"];

export default function SlotMachineGame({ coins, onWin, showToast }: SlotMachineGameProps) {
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([0, 1, 2]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [now, setNow] = useState(Date.now());

  const handleAdClick = () => {
    if (spinning || isVerifying || hasWatched) return;
    window.open(ADS_CONFIG.ADSTERRA_LINK, '_blank');
    setIsVerifying(true);
    setVerifyTimer(7);
  };

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

  const spin = async () => {
    if (!hasWatched || spinning) return;
    setSpinning(true);
    setLastResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/coins/game/spin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: "slot" })
      });
      const data = await res.json();

      if (data.success) {
        setCooldown(Date.now() + 25000); 
        // ... (existing animation logic)
        const finalReels = data.reels;
        let spins = 0;
        const interval = setInterval(() => {
          setReels([
            Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length),
            Math.floor(Math.random() * SYMBOLS.length)
          ]);
          spins++;
          if (spins > 20) {
            clearInterval(interval);
            setReels(finalReels);
            setSpinning(false);
            setHasWatched(false);
            setLastResult(data.outcome);
            if (data.outcome > 0) {
              confetti({ particleCount: 200, spread: 90, origin: { y: 0.7 }, colors: ['#f59e0b', '#fbbf24', '#ffffff'] });
              showToast(`You won ${data.outcome} BBC!`, "success");
            } else if (data.outcome < 0) {
              showToast("No match this time!", "error");
            }
            onWin(data.outcome, data.newBalance);
          }
        }, 100);
      } else if (data.message?.includes("Wait")) {
        const seconds = parseInt(data.message.match(/\d+/)?.[0] || "25");
        setCooldown(Date.now() + (seconds * 1000));
        showToast(data.message, "error");
        setSpinning(false);
      } else {
        showToast(data.message || "Failed to spin", "error");
        setSpinning(false);
      }
    } catch (err) {
      showToast("Connection error", "error");
      setSpinning(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-6 flex flex-col items-center gap-6 relative overflow-hidden">
        
        {/* Background Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-purple-400">Mega Slots</h3>
          <p className="text-[9px] font-bold text-[var(--muted)]/60 uppercase">Match 3 symbols to win big!</p>
        </div>

        {/* SLOT MACHINE UI */}
        <div className="flex gap-2 sm:gap-4">
          {reels.map((symbolIndex, i) => (
            <motion.div
              key={`${i}-${spinning}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-14 h-20 sm:w-20 sm:h-28 rounded-2xl bg-[var(--background)]/60 border-2 border-[var(--border)] flex items-center justify-center text-3xl sm:text-5xl shadow-inner relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={symbolIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {SYMBOLS[symbolIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* PAYTABLE PREVIEW */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
           <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--foreground)]/[0.03] border border-[var(--border)]">
              <span className="text-[10px]">💎💎💎</span>
              <span className="text-[10px] font-black text-emerald-400">+5 BBC</span>
           </div>
           <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--foreground)]/[0.03] border border-[var(--border)]">
              <span className="text-[10px]">⭐⭐⭐</span>
              <span className="text-[10px] font-black text-blue-400">+4 BBC</span>
           </div>
           <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--foreground)]/[0.03] border border-[var(--border)]">
              <span className="text-[10px]">🍒🍒🍒</span>
              <span className="text-[10px] font-black text-amber-500">+1 BBC</span>
           </div>
           <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--foreground)]/[0.03] border border-[var(--border)]">
              <span className="text-[10px]">Others</span>
              <span className="text-[10px] font-black text-rose-500">-1 BBC</span>
           </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full max-w-[220px] space-y-3">
          <AnimatePresence>
            {lastResult !== null && !spinning && cooldown <= now && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center justify-center gap-1.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                  lastResult > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                }`}
              >
                {lastResult > 0 ? `Won +${lastResult} BBC` : `Lost ${Math.abs(lastResult)} BBC`}
              </motion.div>
            )}
          </AnimatePresence>

          {cooldown > now ? (
            <div className="w-full py-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center justify-center gap-2">
              <FiRefreshCw className="animate-spin text-xs" />
              Wait {Math.ceil((cooldown - now) / 1000)}s
            </div>
          ) : !hasWatched && !isVerifying ? (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleAdClick}
              className="w-full py-3.5 rounded-xl bg-purple-600 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <FiPlay className="text-xs" /> Watch Ad to Spin
            </motion.button>
          ) : isVerifying ? (
            <div className="w-full py-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-black uppercase tracking-widest text-purple-400 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <FiRefreshCw className="animate-spin text-xs" />
                Verifying...
              </div>
              <span className="text-[8px] opacity-60">Wait {verifyTimer}s</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: spinning ? 1 : 1.05 }} whileTap={{ scale: spinning ? 1 : 0.95 }}
              onClick={spin}
              disabled={spinning}
              className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all ${
                spinning 
                ? "bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]/40"
                : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
              }`}
            >
              {spinning ? <FiRefreshCw className="animate-spin" /> : <><FiZap className="text-xs" /> Spin Reels</>}
            </motion.button>
          )}

          <div className="flex items-center justify-center gap-4 px-3 py-1.5 bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-lg">
             <div className="flex items-center gap-1.5">
               <FiZap className="text-rose-500 text-[10px]" />
               <span className="text-[8px] font-bold text-[var(--muted)]/40 uppercase tracking-wide">High Stakes</span>
             </div>
             <div className="flex items-center gap-1.5">
               <FiInfo className="text-[var(--muted)]/40 text-[10px]" />
               <span className="text-[8px] font-bold text-[var(--muted)]/40 uppercase tracking-wide">Fee: 1 BBC on Loss</span>
             </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="w-full border-t border-[var(--border)] pt-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3 bg-purple-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Gameplay Rules</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { t: "Step 1", d: "Watch 7s Video Ad" },
              { t: "Step 2", d: "Spin the 3 Reels" },
              { t: "Jackpot", d: "3 Diamonds = 5 BBC" },
              { t: "Loss", d: "-1 BBC on No Match" }
            ].map((rule, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-[var(--foreground)]/[0.02] border border-[var(--border)]/50">
                <p className="text-[7px] font-black uppercase text-purple-500/60 leading-none mb-1">{rule.t}</p>
                <p className="text-[9px] font-bold text-[var(--muted)] leading-tight">{rule.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {lastResult !== null && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-6"
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center space-y-4 shadow-2xl min-w-[200px]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 ${
                lastResult > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
              }`}>
                <FiStar className={`text-2xl animate-bounce ${lastResult > 0 ? "text-emerald-500" : "text-rose-500"}`} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase italic">
                  {lastResult > 0 ? "Big Win!" : "No Match!"}
                </h4>
                <p className="text-xs text-[var(--muted)] font-bold uppercase mt-1">
                  {lastResult > 0 ? `You got +${lastResult} BBC` : `You lost ${Math.abs(lastResult)} BBC`}
                </p>
              </div>
              <button 
                onClick={() => setLastResult(null)}
                className="w-full py-2 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
