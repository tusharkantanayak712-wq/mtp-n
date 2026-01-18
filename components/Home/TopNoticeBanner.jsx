"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiArrowRight } from "react-icons/fi";

const STORAGE_KEY = "hide_whatsapp_banner";
const ROTATE_INTERVAL = 3000;

/* ================= WHATSAPP BANNERS ================= */
const BANNERS = [
  {
    id: "discount",
    title: "Get 1-5% OFF on WhatsApp",
    subtitle: "DM us directly to unlock instant discount",
    badge: "DM & Save",
    link: "https://wa.me/916372305866?text=Hi%20I%20want%205%25%20OFF",
  },
  {
    id: "bgmi",
    title: "BGMI UC Offer 🔥",
    subtitle: "60 UC @ ₹70 — DM on WhatsApp",
    badge: "Limited Deal",
    link: "https://wa.me/916372305866?text=BGMI%2060%20UC%20Offer%20@%2070rs",
  },
  {
    id: "support",
    title: "Chat with us on WhatsApp",
    subtitle: "Instant support & latest offers",
    badge: "Chat Now",
    link: "https://wa.me/916372305866?text=Hi%20I%20need%20help",
  },
];

export default function TopNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  /* ================= INITIAL VISIBILITY ================= */
  useEffect(() => {
    const hidden = sessionStorage.getItem(STORAGE_KEY);
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
    <div
      onClick={() => window.open(banner.link, "_blank")}
      className="
        w-full cursor-pointer
        bg-gradient-to-r
        from-[var(--accent)]
        via-[var(--accent-secondary)]
        to-[var(--accent)]
        text-[var(--foreground)]
        border-b border-[var(--border)]
        shadow-md
        hover:brightness-105
        transition
      "
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-green-500 text-white shadow">
            <FaWhatsapp size={18} />
          </div>

          <div className="leading-tight">
            <p className="font-semibold text-sm md:text-base flex items-center gap-1">
              {banner.title}
              <FiArrowRight className="opacity-70" />
            </p>
            <p className="text-xs md:text-sm text-[var(--muted)]">
              {banner.subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
            {banner.badge}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sessionStorage.setItem(STORAGE_KEY, "true");
              setVisible(false);
            }}
            className="rounded-full p-1 hover:bg-black/20 transition"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
