"use client";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function BuyPanelBgmi({
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 right-4 z-40 md:static md:max-w-3xl md:mx-auto md:p-0 md:mt-4"
    >
      <div className="relative group">
        {/* Glow */}
        <div className="absolute inset-4 bg-[var(--accent)]/30 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 -z-10" />

        {/* Main Bar */}
        <div className="relative bg-[var(--card)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-[1.5rem] p-2 pr-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between gap-3 overflow-hidden ring-1 ring-white/5">

          {/* LEFT: Product Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Image */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 bg-[var(--background)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
              <Image
                src={itemImage}
                alt={activeItem.itemName}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Texts */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-[900] text-[var(--foreground)] tracking-tight leading-none truncate">
                  {activeItem.itemName}
                </h2>
                {discount > 0 && (
                  <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-black px-1.5 rounded-md hidden sm:inline-block">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg md:text-xl font-[900] text-[var(--accent)] leading-none">
                  ₹{activeItem.sellingPrice}
                </span>
                {activeItem.dummyPrice && (
                  <span className="text-[10px] font-bold text-[var(--muted)] line-through decoration-rose-500/50 opacity-60">
                    ₹{activeItem.dummyPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Action */}
          <button
            onClick={() => goBuy(activeItem)}
            disabled={redirecting}
            className={`
                relative h-12 md:h-12 px-6 rounded-2xl overflow-hidden flex items-center gap-2 shrink-0 transition-all active:scale-95
                ${redirecting
                ? 'bg-[var(--muted)]/20 text-[var(--muted)] cursor-not-allowed'
                : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white shadow-lg shadow-[var(--accent)]/10'
              }
            `}
          >
            {redirecting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <>
                <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                  Buy Now
                </span>
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </div>
      </div>
    </motion.div>
  );
}
