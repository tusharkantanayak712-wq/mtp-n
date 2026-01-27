"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<any>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/game-banners")
      .then((r) => r.json())
      .then((d) => setBanners(d?.data ?? []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (!banners.length) return;

    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % banners.length);
    }, 7000);

    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  const resetAutoplay = () => clearInterval(intervalRef.current);

  const goNext = () => {
    resetAutoplay();
    setCurrent((p) => (p + 1) % banners.length);
  };

  const goPrev = () => {
    resetAutoplay();
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  };

  if (loading) return <Loader />;
  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-4">

      {/* ================= SLIDE ================= */}
      <div className="
        relative h-[220px] sm:h-[280px] md:h-[420px]
        rounded-[28px] overflow-hidden
        bg-black border border-white/10
      ">
        <Link href="/" className="absolute inset-0 group">

          {/* Image */}
          <Image
            src={banner.bannerImage || logo}
            alt={banner.bannerTitle}
            fill
            priority
            className="
              object-cover
              transition-transform duration-[1800ms] ease-out
              group-hover:scale-[1.06]
            "
          />

          {/* Overlay */}
          <div className="
            absolute inset-0
            bg-gradient-to-t
            from-black/85 via-black/35 to-black/10
          " />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12">

            <h2 className="
              max-w-2xl
              text-xl sm:text-2xl md:text-4xl
              font-extrabold tracking-tight text-white
            ">
              {banner.bannerTitle}
            </h2>

            <p className="
              mt-2 max-w-xl
              text-xs sm:text-sm md:text-base
              text-gray-300
            ">
              {banner.bannerDescription || "Instant top-ups • Secure payments • Trusted by gamers"}
            </p>

            {/* CTA */}
            <div className="mt-5 flex items-center gap-4">
              <span className="
                inline-flex items-center gap-2
                px-5 py-2 rounded-full
                bg-white text-black
                text-xs sm:text-sm font-semibold
                hover:bg-gray-100 transition
              ">
                Buy Now
                <span className="opacity-60">→</span>
              </span>

              <span className="text-xs text-gray-400">
                Instant delivery
              </span>
            </div>
          </div>
        </Link>

        {/* ================= NAV ================= */}
        <button
          onClick={goPrev}
          className="
            absolute left-3 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 rounded-full
            bg-black/50 backdrop-blur
            border border-white/10
            flex items-center justify-center
            hover:bg-black/70 transition
          "
        >
          <ChevronLeft className="text-white w-4 h-4" />
        </button>

        <button
          onClick={goNext}
          className="
            absolute right-3 top-1/2 -translate-y-1/2 z-10
            w-9 h-9 rounded-full
            bg-black/50 backdrop-blur
            border border-white/10
            flex items-center justify-center
            hover:bg-black/70 transition
          "
        >
          <ChevronRight className="text-white w-4 h-4" />
        </button>
      </div>

      {/* ================= THUMB STRIP ================= */}
      <div className="mt-5 flex justify-center gap-2">
        {banners.map((b, i) => (
          <button
            key={i}
            onClick={() => {
              resetAutoplay();
              setCurrent(i);
            }}
            className={`
              h-1.5 w-8 rounded-full transition-all
              ${current === i
                ? "bg-white"
                : "bg-white/30 hover:bg-white/50"}
            `}
          />
        ))}
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="mt-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-700"
          style={{ width: `${((current + 1) / banners.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
