"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSkeleton } from "../Skeleton/Skeleton";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
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
  }, [banners.length, isPaused, current]);

  const paginate = (newDirection: number) => {
    const nextPage = (current + newDirection + banners.length) % banners.length;
    setCurrent(nextPage);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <BannerSkeleton />
    </div>
  );
  if (!banners.length) return null;

  const currentBanner = banners[current];

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-6 opacity-100 translate-y-0">
      <div
        className="relative h-[200px] sm:h-[240px] md:h-[300px] lg:h-[340px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0">
          <Link href="/" className="relative block w-full h-full overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={currentBanner.bannerImage || logo}
                alt={currentBanner.bannerTitle}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Tactical Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[size:100%_4px] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="max-w-xl sm:max-w-2xl">
                {/* Tactical Badge */}
                <div className="mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                  <span className="text-[var(--accent)] text-[8px] font-black uppercase tracking-[0.2em] font-mono">LIVE</span>
                </div>

                <h2 className="text-white font-black text-2xl sm:text-3xl md:text-5xl tracking-tighter leading-[0.9] uppercase mb-2 sm:mb-3 italic">
                  {currentBanner.bannerTitle}
                </h2>
              </div>
            </div>
          </Link>
        </div>

        {/* Cinematic Controls */}
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

        {/* Minimalist Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-30 flex items-end gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
              <span className="text-white font-black text-2xl sm:text-3xl tracking-tighter tabular-nums leading-none">
                0{current + 1}
              </span>
              <span className="text-white/20 font-bold text-[10px]">/0{banners.length}</span>
            </div>
            <div className="h-[2px] w-12 sm:w-16 bg-white/10 relative overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-[var(--accent)]" style={{ width: `${((current + 1) / banners.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
