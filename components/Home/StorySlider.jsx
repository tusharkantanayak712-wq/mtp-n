"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const storyData = [
  {
    id: 7,
    title: "Starlight",
    badge: "Hot",
    color: "#06b6d4", // Cyan
    image: "/game-assets/starkight.webp",
    link: "/games/starlight-card-manual",
  },
  {
    id: 0,
    title: "Weekly Pass",
    badge: "Best",
    color: "#22c55e", // Green
    image: "/game-assets/weeklypass.jpg",
    link: "/games/mobile-legends988?type=weekly-pass",
  },
  {
    id: 1,
    title: "Weekly Bundle",
    badge: "Hot",
    color: "#ff4d4d", // Red
    image: "/game-assets/weekly-monthly-bundle.jpg",
    link: "/games/weeklymonthly-bundle931",
  },
  {
    id: 2,
    title: "MLBB India",
    badge: "Live",
    color: "#22c55e", // Green
    image: "/game-assets/mlbbindia.jpg",
    link: "/games/mobile-legends988",
  },
  {
    id: 3,
    title: "MLBB Double",
    badge: "New",
    color: "#3b82f6", // Blue
    image: "/game-assets/double-dias.jpg",
    link: "/games/mlbb-double332",
  },
  {
    id: 4,
    title: "MLBB Small",
    color: "#a855f7", // Purple
    image: "/game-assets/mlbb-ph-small.jpg",
    link: "/games/mlbb-smallphp980",
  },
  {
    id: 5,
    title: "BGMI",
    badge: "Sale",
    color: "#f59e0b", // Orange
    image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
    link: "/games/bgmi-manual",
  },
  {
    id: 6,
    title: "Membership",
    badge: "VIP",
    color: "#ec4899", // Pink
    image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
    link: "/games/membership/silver-membership",
  },
];

export default function StorySlider() {
  return (
    <section className="relative py-4 px-4">
      <div className="flex md:justify-center gap-3 md:gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory relative z-10">
        {storyData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              href={item.link}
              className="group relative flex flex-col items-center min-w-[72px] md:min-w-[82px] snap-center"
            >
              <div className="relative">
                {/* Clean Colored Ring (No Shadow, No Glow) */}
                <div
                  className="relative p-[2px] rounded-full transition-transform duration-500 group-hover:scale-105 z-10"
                  style={{
                    background: item.color || 'var(--accent)'
                  }}
                >
                  <div className="p-0.5 rounded-full bg-[var(--background)]">
                    <div className="relative w-[58px] h-[58px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 58px, 70px"
                        priority={item.id <= 4}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Badge (Flat Premium - No Shadow) */}
                {item.badge && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] md:text-[8.5px] font-bold text-white uppercase tracking-wider z-20 border border-[var(--background)]"
                    style={{ backgroundColor: item.color || "var(--accent)" }}
                  >
                    <span className="flex items-center gap-1.5">
                      {item.badge === "Live" && (
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      )}
                      {item.badge}
                    </span>
                  </span>
                )}
              </div>

              {/* Title - Flat & Clean */}
              <span className="mt-4 text-[9px] md:text-[10px] font-medium text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-300 tracking-wide text-center uppercase">
                {item.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
