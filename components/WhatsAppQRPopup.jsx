"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { FiX, FiUsers, FiZap, FiCheck } from "react-icons/fi";

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
          className="fixed inset-0 z-[100] flex items-center justify-center
                     bg-black/80 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[280px]"
          >
            {/* Clean Minimalist Frame */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] p-6">
              
              {/* Subtle Gradient Accent */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--accent)]/50 via-[var(--accent)] to-[var(--accent)]/50" />

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--foreground)]/5 text-[var(--muted)] transition-colors z-20"
              >
                <FiX size={18} />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Header Icon & Title Group */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <FiUsers size={20} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-black tracking-tight text-[var(--foreground)] leading-none mb-1">
                      Our Community
                    </h2>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--muted)] opacity-70">
                      Updates & Giveaways
                    </p>
                  </div>
                </div>

                {/* QR Section */}
                <div className="relative mb-6 p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <QRCodeCanvas
                    value="https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129"
                    size={110}
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                  />
                </div>

                {/* Main Action Button */}
                <a
                  href="https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 rounded-2xl bg-[var(--accent)] !text-black font-[1000] text-sm uppercase italic tracking-widest hover:brightness-95 transition-all shadow-xl shadow-[var(--accent)]/20 flex items-center justify-center gap-3"
                >
                  Join Now <FiZap size={18} className="fill-current" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
