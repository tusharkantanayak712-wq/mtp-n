"use client";

import { FiGrid, FiList } from "react-icons/fi";
import { motion } from "framer-motion";

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
    <>
      {/* ================= HEADER & VIEW TOGGLE ================= */}
      <div className="max-w-6xl mx-auto mb-4 flex flex-col md:flex-row md:items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg md:text-xl font-[900] uppercase tracking-tight text-[var(--foreground)]">
            Select <span className="text-[var(--accent)]">Package</span>
          </h2>
          <p className="text-xs font-medium text-[var(--muted)] mt-0.5">
            {items.length} options available
          </p>
        </div>

        {/* Custom Toggle Switch */}
        <div className="bg-[var(--card)]/50 backdrop-blur-md p-0.5 rounded-lg border border-[var(--border)] flex relative w-max scale-90 origin-right">
          <motion.div
            className="absolute top-0.5 bottom-0.5 bg-[var(--accent)] rounded-[0.4rem] z-0 shadow-sm"
            initial={false}
            animate={{
              x: viewMode === "grid" ? 0 : "100%",
              width: "50%"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />

          <button
            onClick={() => setViewMode("grid")}
            className={`relative z-10 px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${viewMode === "grid" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiGrid size={12} /> Grid
          </button>

          <button
            onClick={() => setViewMode("slider")}
            className={`relative z-10 px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${viewMode === "slider" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiList size={12} /> Slider
          </button>
        </div>
      </div>

      {/* ================= GRID VIEW ================= */}
      {viewMode === "grid" && (
        <div className="max-w-6xl mx-auto mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const discount = calculateDiscount(
              item.sellingPrice,
              item.dummyPrice
            );
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
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group rounded-xl p-3 cursor-pointer overflow-hidden border transition-all duration-300
                ${isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_20px_-5px_rgba(var(--accent-rgb),0.3)]"
                    : "border-[var(--border)] bg-[var(--card)]/60 hover:border-[var(--accent)]/40 hover:bg-[var(--card)]"
                  }`}
              >
                {/* Active Indicator Pulse */}
                {isActive && (
                  <div className="absolute inset-0 border border-[var(--accent)] rounded-xl animate-pulse opacity-50 pointer-events-none" />
                )}

                {/* DISCOUNT BADGE - Compact */}
                {discount > 0 && (
                  <span className="absolute top-0 left-0 bg-rose-500/90 backdrop-blur-sm text-white
                                   text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-br-lg z-10 shadow-sm">
                    -{discount}%
                  </span>
                )}

                <div className="relative z-10 pt-1 flex flex-col h-full justify-between">
                  <p className={`text-xs font-bold mb-1 line-clamp-2 leading-tight ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}`}>
                    {item.itemName}
                  </p>

                  <div className="flex items-end gap-1.5 mt-2">
                    <p className={`text-lg font-[900] tracking-tight leading-none ${isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                      ₹{item.sellingPrice}
                    </p>
                    {item.dummyPrice && (
                      <p className="text-[10px] font-semibold text-[var(--muted)] line-through decoration-rose-500/50 opacity-60 mb-[1px]">
                        ₹{item.dummyPrice}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ================= SLIDER VIEW ================= */}
      {viewMode === "slider" && (
        <div className="max-w-6xl mx-auto mb-4 mt-2">
          <div
            ref={sliderRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--border)]"
          >
            {items.map((item) => {
              const discount = calculateDiscount(
                item.sellingPrice,
                item.dummyPrice
              );
              const isActive = activeItem.itemSlug === item.itemSlug;

              return (
                <div
                  key={item.itemSlug}
                  onClick={() => scrollToItem(item)}
                  className={`relative snap-center min-w-[160px] rounded-xl p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between
                  ${isActive
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg scale-[1.02] z-10"
                      : "border-[var(--border)] bg-[var(--card)]/80 opacity-90 hover:opacity-100 hover:border-[var(--foreground)]/20"
                    }`}
                >
                  {/* DISCOUNT BADGE */}
                  {discount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm rotate-3">
                      -{discount}%
                    </span>
                  )}

                  <p className="text-xs font-bold mb-2 truncate opacity-90">
                    {item.itemName}
                  </p>

                  <div>
                    <p className="text-xl font-[900] text-[var(--accent)] tracking-tighter">
                      ₹{item.sellingPrice}
                    </p>
                    {item.dummyPrice && (
                      <p className="text-[10px] font-bold text-[var(--muted)] line-through opacity-50">
                        ₹{item.dummyPrice}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
