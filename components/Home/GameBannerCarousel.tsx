"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/game-banners")
      .then((r) => r.json())
      .then((d) => setBanners(d?.data ?? []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  /* AUTO PLAY */
  useEffect(() => {
    if (!banners.length || isPaused) return;

    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [banners.length, isPaused, page]);

  const paginate = (newDirection: number) => {
    const nextPage = (current + newDirection + banners.length) % banners.length;
    setPage([nextPage, newDirection]);
    setCurrent(nextPage);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "20%" : "-20%",
      opacity: 0,
      scale: 1.05,
      filter: "blur(8px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "20%" : "-20%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
    }),
  };

  if (loading) return <Loader />;
  if (!banners.length) return null;

  const currentBanner = banners[current];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-7xl mx-auto px-4 mt-6"
    >
      <div
        className="relative h-[200px] sm:h-[240px] md:h-[300px] lg:h-[340px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.6 },
              filter: { duration: 0.4 }
            }}
            className="absolute inset-0"
          >
            <Link href="/" className="relative block w-full h-full">
              <Image
                src={currentBanner.bannerImage || logo}
                alt={currentBanner.bannerTitle}
                fill
                priority
                className="object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
              />

              {/* Tactical Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[size:100%_4px] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]" />

              {/* Content Overlay - Adjusted for Low Height */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-xl sm:max-w-2xl"
                >
                  {/* Tactical Badge - Smaller */}
                  <div className="mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_var(--accent)]" />
                    <span className="text-[var(--accent)] text-[8px] font-black uppercase tracking-[0.2em] font-mono">Mission Active</span>
                  </div>

                  <h2 className="text-white font-black text-2xl sm:text-3xl md:text-5xl tracking-tighter leading-[0.9] uppercase mb-2 sm:mb-3 italic">
                    {currentBanner.bannerTitle}
                  </h2>

                  <p className="text-white/50 text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase leading-relaxed max-w-md line-clamp-2">
                    {currentBanner.bannerDescription || "Elite Gaming Access • Instant Provisioning • Zero Lag Connection Status: Optimal"}
                  </p>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Controls - Scaled Down */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={() => paginate(-1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
          >
            <ChevronLeft size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
          >
            <ChevronRight size={20} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Minimalist Indicators - Adjusted Position */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-30 flex items-end gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
              <span className="text-white font-black text-2xl sm:text-3xl tracking-tighter tabular-nums leading-none">
                0{current + 1}
              </span>
              <span className="text-white/20 font-bold text-[10px]">/0{banners.length}</span>
            </div>
            <div className="h-[2px] w-12 sm:w-16 bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                key={current}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-[var(--accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
