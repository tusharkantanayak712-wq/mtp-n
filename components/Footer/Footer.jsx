"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiHeart,
  FiChevronUp,
  FiShield,
  FiExternalLink
} from "react-icons/fi";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Blue Buff";
const TRUSTPILOT_URL = "https://www.trustpilot.com/evaluate/mlbbtopup.in";

const FOOTER_LINKS = [
  {
    title: "Market",
    links: [
      { label: "Home", href: "/" },
      { label: "Store", href: "/games" },
      { label: "Services", href: "/services" },
      { label: "Scanner", href: "/region" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Identity", href: "/about" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Support", href: "/contact" },
      { label: "Refunds", href: "/refund-policy" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mlbbtopup.in", icon: FiInstagram },
  { label: "Twitter", href: "https://x.com/tk_dev_", icon: FiTwitter },
  { label: "YouTube", href: "https://youtube.com", icon: FiYoutube },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-12 bg-[var(--background)] border-t border-[var(--border)] pt-16 pb-8 overflow-hidden">

      {/* Subtle Background Lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[120px] bg-[var(--accent)]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

          {/* BRAND BLOCK - COMPACT */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-3">
              <Link href="/" className="inline-block group">
                <h2 className="text-3xl md:text-4xl font-[1000] italic tracking-tighter uppercase leading-none bg-gradient-to-r from-[var(--accent)] via-[var(--foreground)] to-[var(--accent)] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                  {BRAND}
                </h2>
                <div className="h-0.5 w-0 group-hover:w-full bg-[var(--accent)] transition-all duration-500 rounded-full mt-1" />
              </Link>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic leading-relaxed max-w-[280px]">
                THE GOLD STANDARD IN AUTOMATED GAME TOP-UPS & ELITE SOLUTIONS.
              </p>
            </div>

            {/* Review Card - Slimmer */}
            <motion.a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all border-dashed"
            >
              <div className="bg-white p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
                <QRCodeCanvas
                  value={TRUSTPILOT_URL}
                  size={44}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 text-[var(--accent)] mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiShield key={i} size={8} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] opacity-50">
                  VERIFIED BY TRUSTPILOT
                </p>
              </div>
              <FiExternalLink className="text-[var(--muted)] opacity-10 transition-all" size={12} />
            </motion.a>
          </div>

          {/* LINKS GRID - DENSER */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]/60 italic">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[10px] font-[900] uppercase italic tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors leading-none block hover:translate-x-1 transform duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CONNECT BLOCK */}
          <div className="md:col-span-3 space-y-6 flex flex-col items-center md:items-end">
            <div className="space-y-4 flex flex-col items-center md:items-end">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]/60 italic">
                Connect
              </h3>
              <div className="flex items-center gap-3">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all"
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition-colors group italic"
            >
              Elevate
              <div className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
                <FiChevronUp size={14} />
              </div>
            </button>
          </div>

        </div>

        {/* BOTTOM STRIP - TIGHTER */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
          <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] italic group/india">
            <span>© {new Date().getFullYear()} {BRAND.toUpperCase()}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--muted)] opacity-30" />
            <span className="flex items-center gap-1.5 group-hover/india:text-[var(--accent)] transition-colors">
              MADE IN INDIA <span className="text-[11px] not-italic">🇮🇳</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.1em] italic">
            Crafted for Legends <FiHeart className="text-[var(--accent)]" size={10} />
          </div>

          <div className="text-[8px] font-black uppercase tracking-[0.2em] italic">
            24/7 AUTOMATED DELIVERY
          </div>
        </div>
      </div>
    </footer>
  );
}
