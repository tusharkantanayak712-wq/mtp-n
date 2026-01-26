"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

export default function WhatsAppCommunityPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("wa_qr_theme_popup");
    if (!shown) {
      const t = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("wa_qr_theme_popup", "1");
      }, 700);

      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 0.9,
            }}
            className="
              relative w-full max-w-xs rounded-[24px]
              border border-[var(--border)]
              bg-gradient-to-br
              from-[var(--card)]
              via-[var(--background)]
              to-[var(--card)]
              p-5 shadow-2xl
            "
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-base
                         text-[var(--muted)]
                         hover:text-[var(--foreground)]
                         transition"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center gap-3">
              <h2 className="text-lg font-extrabold leading-snug">
                Join Our Buyer&apos;s
                <br />
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]
                                 bg-clip-text text-transparent">
                  WhatsApp Community
                </span>
              </h2>

              <p className="text-xs text-[var(--muted)]">
                Exclusive offers & early access deals 
              </p>

              {/* QR */}
              <div
                className="
                  rounded-xl p-3
                  bg-gradient-to-br
                  from-white
                  to-gray-100
                  border border-[var(--accent)]/40
                  shadow-md
                "
              >
                <QRCodeCanvas
                  value="https://wa.me/916372305866?text=Hi%20I%20want%20to%20join%20the%20buyers%20community"
                  size={150}
                  level="H"
                />
              </div>

              <p className="text-[11px] text-[var(--muted)]">
                Scan to join instantly
              </p>

              {/* CTA */}
              <a
                href="https://wa.me/916372305866"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-1 w-full rounded-full py-2.5
                  font-bold text-xs
                  bg-gradient-to-r
                  from-[var(--accent)]
                  to-[var(--accent-secondary)]
                  text-black
                  hover:brightness-110
                  active:scale-[0.98]
                  transition
                "
              >
                Join Now
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
  