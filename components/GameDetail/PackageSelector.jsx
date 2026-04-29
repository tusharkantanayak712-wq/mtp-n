"use client";

import { FiGrid, FiList, FiCheckCircle } from "react-icons/fi";
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
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-[1000] tracking-tighter text-[var(--foreground)] uppercase italic">
            Pick <span className="text-[var(--accent)] drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]">Your Pack</span>
          </h2>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]/40 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[var(--accent)]/30" />
            {items.length} items available
          </p>
        </div>

        {/* Compact Icon-Only Toggle */}
        <div className="relative bg-[var(--card)]/40 backdrop-blur-2xl p-1 rounded-xl border border-white/10 flex items-center shadow-xl overflow-hidden">
          {/* Animated Background Slider */}
          <div 
            className="absolute h-[calc(100%-8px)] rounded-lg bg-gradient-to-r from-[var(--accent)] to-emerald-500 shadow-[0_4px_12px_rgba(var(--accent-rgb),0.3)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: "32px",
              left: viewMode === "grid" ? "4px" : "calc(50% + 2px)",
            }}
          />

          <button
            onClick={() => setViewMode("grid")}
            title="Grid View"
            className={`relative z-10 w-8 h-8 flex items-center justify-center transition-colors duration-300 ${viewMode === "grid" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiGrid size={15} />
          </button>

          <button
            onClick={() => setViewMode("slider")}
            title="Slider View"
            className={`relative z-10 w-8 h-8 flex items-center justify-center transition-colors duration-300 ${viewMode === "slider" ? "text-white" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <FiList size={15} />
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        key={viewMode}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-10">
            {items.map((item) => {
              const discount = calculateDiscount(item.sellingPrice, item.dummyPrice);
              const isActive = activeItem.itemSlug === item.itemSlug;

              return (
                <div
                  key={item.itemSlug}
                  onClick={() => {
                    setActiveItem(item);
                    buyPanelRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`relative group rounded-2xl p-4 cursor-pointer border overflow-hidden
                  ${isActive
                      ? "border-[var(--accent)] bg-[var(--accent)]/[0.04] shadow-[0_10px_30px_-10px_rgba(var(--accent-rgb),0.3)] ring-1 ring-[var(--accent)]/30"
                      : "border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/30"
                    }`}
                >
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
                      <div className={`relative w-6 h-6 rounded-lg overflow-hidden shrink-0 ${isActive ? "ring-1 ring-[var(--accent)]" : "bg-[var(--muted)]/10"}`}>
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
                </div>
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
                  <div
                    key={item.itemSlug}
                    onClick={() => scrollToItem(item)}
                    className={`relative snap-center min-w-[140px] rounded-xl p-3 cursor-pointer border flex flex-col justify-between overflow-hidden
                    ${isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]/[0.04] shadow-[0_12px_24px_-8px_rgba(var(--accent-rgb),0.3)] ring-1 ring-[var(--accent)]/30"
                        : "border-[var(--border)] bg-[var(--card)]/40 opacity-70 hover:opacity-100 hover:border-[var(--accent)]/30"
                      }`}
                  >
                    <div className="mb-2">
                      <div className={`relative w-7 h-7 rounded-lg overflow-hidden mb-2 ${isActive ? "shadow-md shadow-[var(--accent)]/30 ring-1 ring-[var(--accent)]" : "bg-[var(--card)] border border-[var(--border)]"}`}>
                        <Image
                          src={item?.itemImageId?.image || item?.image || "/logo.png"}
                          alt={item.itemName}
                          fill
                          unoptimized
                          className={`object-cover ${item.itemAvailablity === false ? "grayscale opacity-50" : ""}`}
                        />
                      </div>
                      <p className={`text-[9px] font-[900] tracking-tight ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
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

                    <div className={`pt-2 border-t border-[var(--border)] ${item.itemAvailablity === false ? "opacity-30" : ""}`}>
                      <div className="flex items-baseline gap-1.5">
                        <p className={`text-xl font-[1000] tracking-tighter ${isActive ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
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
                           {discount}% off
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
