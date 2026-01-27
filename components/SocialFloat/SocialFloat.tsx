"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaHeart,
  FaShareNodes,
} from "react-icons/fa6";

/* ================= CONFIG ================= */

const ALLOWED_ROUTES = ["/", "/home"];

/* ================= DATA ================= */

const socialLinks = [
  {
    name: "Twitter",
    icon: FaXTwitter,
    url: "https://www.instagram.com/zynx.v1/",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/zynx.v1/",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    url: "https://www.instagram.com/zynx.v1/",
  },
];

/* ================= COMPONENT ================= */

export default function SocialFloat() {
  /* ---------- ROUTE GUARD ---------- */
  const pathname = usePathname();
  if (!ALLOWED_ROUTES.includes(pathname)) return null;

  /* ---------- STATE ---------- */
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  /* ---------- REFS ---------- */
  const containerRef = useRef<HTMLDivElement>(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  /* ================= SCROLL DIRECTION HANDLER ================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      // Hide on scroll down (only if menu closed)
      if (currentY > lastScrollY && currentY > 60 && !isOpen) {
        setIsVisible(false);
      }
      // Show on scroll up
      else {
        setIsVisible(true);
      }

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  /* ================= SHARE ================= */

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "topupmlbb.in",
          text: "Check out this awesome MLBB top-up site!",
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  /* ================= UI ================= */

  return (
    <div
      ref={containerRef}
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-300 ease-in-out
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }
      `}
    >
      {/* ================= FLOATING MENU ================= */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-12 h-12 rounded-full
                  bg-white/95 backdrop-blur-xl
                  shadow-lg border border-gray-200/50
                  flex items-center justify-center
                  text-gray-700
                  hover:text-white
                  hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500
                  transition-all hover:scale-110
                "
                aria-label={social.name}
              >
                <Icon className="text-lg" />
              </Link>
            );
          })}

          <div className="h-px bg-gray-200 mx-2" />

          <button
            onClick={handleShare}
            className="
              w-12 h-12 rounded-full
              bg-white/95 backdrop-blur-xl
              shadow-lg border border-gray-200/50
              flex items-center justify-center
              text-gray-700
              hover:text-white
              hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500
              transition-all hover:scale-110
            "
            aria-label="Share"
          >
            <FaShareNodes className="text-lg" />
          </button>

          <Link
            href="https://ko-fi.com/zynxv1"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-12 h-12 rounded-full
              bg-white/95 backdrop-blur-xl
              shadow-lg border border-gray-200/50
              flex items-center justify-center
              text-gray-700
              hover:text-white
              hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500
              transition-all hover:scale-110
            "
            aria-label="Support"
          >
            <FaHeart className="text-lg" />
          </Link>
        </div>
      )}

      {/* ================= TOGGLE BUTTON ================= */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-500 to-purple-500
          text-white shadow-xl
          flex items-center justify-center
          hover:shadow-2xl transition-all hover:scale-105
        "
        aria-label="Toggle social menu"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
