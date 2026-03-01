"use client";

import { FiGrid, FiList, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PackageSelector({
  items,
  activeItem,
  setActiveItem,
  viewMode,
  setViewMode,
  sliderRef,
  buyPanelRef,
  calculateDiscount,
  scrollToItem,
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* ================= HEADER & VIEW TOGGLE ================= */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-[950] tracking-tighter text-[var(--foreground)] lowercase">
            select <span className="text-[var(--accent)] drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]">package</span>
          </h2>
          <span className="hidden sm:block w-4 h-[1px] bg-[var(--border)]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]/50">
            {items.length} options
          </p>
        </div>

        {/* Compact Glass Toggle */}
        <div className="bg-[var(--card)]/30 backdrop-blur-xl p-0.5 rounded-xl border border-[var(--border)] flex relative w-max ring-1 ring-white/5 shadow-xl">
          <motion.div
            className="absolute top-0.5 bottom-0.5 bg-[var(--accent)] rounded-[10px] z-0"
            initial={false}
            animate={{
              x: viewMode === "grid" ? 0 : "100%",
              width: "50%"
            }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />

          <button
            onClick={() => setViewMode("grid")}
            className={`relative z-10 px-4 py-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === "grid" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiGrid size={11} /> Grid
          </button>

          <button
            onClick={() => setViewMode("slider")}
            className={`relative z-10 px-4 py-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === "slider" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiList size={11} /> Slider
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-10">
              {items.map((item) => {
                const discount = calculateDiscount(item.sellingPrice, item.dummyPrice);
                const isActive = activeItem.itemSlug === item.itemSlug;

                return (
                  <motion.div
                    key={item.itemSlug}
                    onClick={() => {
                      setActiveItem(item);
                      buyPanelRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative group rounded-2xl p-4 cursor-pointer border transition-all duration-500 overflow-hidden
                    ${isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/[0.04] shadow-[0_10px_30px_-10px_rgba(var(--accent-rgb),0.3)] ring-1 ring-[var(--accent)]/30"
                        : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/30"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "200%" }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg]"
                        />
                      </div>
                    )}

                    {isActive && (
                      <div className="absolute top-2 right-2 text-[var(--accent)] opacity-80">
                        <FiCheckCircle size={12} />
                      </div>
                    )}

                    {discount > 0 && (
                      <span className="absolute top-0 left-0 bg-[var(--accent)] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-br-lg z-20">
                        {discount}% OFF
                      </span>
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`relative w-6 h-6 rounded-lg overflow-hidden shrink-0 transition-all duration-500 ${isActive ? "ring-1 ring-[var(--accent)]" : "bg-[var(--muted)]/10"}`}>
                          <Image
                            src={item?.itemImageId?.image || item?.image || "/logo.png"}
                            alt={item.itemName}
                            fill
                            unoptimized
                            className={`object-cover ${item.itemAvailablity === false ? "grayscale opacity-50" : ""}`}
                          />
                        </div>
                        <p className={`text-[10px] font-bold tracking-tight line-clamp-1 leading-none ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                          {item.itemName}
                        </p>
                      </div>

                      {item.itemAvailablity === false && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                          <span className="bg-rose-500/90 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      <div className={`flex items-baseline gap-1.5 border-t border-[var(--border)] pt-3 ${item.itemAvailablity === false ? "opacity-30" : ""}`}>
                        <span className={`text-xl font-[1000] tracking-tighter leading-none ${isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                          ₹{item.sellingPrice}
                        </span>
                        {item.dummyPrice && (
                          <span className="text-[10px] font-bold text-[var(--muted)] line-through opacity-20">
                            ₹{item.dummyPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="pb-10">
              <div
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-6 px-1 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {items.map((item) => {
                  const discount = calculateDiscount(item.sellingPrice, item.dummyPrice);
                  const isActive = activeItem.itemSlug === item.itemSlug;

                  return (
                    <motion.div
                      key={item.itemSlug}
                      onClick={() => scrollToItem(item)}
                      className={`relative snap-center min-w-[200px] rounded-3xl p-6 cursor-pointer transition-all duration-500 border flex flex-col justify-between overflow-hidden
                      ${isActive
                          ? "border-[var(--accent)] bg-[var(--accent)]/[0.04] scale-[1.03] shadow-[0_20px_40px_-15px_rgba(var(--accent-rgb),0.3)] ring-1 ring-[var(--accent)]/30"
                          : "border-[var(--border)] bg-[var(--card)]/40 opacity-70 hover:opacity-100 hover:border-[var(--accent)]/30"
                        }`}
                    >
                      <div className="mb-8">
                        <div className={`relative w-10 h-10 rounded-2xl overflow-hidden mb-4 transition-all duration-500 ${isActive ? "shadow-xl shadow-[var(--accent)]/30 ring-1 ring-[var(--accent)]" : "bg-[var(--card)] border border-[var(--border)]"}`}>
                          <Image
                            src={item?.itemImageId?.image || item?.image || "/logo.png"}
                            alt={item.itemName}
                            fill
                            unoptimized
                            className={`object-cover ${item.itemAvailablity === false ? "grayscale opacity-50" : ""}`}
                          />
                        </div>
                        <p className={`text-xs font-[900] tracking-tight transition-colors duration-300 ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                          {item.itemName}
                        </p>
                      </div>

                      {item.itemAvailablity === false && (
                        <div className="absolute top-4 right-4 z-30">
                          <span className="bg-rose-500 text-white text-[7px] font-[1000] px-2 py-0.5 rounded-full uppercase tracking-widest border border-rose-400">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      <div className={`pt-4 border-t border-[var(--border)] ${item.itemAvailablity === false ? "opacity-30" : ""}`}>
                        <div className="flex items-baseline gap-2">
                          <p className={`text-3xl font-[1000] tracking-tighter ${isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                            ₹{item.sellingPrice}
                          </p>
                          {item.dummyPrice && (
                            <p className="text-[11px] font-bold text-[var(--muted)] line-through opacity-20">
                              ₹{item.dummyPrice}
                            </p>
                          )}
                        </div>
                        {discount > 0 && item.itemAvailablity !== false && (
                          <p className="text-[8px] font-black text-[var(--accent)] uppercase tracking-[0.2em] mt-1">
                            save {discount}% now
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
