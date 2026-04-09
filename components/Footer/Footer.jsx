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
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Store", href: "/games" },
      { label: "Services", href: "/services" },
      { label: "Region", href: "/region" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "About Us", href: "/about" },
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
    <footer className="relative mt-8 bg-[var(--background)] border-t border-[var(--border)] pt-12 pb-6 overflow-hidden">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] w-[30%] h-[100px] bg-[var(--accent)]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">

          {/* BRAND BLOCK - REFINED SPACE */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="group block">
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-r from-[var(--accent)] via-[var(--foreground)] to-[var(--accent)] bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                {BRAND}
              </h2>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic leading-relaxed max-w-[260px]">
                Fast & safe top-ups. Trusted by 10,000+ players.
              </p>
            </Link>

            {/* Trustpillot Card - Compact High-End */}
            <motion.a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all border-dashed group"
            >
              <div className="bg-white p-1 rounded-lg shadow-sm group-hover:rotate-2 transition-transform">
                <QRCodeCanvas
                  value={TRUSTPILOT_URL}
                  size={42}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-0.5 text-[var(--accent)] mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiShield key={i} size={9} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[7px] font-black uppercase tracking-widest text-[var(--muted)]">
                  VERIFIED BY TRUSTPILOT <FiExternalLink className="inline mb-0.5 opacity-30" size={8} />
                </p>
              </div>
            </motion.a>
          </div>

          {/* LINKS GRID - SYMMETRICAL */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-[var(--accent)]/40 rounded-full" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]/80 italic">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[10px] sm:text-[11px] font-bold uppercase italic tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-all leading-none block hover:translate-x-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CONNECT & ACTION BLOCK */}
          <div className="md:col-span-3 flex flex-col md:items-end gap-8">
            <div className="space-y-4 md:text-right">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]/80 italic">
                Connect
              </h3>
              <div className="flex items-center justify-start md:justify-end gap-2.5">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[var(--card)]/40 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all shadow-sm"
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-auto group flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition-all italic"
            >
              Back to Top
              <div className="w-8 h-8 rounded-xl bg-[var(--card)]/40 border border-[var(--border)] flex items-center justify-center shadow-md group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                <FiChevronUp size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* BOTTOM STRIP - HIGH-END DENSITY */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-5 opacity-60">
          <div className="flex items-center gap-3 group/india cursor-default">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-[#FF9933] rounded-full shadow-[0_0_8px_#FF9933]" />
              <div className="w-1 h-3 bg-white rounded-full shadow-[0_0_8px_white]" />
              <div className="w-1 h-3 bg-[#138808] rounded-full shadow-[0_0_8px_#138808]" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] italic text-[var(--foreground)]">
              MADE IN <span className="text-[#FF9933]">IND</span><span className="text-white">I</span><span className="text-[#138808]">A</span> 🇮🇳
            </span>
          </div>

          <div className="flex items-center gap-8 text-[8px] font-black uppercase tracking-[0.1em] italic">
            <span className="tracking-[0.3em]">24/7 AUTOMATED</span>
          </div>
        </div>

        {/* COPYRIGHT SUB-STRIP */}
        <div className="mt-6 text-center opacity-20">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">
            © {new Date().getFullYear()} {BRAND.toUpperCase()} • ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  );
}
