"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaHeart,
} from "react-icons/fa6";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Meow Ji";
const TRUSTPILOT_URL =
  "https://www.trustpilot.com/evaluate/mlbbtopup.in";

/* ===================== CONFIG ===================== */

const FOOTER_LINKS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Games", href: "/games" },
      { label: "Services", href: "/services" },
      { label: "Region Check", href: "/region" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Contact Us", href: "/contact" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mlbbtopup.in", icon: FaInstagram },
  { label: "Twitter", href: "https://x.com/tk_dev_", icon: FaXTwitter },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

/* ===================== COMPONENT ===================== */

export default function Footer() {
  return (
    <footer className="mt-8 bg-[var(--card)] text-[var(--muted)] border-t border-[var(--border)]">

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Brand + QR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1 flex justify-between items-start gap-3"
          >
            {/* Brand */}
            <div>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
                {BRAND}
              </h2>

              <p className="text-xs leading-relaxed max-w-[200px] opacity-75 mt-2">
                Instant game top-ups & automated delivery — 24×7 ⚡
              </p>
            </div>

            {/* Trustpilot QR */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Give us a review on Trustpilot"
              className="flex flex-col items-center gap-1 hover:opacity-90 transition"
            >
              <div className="bg-white p-1 rounded-lg border border-[var(--border)] shadow-sm">
                <QRCodeCanvas
                  value={TRUSTPILOT_URL}
                  size={48}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>

              <span className="text-[10px] opacity-70 text-center">
                Give us a<br />review here
              </span>
            </motion.a>
          </motion.div>

          {/* Navigation */}
          {FOOTER_LINKS.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (sectionIndex + 1) * 0.1 }}
              className="flex flex-col gap-2"
            >
              <h3 className="text-[var(--accent)] font-semibold text-sm mb-1">
                {section.title}
              </h3>

              {section.links.map((link, linkIndex) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (sectionIndex + 1) * 0.1 + linkIndex * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-xs opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ))}

          {/* Socials (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex flex-col gap-2"
          >
            <h3 className="text-[var(--accent)] font-semibold text-sm mb-1">
              Connect
            </h3>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center hover:bg-[var(--accent)]/20 transition"
                >
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </motion.a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-[var(--border)] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Socials (Mobile) */}
            <div className="flex md:hidden gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </motion.a>
              ))}
            </div>

            {/* Made With */}
            <p className="text-[10px] text-center flex items-center gap-1">
              Made with{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                <FaHeart className="w-3 h-3 text-[var(--accent)]" />
              </motion.span>{" "}
              by{" "}
              <span className="text-[var(--accent)] font-medium">
                {BRAND}
              </span>
            </p>

            {/* Copyright */}
            <p className="text-[10px] opacity-60">
              © {new Date().getFullYear()} {BRAND}
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
