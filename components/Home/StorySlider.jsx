"use client";

import Link from "next/link";
import Image from "next/image";

const storyData = [
  {
    id: 1,
    title: "MLBB India",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768500738/kapkap_20260115220013809_sys_zicwwk.jpg",
    link: "/games/mobile-legends988",
  },
  {
    id: 2,
    title: "BGMI",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
    link: "/games/pubg-mobile138",
  },
  {
    id: 3,
    title: "MLBB Double",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536006/WhatsApp_Image_2026-01-16_at_09.05.31_hqquhq.jpg",
    link: "/games/mlbb-double332",
  },
  {
    id: 4,
    title: "MLBB Small",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536112/WhatsApp_Image_2026-01-16_at_09.29.38_pli9ba.jpg",
    link: "/games/mlbb-smallphp638",
  },
  {
    id: 5,
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
        className="flex gap-4 overflow-x-auto px-2 py-3
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden"
      >
        {storyData.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="flex flex-col items-center min-w-[80px]"
          >
            {/* SIMPLE GRADIENT RING */}
            <div
              className="rounded-full p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, #ff5f6d, #d946ef, #3b82f6)",
              }}
            >
              <div className="rounded-full bg-black p-[2px]">
                <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* TITLE */}
            <span className="mt-2 text-xs text-[var(--foreground)] text-center">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
