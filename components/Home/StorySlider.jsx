"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const storyData = [
  {
    id: 1,
    title: "Weekly/monthly bundle(india)",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1769872025/WhatsApp_Image_2026-01-31_at_20.33.31_nzn2ll.jpg",
    link: "/games/weeklymonthly-bundle931",
  },
  {
    id: 2,
    title: "MLBB India",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1769533093/WhatsApp_Image_2026-01-27_at_17.19.53_gfrfdn.jpg",
    link: "/games/mobile-legends988",
  },
  {
    id: 3,
    title: "MLBB Double",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1769515824/WhatsApp_Image_2026-01-27_at_17.39.55_w4gtnf.jpg",
    link: "/games/mlbb-double332",
  },
  {
    id: 4,
    title: "MLBB Small/PH",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1769515220/WhatsApp_Image_2026-01-27_at_17.25.55_torxmi.jpg",
    link: "/games/mlbb-smallphp980",
  },
  {
    id: 5,
    title: "PUBG Mobile",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
    link: "/games/pubg-mobile138",
  },
  {
    id: 6,
    title: "Membership",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
    link: "/games/membership/silver-membership",
  },
];

export default function StorySlider() {
  return (
    <section className="mt-1">
      <div
        className="
          flex gap-3 px-2 py-3
          overflow-x-auto
          scroll-smooth
          snap-x snap-mandatory
          overscroll-x-contain
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {storyData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={item.link}
              className="
                flex flex-col items-center
                min-w-[75px]
                snap-start
                transition-transform duration-200 ease-out
                hover:scale-105
                active:scale-95
              "
            >
              {/* GRADIENT RING */}
              <div
                className="
                  rounded-full p-[2px]
                  transition-all duration-300
                  hover:p-[3px]
                "
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover), var(--accent))",
                }}
              >
                <div className="rounded-full bg-[var(--background)] p-[2px]">
                  <div
                    className="
                      relative w-16 h-16
                      rounded-full overflow-hidden
                      shadow-lg
                    "
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      priority={item.id <= 3}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <span
                className="
                  mt-1.5 text-[10px] text-center
                  leading-tight
                  text-[var(--foreground)]
                  line-clamp-2
                  max-w-[75px]
                "
              >
                {item.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
