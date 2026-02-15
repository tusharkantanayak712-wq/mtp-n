"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Gamepad2,
  Layers,
  BookOpen,
  Trophy,
  Crown,
  Flower2,
  Inbox,
  LifeBuoy,
  Heart,
  Wallet,
  Users
} from "lucide-react";

/* ===================== CONFIG ===================== */

const topRow = [
  { title: "Scanner", href: "/region", icon: Globe, color: "#3b82f6" },
  { title: "Games", href: "/games", icon: Gamepad2, color: "#22c55e" },
  { title: "Services", href: "/services", icon: Layers, color: "#a855f7" },
  { title: "Blogs", href: "/blog", icon: BookOpen, color: "#eab308" },
  { title: "Leader", href: "/leaderboard", icon: Trophy, color: "#f97316" },
  { title: "Wallet", href: "/dashboard/wallet", icon: Wallet, color: "#10b981" },
];

const bottomRow = [
  { title: "Orders", href: "/dashboard/orders", icon: Inbox, color: "#64748b" },
  { title: "Support", href: "/dashboard/support", icon: LifeBuoy, color: "#06b6d4" },
  { title: "Silver", href: "/games/membership/silver-membership", icon: Crown, color: "#94a3b8" },
  { title: "Reseller", href: "/games/membership/reseller-membership", icon: Crown, color: "#fbbf24" },
  { title: "Referral", href: "/dashboard/referral", icon: Users, color: "#ec4899" },
  // {
  //   title: "Valentine",
  //   icon: Heart,
  //   href: "/special-leaderboard",
  //   isColorful: true,
  //   color: "#ff2e63",
  //   accent: "from-rose-500 to-pink-500"
  // },
];

/* ===================== COMPONENT ===================== */

export default function HomeQuickActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);
  }, []);

  const getTargetHref = (item: any) => {
    const isAuthProtected = item.title === "Orders" || item.title === "Support";
    if (isAuthProtected && !isLoggedIn) {
      return `/login?redirect=${item.href}`;
    }
    return item.href;
  };

  const ActionCard = ({ item, index, delayBase }: any) => {
    const Icon = item.icon;
    const isColorful = item.isColorful;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: delayBase + index * 0.04,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="flex-1"
      >
        <Link
          href={getTargetHref(item)}
          className="group relative flex flex-col items-center justify-center py-2 px-1"
        >
          {/* Enhanced Icon Section */}
          <div className="relative flex items-center justify-center p-2 rounded-2xl transition-all duration-500">

            {/* VALENTINE SPECIAL HIGHLIGHT */}
            {isColorful && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.2, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 border border-dashed border-rose-500/30 rounded-2xl"
                />
              </>
            )}

            {/* Ultra-Subtle Hover Ring */}
            <div
              className={`absolute inset-0 rounded-2xl border transition-all duration-500 scale-125 group-hover:scale-100 ${isColorful ? "border-rose-500/20 bg-rose-500/5" : "border-white/0 group-hover:border-white/5 group-hover:bg-white/[0.02]"
                }`}
            />

            {/* Ambient Backlight */}
            <div
              className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
              style={{ backgroundColor: item.color }}
            />

            {/* The Icon */}
            <div className={`
              relative z-10 transition-all duration-500
              group-hover:-translate-y-1
              ${isColorful ? "text-rose-500" : ""}
            `}>
              <Icon
                size={isColorful ? 24 : 22}
                strokeWidth={isColorful ? 2 : 1.25}
                style={{ color: isColorful ? undefined : item.color }}
                className={`
                  transition-transform duration-500
                  ${isColorful ? "drop-shadow-[0_0_12px_rgba(255,46,99,0.5)] group-hover:scale-125" : "group-hover:scale-115"}
                `}
              />
            </div>
          </div>

          {/* Title */}
          <span
            className={`
              mt-2 text-[9px] font-black tracking-[0.1em] uppercase transition-all duration-300
              ${isColorful ? "text-rose-500 scale-105" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}
            `}
          >
            {item.title}
          </span>

          {/* Status Bar */}
          <div className={`mt-1.5 h-[1.5px] transition-all duration-500 rounded-full ${isColorful ? "w-4 bg-rose-500 opacity-60" : "w-0 group-hover:w-3 opacity-40"
            }`}
            style={{ backgroundColor: isColorful ? undefined : item.color }}
          />
        </Link>
      </motion.div>
    );
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-4">
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex flex-col gap-1">
          {/* ================= TOP ROW ================= */}
          <div className="flex justify-between gap-1">
            {topRow.map((item, index) => (
              <ActionCard key={item.title} item={item} index={index} delayBase={0} />
            ))}
          </div>

          {/* ================= BOTTOM ROW ================= */}
          <div className="flex justify-between gap-1">
            {bottomRow.map((item, index) => (
              <ActionCard key={item.title} item={item} index={index} delayBase={0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
