"use client";

import Image from "next/image";
import { FiArrowRight, FiShield } from "react-icons/fi";

export default function BuyPanel({
  activeItem,
  gameAvailablity,
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

  const isUnavailable = gameAvailablity === false || activeItem.itemAvailablity === false;

  return (
    <div
      ref={buyPanelRef}
      className="relative w-full max-w-4xl mx-auto px-4 mt-8 mb-6 md:static md:p-0"
    >
      <div className="relative group p-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 overflow-hidden">
        {/* Static Background Border Subtle Effect */}
        <div className="absolute inset-[-100%] bg-white/5 group-hover:opacity-10 pointer-events-none" />

        {/* Main Premium Card */}
        <div className="relative bg-[var(--card)]/80 backdrop-blur-3xl rounded-[15px] p-3 md:p-4 overflow-hidden border border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">

            {/* LEFT: Product Display */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative shrink-0">
                <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-white/10 to-transparent p-[1px] rounded-xl shadow-xl">
                  <div className="w-full h-full bg-[var(--background)] rounded-[11px] overflow-hidden relative border border-[var(--border)]">
                    <Image
                      src={itemImage}
                      alt={activeItem.itemName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
                {discount > 0 && (
                  <div className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white/10 z-20">
                    -{discount}%
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0 text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[var(--accent)] opacity-80">Selected</span>
                </div>
                <h3 className="text-sm md:text-base font-black text-[var(--foreground)] tracking-tight leading-none uppercase italic truncate max-w-[150px] md:max-w-none">
                  {activeItem.itemName}
                </h3>
              </div>
            </div>

            {/* RIGHT: Price & Action */}
            <div className="flex flex-row items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-[var(--border)] pt-3 md:pt-0">
              <div className="flex flex-col items-start md:items-end">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] md:text-[24px] font-[1000] text-[var(--foreground)] tracking-tighter">
                    ₹{activeItem.sellingPrice}
                  </span>
                  {activeItem.dummyPrice && (
                    <span className="text-[11px] font-bold text-[var(--muted)] line-through">
                      ₹{activeItem.dummyPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-40">
                  <FiShield size={8} className="text-[var(--accent)]" />
                  <span className="text-[7px] font-black uppercase tracking-wider text-[var(--foreground)]">Secure</span>
                </div>
              </div>

              <button
                onClick={() => goBuy(activeItem)}
                disabled={redirecting || isUnavailable}
                className={`
                  relative group/btn h-11 md:h-12 px-6 rounded-xl overflow-hidden flex items-center justify-center gap-2
                  ${redirecting || isUnavailable
                    ? 'bg-[var(--muted)]/20 text-[var(--muted)] cursor-not-allowed border border-white/5'
                    : 'bg-[var(--foreground)] text-[var(--background)] font-[1000] uppercase tracking-tighter text-xs'
                  }
                `}
              >
                {redirecting ? (
                  <div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" />
                ) : isUnavailable ? (
                  <span>{gameAvailablity === false ? "Not Available" : "Out of Stock"}</span>
                ) : (
                  <>
                    <span>Order Now</span>
                    <FiArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
