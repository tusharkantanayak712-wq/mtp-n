"use client";

import Image from "next/image";
import { FiArrowRight, FiShield, FiLock, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyPanel({
  activeItem,
  redirecting,
  goBuy,
  calculateDiscount,
  buyPanelRef,
}) {
  if (!activeItem) return null;

  const itemImage =
    activeItem?.itemImageId?.image ||
    activeItem?.image ||
    "/logo.png";

  const discount = calculateDiscount(
    activeItem.sellingPrice,
    activeItem.dummyPrice
  );

  return (
    <motion.div
      ref={buyPanelRef}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 right-4 z-40 md:static md:max-w-4xl md:mx-auto md:p-0 md:mt-4"
    >
      <div className="relative group">
        {/* Advanced Background Glow */}
        <div className="absolute inset-x-10 -bottom-1 h-8 bg-[var(--accent)]/40 blur-[40px] opacity-40 group-hover:opacity-70 transition-all duration-1000 -z-10" />

        {/* Main Premium Container */}
        <div className="relative bg-[var(--card)]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-1.5 pr-2 shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex items-center justify-between gap-2 overflow-hidden ring-1 ring-white/10">

          {/* Internal Shimmer Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent w-full skew-x-[-20deg]"
            />
          </div>

          {/* LEFT: Product Info */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 relative z-10 ms-1">
            {/* Image with sophisticated ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[var(--accent)] opacity-20 blur-lg rounded-full" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-[var(--background)] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={itemImage}
                  alt={activeItem.itemName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              {discount > 0 && (
                <div className="absolute -top-1 -left-1 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20 z-20">
                  {discount}%
                </div>
              )}
            </div>

            {/* Texts and Price */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h2 className="text-[9px] md:text-[10px] font-black text-[var(--foreground)] tracking-tight leading-none truncate opacity-60 uppercase">
                  selected <span className="hidden xs:inline text-[var(--accent)]">package</span>
                </h2>
                <span className="hidden sm:flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  <FiCheck size={8} /> delivered
                </span>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 min-w-0">
                <h3 className="text-[11px] md:text-sm font-[900] text-[var(--foreground)] tracking-tight truncate max-w-[80px] xs:max-w-none">
                  {activeItem.itemName}
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl md:text-2xl font-[1000] text-[var(--accent)] leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]">
                    ₹{activeItem.sellingPrice}
                  </span>
                  {activeItem.dummyPrice && (
                    <span className="hidden xs:inline text-[9px] font-bold text-[var(--muted)] line-through decoration-rose-500 opacity-30">
                      ₹{activeItem.dummyPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Action */}
          <div className="flex flex-col items-end shrink-0">
            <button
              onClick={() => goBuy(activeItem)}
              disabled={redirecting}
              className={`
                  relative group/btn h-10 md:h-11 px-4 md:px-7 rounded-lg md:rounded-xl overflow-hidden flex items-center gap-2 transition-all duration-500 active:scale-95
                  ${redirecting
                  ? 'bg-white/10 text-[var(--muted)] cursor-not-allowed shadow-none'
                  : 'bg-[var(--foreground)] text-[var(--background)] hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]'
                }
              `}
            >
              <AnimatePresence mode="wait">
                {redirecting ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 border-3 border-[var(--background)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest">Processing</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm md:text-base font-[1000] uppercase tracking-tighter">Buy Now</span>
                    <div className="bg-[var(--background)] text-[var(--foreground)] w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover/btn:translate-x-1 duration-500">
                      <FiArrowRight size={14} fill="currentColor" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ultra-Premium Persistent Shimmer on Button */}
              {!redirecting && (
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]"
                  />
                  {/* Hover Accent Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[var(--accent)] mix-blend-overlay" />
                </div>
              )}
            </button>
            <div className="flex items-center gap-1 opacity-40 px-1 mt-0.5">
              <FiShield size={8} className="text-[var(--accent)]" />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]">Secure</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
