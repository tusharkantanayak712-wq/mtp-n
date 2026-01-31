"use client";

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
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Brand + QR (Right aligned) */}
          <div className="col-span-2 md:col-span-1 flex justify-between items-start gap-3">
            {/* Brand */}
            <div>
              <h2 className="text-lg font-extrabold bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
                {BRAND}
              </h2>

              <p className="text-[10px] leading-snug max-w-[180px] opacity-75 mt-0.5">
                Instant game top-ups & automated delivery — 24×7 ⚡
              </p>
            </div>

            {/* Trustpilot QR */}
            <a
              href={TRUSTPILOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Give us a review on Trustpilot"
              className="flex flex-col items-center gap-0.5 hover:opacity-90 transition"
            >
              <div className="bg-white p-[2px] rounded border border-[var(--border)]">
                <QRCodeCanvas
                  value={TRUSTPILOT_URL}
                  size={40}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>

              <span className="text-[9px] opacity-70 text-center">
                Give us a<br />review here
              </span>
            </a>
          </div>

          {/* Navigation */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h3 className="text-[var(--accent)] font-semibold text-[11px] mb-0.5">
                {section.title}
              </h3>

              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[10px] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          {/* Socials (Desktop) */}
          <div className="hidden md:flex flex-col gap-1">
            <h3 className="text-[var(--accent)] font-semibold text-[11px] mb-0.5">
              Connect
            </h3>

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:text-[var(--accent)] transition"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-[var(--border)] py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1">

            {/* Socials (Mobile) */}
            <div className="flex md:hidden gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>

            {/* Made With */}
            <p className="text-[9px] text-center">
              Made with{" "}
              <FaHeart className="inline w-2.5 h-2.5 text-[var(--accent)] mx-0.5" />{" "}
              by{" "}
              <span className="text-[var(--accent)] font-medium">
                {BRAND}
              </span>
            </p>

            {/* Copyright */}
            <p className="text-[9px] opacity-60">
              © {new Date().getFullYear()} {BRAND}
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
