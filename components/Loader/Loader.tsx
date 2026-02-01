import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlueBuffLoaderProps {
  progress?: number;
  duration?: number;
  onComplete?: () => void;
  showText?: boolean;
  text?: string;
}

export default function BlueBuffLoader({
  progress = 0,
  duration = 700,
  onComplete,
  showText = true,
  text = "Loading",
}: BlueBuffLoaderProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress > 0) {
      setInternalProgress(progress);
      if (progress >= 100) {
        setIsComplete(true);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 800);
      }
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      setInternalProgress(eased * 100);

      if (t >= 1) {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 800);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [progress, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "var(--background)",
        }}
      >
        {/* Animated background gradient waves */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, var(--accent)/0.15 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, var(--accent)/0.1 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, var(--accent)/0.15 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, var(--accent)/0.15 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(${200 + i * 15}, 80%, 60%)`,
              left: `${10 + i * 7}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main loader container */}
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: "radial-gradient(circle, var(--accent)/0.4, var(--accent)/0.1)",
              width: "280px",
              height: "280px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Rotating gradient ring */}
          <motion.div
            className="absolute rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: "200px",
              height: "200px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "conic-gradient(from 0deg, transparent, var(--accent), transparent)",
              opacity: 0.6,
            }}
          />

          {/* Inner rotating ring (opposite direction) */}
          <motion.div
            className="absolute rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: "160px",
              height: "160px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "conic-gradient(from 180deg, transparent, #06b6d4, #3b82f6, transparent)",
              opacity: 0.5,
            }}
          />

          {/* Liquid morphing orb */}
          <motion.div
            className="relative rounded-full backdrop-blur-xl"
            animate={{
              borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
              ],
              scale: isComplete ? [1, 1.2, 0] : [0.95, 1.05, 0.95],
            }}
            transition={{
              borderRadius: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: isComplete
                ? { duration: 0.6, times: [0, 0.5, 1] }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              width: "140px",
              height: "140px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 0 60px var(--accent)/0.2, inset 0 0 40px var(--accent)/0.05",
            }}
          >
            {/* Progress indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {!isComplete ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="text-4xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-[var(--accent)] to-[var(--foreground)] bg-clip-text text-transparent"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {Math.round(internalProgress)}
                    </motion.span>
                    <span className="text-xl font-bold italic text-[var(--accent)] ml-1">%</span>
                  </motion.div>
                ) : (
                  <motion.svg
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-emerald-400"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M20 6L9 17l-5-5"
                    />
                  </motion.svg>
                )}
              </motion.div>
            </div>

            {/* Inner glow pulse */}
            <motion.div
              className="absolute inset-4 rounded-full blur-xl"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)",
              }}
            />
          </motion.div>
        </div>

        {/* Loading text */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <motion.p
              className="text-lg font-[900] italic uppercase tracking-[0.2em] text-[var(--foreground)]"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {text}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              )}
            </motion.p>

            {/* Status text */}
            <motion.p
              className="text-sm text-blue-300/60 mt-3 font-light"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {internalProgress < 30 && "Initializing"}
              {internalProgress >= 30 && internalProgress < 60 && "Processing"}
              {internalProgress >= 60 && internalProgress < 90 && "Almost there"}
              {internalProgress >= 90 && !isComplete && "Finalizing"}
              {isComplete && "Complete"}
            </motion.p>
          </motion.div>
        )}

        {/* Completion burst effect */}
        {isComplete && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-blue-400"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * 150,
                  y: Math.sin((i * Math.PI * 2) / 8) * 150,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
