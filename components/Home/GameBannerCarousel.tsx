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
  const [direction, setDirection] = useState<"next" | "prev">("next");
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
      setDirection("next");
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [banners.length, isPaused]);

  const goNext = () => {
    clearInterval(intervalRef.current);
    setDirection("next");
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const goPrev = () => {
    clearInterval(intervalRef.current);
    setDirection("prev");
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (loading) return <Loader />;
  if (!banners.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-7xl mx-auto px-4 mt-4"
    >
      <div
        className="relative h-[220px] sm:h-[280px] md:h-[420px] rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {banners.map((banner, index) => {
          const isActive = index === current;

          const base =
            "absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)]";

          let stateClass = "";

          if (isActive) {
            stateClass =
              "opacity-100 translate-x-0 scale-100 z-20";
          } else {
            if (direction === "next") {
              stateClass =
                index < current
                  ? "opacity-0 -translate-x-16 scale-95 z-10"
                  : "opacity-0 translate-x-16 scale-95 z-10";
            } else {
              stateClass =
                index > current
                  ? "opacity-0 translate-x-16 scale-95 z-10"
                  : "opacity-0 -translate-x-16 scale-95 z-10";
            }
          }

          return (
            <div key={index} className={`${base} ${stateClass}`}>
              <Link href="/" className="absolute inset-0 group">
                <Image
                  src={banner.bannerImage || logo}
                  alt={banner.bannerTitle}
                  fill
                  priority
                  className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                    className="text-white font-extrabold text-xl sm:text-3xl md:text-4xl"
                  >
                    {banner.bannerTitle}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 mt-2 text-sm md:text-base"
                  >
                    {banner.bannerDescription ||
                      "Instant top-ups • Secure payments • Trusted by gamers"}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <span className="inline-block px-6 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition">
                      Buy Now →
                    </span>
                  </motion.div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* NAV */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition"
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </motion.button>

        {/* PROGRESS INDICATORS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                clearInterval(intervalRef.current);
                setDirection(index > current ? "next" : "prev");
                setCurrent(index);
              }}
              className="group relative"
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${index === current
                  ? "w-8 bg-white"
                  : "w-1 bg-white/40 hover:bg-white/60"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
