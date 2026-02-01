"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ValentinePopup() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    message: "",
  });

  useEffect(() => {
    const seen = sessionStorage.getItem("valentine_popup_seen");
    if (!seen) {
      const timerId = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timerId);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    let targetDate = new Date(now.getFullYear(), 1, 14); // Feb 14

    if (now > targetDate) {
      targetDate = new Date(now.getFullYear() + 1, 1, 14);
    }

    const timer = setInterval(() => {
      const current = new Date().getTime();
      const distance = targetDate.getTime() - current;

      if (distance <= 0) {
        setTimeLeft((prev) => ({ ...prev, message: "It's Valentine's Day! 💖" }));
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        message: "",
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("valentine_popup_seen", "true");
  };

  const handleRedirect = () => {
    setShow(false);
    sessionStorage.setItem("valentine_popup_seen", "true");
    router.push("/special-leaderboard");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Compact Popup Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[340px] bg-[#0f0f11] border border-rose-500/30 rounded-[32px] p-6 text-center shadow-[0_0_50px_rgba(244,63,94,0.15)] overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-rose-500/20 to-transparent rounded-full blur-[50px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-10 flex flex-col items-center">
              {/* Floating Heart */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
              >
                💝
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-[900] italic uppercase tracking-tighter text-white leading-none mb-1">
                Valentine <span className="text-rose-500">Special</span>
              </h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-5">
                Exclusive Event Live Now
              </p>

              {/* Compact Countdown */}
              {!timeLeft.message && (
                <div className="flex gap-2 mb-6 w-full justify-center">
                  {Object.entries(timeLeft).filter(([key]) => key !== 'message').map(([unit, value]) => (
                    <div key={unit} className="flex-1 bg-white/5 rounded-xl py-2 border border-white/5 backdrop-blur-md">
                      <div className="text-lg font-[900] text-rose-500 leading-none tabular-nums">
                        {value}
                      </div>
                      <div className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                        {unit.slice(0, 1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message if Time Expired */}
              {timeLeft.message && (
                <div className="mb-6 text-rose-500 font-bold italic text-sm animate-pulse">
                  {timeLeft.message}
                </div>
              )}

              {/* Action Button */}
              <div className="w-full space-y-3">
                <motion.button
                  onClick={handleRedirect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-[800] uppercase tracking-wider text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all flex items-center justify-center gap-2"
                >
                  Join Event <span className="text-lg leading-none">→</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
