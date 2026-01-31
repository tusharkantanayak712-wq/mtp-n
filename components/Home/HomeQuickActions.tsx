"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Gamepad2,
  Layers,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  BadgePercent,
} from "lucide-react";

/* ===================== CONFIG ===================== */

const topRow = [
  { title: "Region", href: "/region", icon: Globe },
  { title: "Games", href: "/games", icon: Gamepad2 },
  { title: "Services", href: "/services", icon: Layers },
  { title: "Blogs", href: "/blog", icon: BookOpen },
  { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

const bottomRow = [
  {
    title: "Image Grid",
    icon: ImageIcon,
    comingSoon: true,
  },
  {
    title: "Membership",
    icon: Trophy,
    href: "/games/membership/silver-membership",
  },
  {
    title: "Reseller",
    icon: Layers,
    href: "/games/membership/reseller-membership",
  },
  {
    title: "IDs on Sell",
    icon: BadgePercent,
    comingSoon: true,
  },
];

/* ===================== COMPONENT ===================== */

export default function HomeQuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-7xl mx-auto px-4 mt-6 space-y-4"
    >
      {/* ================= TOP ROW ================= */}
      <div className="grid grid-cols-5 gap-3">
        {topRow.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className="
                  group flex flex-col items-center justify-center gap-2 py-2
                  rounded-xl
                  transition-all duration-200
                  hover:bg-[var(--muted)]/10
                  active:scale-95
                "
              >
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center transition-all group-hover:bg-[var(--accent)]/20 group-hover:scale-110">
                  <Icon
                    size={20}
                    className="text-[var(--accent)] transition-transform"
                  />
                </div>

                <span className="text-[11px] font-medium text-[var(--foreground)] text-center">
                  {item.title}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="grid grid-cols-4 gap-3">
        {bottomRow.map((item, index) => {
          const Icon = item.icon;

          const Content = (
            <div
              className={`
                flex flex-col items-center justify-center gap-2 py-2 text-center
                rounded-xl
                transition-all duration-200
                ${item.comingSoon
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[var(--muted)]/10 active:scale-95"
                }
              `}
            >
              <div className={`w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center transition-all ${!item.comingSoon && "group-hover:bg-[var(--accent)]/20 group-hover:scale-110"}`}>
                <Icon size={20} className="text-[var(--accent)]" />
              </div>

              <span className="text-[11px] font-medium text-[var(--foreground)]">
                {item.title}
              </span>

              {item.comingSoon && (
                <span className="text-[9px] text-[var(--muted)]">
                  Coming soon
                </span>
              )}
            </div>
          );

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + index * 0.05 }}
            >
              {item.href ? (
                <Link href={item.href} className="group">
                  {Content}
                </Link>
              ) : (
                <div>{Content}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
