"use client";

import Link from "next/link";
import Image from "next/image";

const storyData = [
  {
    id: 1,
    title: "Value pass(India)",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768671923/WhatsApp_Image_2026-01-17_at_22.58.12_nfcotg.jpg",
    link: "/games/value-pass-ml948",
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
    link: "/games/mlbb-smallphp638",
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
          flex gap-4 px-2 py-3
          overflow-x-auto
          scroll-smooth
          snap-x snap-mandatory
          overscroll-x-contain
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {storyData.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="
              flex flex-col items-center
              min-w-[80px]
              snap-start
              transition-transform duration-200 ease-out
              hover:scale-[1.06]
              active:scale-[0.96]
            "
          >
            {/* GRADIENT RING */}
            <div
              className="
                rounded-full p-[2px]
                transition-all duration-300
              "
              style={{
                background:
                  "linear-gradient(135deg, #ff5f6d, #d946ef, #3b82f6)",
              }}
            >
              <div className="rounded-full bg-black p-[2px]">
                <div
                  className="
                    relative w-[70px] h-[70px]
                    rounded-full overflow-hidden
                    shadow-[0_6px_18px_rgba(0,0,0,0.45)]
                  "
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="70px"
                    priority={item.id <= 3}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* TITLE */}
            <span
              className="
                mt-2 text-xs text-center
                leading-tight
                text-[var(--foreground)]
                line-clamp-2
              "
            >
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
