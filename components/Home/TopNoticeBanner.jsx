"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";

const STORAGE_KEY = "hide_whatsapp_banner";
const ROTATE_INTERVAL = 3200;

/* ================= WHATSAPP BANNERS ================= */
const BANNERS = [
  {
    id: "discount",
    title: "Get 1–5% OFF on WhatsApp",
    subtitle: "DM us directly to unlock discount",
    badge: "DM & Save",
    link: "https://wa.me/916372305866?text=Hi%20I%20want%205%25%20OFF",
  },
  {
    id: "bgmi",
    title: "BGMI UC Offer 🔥",
    subtitle: "60 UC @ ₹70 — limited time",
    badge: "Hot Deal",
    link: "https://wa.me/916372305866?text=BGMI%2060%20UC%20Offer%20@%2070rs",
  },
  {
    id: "support",
    title: "Chat with us on WhatsApp",
    subtitle: "Instant support & latest offers",
    badge: "Support",
    link: "https://wa.me/916372305866?text=Hi%20I%20need%20help",
  },
];

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  /* ================= INITIAL VISIBILITY ================= */
  useEffect(() => {
    const hidden = sessionStorage.getItem(STORAGE_KEY);
    if (!hidden) setVisible(true);
  }, []);

  /* ================= AUTO ROTATION ================= */
  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % BANNERS.length);
        setAnimate(true);
      }, 180);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const banner = BANNERS[index];

  return (
    <div
      onClick={() => window.open(banner.link, "_blank")}
      className="
        relative w-full cursor-pointer
        border-b border-[var(--border)]
        bg-gradient-to-r
        from-[var(--accent)]/90
        via-[var(--accent-secondary)]/90
        to-[var(--accent)]/90
        backdrop-blur-xl
        hover:brightness-105
        transition
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">

          <div className="
            shrink-0 rounded-full p-2
            bg-green-500 text-white
            shadow-sm
          ">
            <FaWhatsapp size={16} />
          </div>

          <div
            className={`
              min-w-0 leading-tight
              transition-all duration-300
              ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
            `}
          >
            <p className="font-semibold text-xs sm:text-sm truncate flex items-center gap-1">
              {banner.title}
              <FiArrowRight className="opacity-70" />
            </p>
            <p className="text-[10px] sm:text-xs text-[var(--muted)] truncate">
              {banner.subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="
            hidden sm:inline
            text-[10px] font-medium
            bg-white/20 px-2.5 py-1 rounded-full
          ">
            {banner.badge}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sessionStorage.setItem(STORAGE_KEY, "true");
              setVisible(false);
            }}
            className="
              rounded-full p-1.5
              hover:bg-black/20
              transition
            "
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
