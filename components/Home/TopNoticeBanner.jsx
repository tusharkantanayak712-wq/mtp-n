"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight, FiZap, FiActivity } from "react-icons/fi";

const STORAGE_KEY = "hide_whatsapp_banner";
const ROTATE_INTERVAL = 4500;

/* ================= WHATSAPP BANNERS ================= */
const BANNERS = [
  {
    id: "discount",
    title: "PREMIUM WHATSAPP DEALS",
    subtitle: "Unlock 1–5% exclusive discount",
    badge: "VIP SAVE",
    icon: <FiZap />,
    color: "#eab308",
    link: "https://wa.me/919178521537?text=Hi%20I%20want%205%25%20OFF",
  },
  {
    id: "bgmi",
    title: "BGMI TACTICAL DROP 🔥",
    subtitle: "60 UC @ ₹70 — Instantly",
    badge: "HOT DEAL",
    icon: <FiActivity />,
    color: "#f97316",
    link: "https://wa.me/919178521537?text=BGMI%2060%20UC%20Offer%20@%2070rs",
  },
  {
    id: "support",
    title: "DIRECT COMMAND CENTER",
    subtitle: "Instant support & help",
    badge: "24/7 LIVE",
    icon: <FiZap />,
    color: "#3b82f6",
    link: "https://wa.me/919178521537?text=Hi%20I%20need%20help",
  },
];

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  /* ================= INITIAL VISIBILITY ================= */
  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  /* ================= AUTO ROTATION ================= */
  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const banner = BANNERS[index];

  return (
    <div className="relative z-30 overflow-hidden h-auto opacity-100">
      <div
        onClick={() => window.open(banner.link, "_blank")}
        className="
          group relative w-full cursor-pointer
          bg-[var(--background)] border-b border-[var(--border)]
          transition-all duration-300 overflow-hidden
        "
      >
        {/* ENHANCED OVERALL GRADIENT - FIXED FOR WHITE THEME */}
        <div
          className="absolute inset-0 opacity-15 transition-all duration-1000"
          style={{
            background: `linear-gradient(90deg, ${banner.color}44 0%, transparent 50%, ${banner.color}44 100%)`
          }}
        />

        {/* TOP GLOW LINE */}
        <div
          className="absolute top-0 left-0 w-full h-[1px] opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, ${banner.color}, transparent)`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 relative z-10">

          <div className="flex items-center gap-3 min-w-0">
            {/* WHATSAPP ICON ORB */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div
                className="absolute inset-0 blur-lg rounded-full opacity-20"
                style={{ backgroundColor: banner.color }}
              />

              <div className="
                relative z-10 w-9 h-9 rounded-full 
                bg-[#25D366] flex items-center justify-center text-white
                shadow-[0_4px_12px_rgba(37,211,102,0.4)]
                group-hover:scale-110 transition-transform duration-500
              ">
                <FaWhatsapp size={20} className="drop-shadow-sm" />
              </div>
            </div>

            <div className="min-w-0">
              <div key={banner.id}>
                <div className="flex items-center gap-1.5">
                  {/* TITLE - NOW USING THEME COLOR (Visible in all themes) */}
                  <p className="font-black text-[9px] sm:text-xs uppercase italic tracking-tight truncate text-[var(--foreground)]">
                    {banner.title}
                  </p>
                  <FiArrowRight
                    className="size-2.5 shrink-0 group-hover:translate-x-1"
                    style={{ color: banner.color }}
                  />
                </div>
                <p className="text-[8px] sm:text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider truncate">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* GRADIENT BADGE */}
            <span
              key={banner.id + "-badge"}
              className="
                flex items-center gap-1
                text-[8px] sm:text-[9px] font-black uppercase tracking-widest
                px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border
                shadow-[0_2px_10px_rgba(0,0,0,0.05)]
                transition-all duration-500
              "
              style={{
                background: `linear-gradient(135deg, ${banner.color}15, ${banner.color}05)`,
                color: banner.color,
                borderColor: `${banner.color}35`
              }}
            >
              <span>{banner.icon}</span>
              <span className="hidden xs:inline-block">{banner.badge}</span>
              <span className="xs:hidden">{banner.badge.split(' ')[0]}</span>
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                localStorage.setItem(STORAGE_KEY, "true");
                setVisible(false);
              }}
              className="
                relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg
                flex items-center justify-center
                text-[var(--muted)] hover:text-red-500
                hover:bg-red-500/10 transition-all duration-300
              "
              aria-label="Close"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
