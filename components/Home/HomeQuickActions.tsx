"use client";

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

const topRow = [
  { title: "Region", href: "/region", icon: Globe },
  { title: " Games", href: "/games", icon: Gamepad2 },
  { title: "Services", href: "/services", icon: Layers },
  { title: "Blogs", href: "/blogs", icon: BookOpen },
  { title: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

const bottomRow = [
  { title: "Image Grid", icon: ImageIcon, comingSoon: true },
  { title: "IDs on Sell", icon: BadgePercent, comingSoon: true },
];

export default function HomeQuickActions() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-4 space-y-5">
      {/* TOP ROW – 5 ITEMS */}
      <div className="grid grid-cols-5 gap-4">
        {topRow.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center justify-center gap-2
                transition-transform active:scale-95"
            >
              {/* ICON */}
              <Icon
                size={22}
                className="text-indigo-400"
              />

              {/* TEXT */}
              <span className="text-[12px] font-medium text-gray text-center">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* BOTTOM ROW – 2 ITEMS */}
      <div className="flex justify-between px-6">
        {bottomRow.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2 opacity-40"
            >
              <Icon
                size={22}
                className="text-indigo-400"
              />

              <span className="text-[12px] font-medium text-gray text-center">
                {item.title}
              </span>

              <span className="text-[10px] text-gray">
                Coming soon
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
