"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";

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
    url: "https://www.instagram.com/mlbbtopup.in/",
    color: "bg-gray-800",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/mlbbtopup.in/",
    color: "bg-gradient-to-br from-pink-500 to-purple-600",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    url: "https://www.instagram.com/mlbbtopup.in/",
    color: "bg-red-600",
  },
];

/* ================= COMPONENT ================= */

export default function SocialFloat() {
  /* ---------- ROUTE GUARD ---------- */
  const pathname = usePathname();
  if (!ALLOWED_ROUTES.includes(pathname)) return null;

  /* ---------- STATE ---------- */
  const { isSocialMenuOpen: isOpen, setSocialMenuOpen, toggleSocialMenu } = useUIStore();

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
        setSocialMenuOpen(false);
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
      } catch { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  /* ================= UI ================= */

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-[5rem] md:bottom-6 right-6 z-50"






      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* ================= FLOATING MENU ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 md:bottom-16 right-0 flex flex-col gap-2 mb-2"

          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                    aria-label={social.name}
                  >
                    <div
                      className={`w-11 h-11 rounded-full ${social.color} shadow-lg flex items-center justify-center text-white transition-all hover:scale-110`}
                    >
                      <Icon className="text-base" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-[var(--border)] mx-1 my-1" />

            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.12 }}
            >
              <button
                onClick={handleShare}
                className="group block"
                aria-label="Share"
              >
                <div className="w-11 h-11 rounded-full bg-blue-600 shadow-lg flex items-center justify-center text-white transition-all hover:scale-110">
                  <FaShareNodes className="text-base" />
                </div>
              </button>
            </motion.div>

            {/* Support Button */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.15 }}
            >
              <Link
                href="https://ko-fi.com/zynxv1"
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label="Support"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg flex items-center justify-center text-white transition-all hover:scale-110">
                  <FaHeart className="text-base" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOGGLE BUTTON ================= */}
      <motion.button
        onClick={() => toggleSocialMenu()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative hidden md:flex"
        aria-label="Toggle social menu"
      >

        <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white shadow-xl flex items-center justify-center">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <svg
                className="w-5 h-5"
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
                className="w-5 h-5"
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
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}
