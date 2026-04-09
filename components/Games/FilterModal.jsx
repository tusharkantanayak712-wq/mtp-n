"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiFilter, FiChevronRight } from "react-icons/fi";

export default function FilterModal({
  open,
  onClose,
  sort,
  setSort,
  hideOOS,
  setHideOOS,
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full sm:max-w-md bg-[var(--card)]/80 backdrop-blur-2xl border border-white/5 sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-black shadow-[0_0_20px_var(--accent)]/30">
                    <FiFilter size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-[var(--foreground)]">
                      Filter & Sort
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                      Pick how to sort
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[var(--muted)] hover:text-white transition-all shadow-xl"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Sort Section */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
                    Sort By
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "az", label: "Name: A to Z" },
                    { id: "za", label: "Name: Z to A" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSort(option.id)}
                      className={`relative group flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all duration-300
                        ${sort === option.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]"
                          : "border-white/5 bg-white/5 text-[var(--muted)] hover:border-white/10 hover:bg-white/10"
                        }`}
                    >
                      <span className="text-xs font-black uppercase tracking-widest italic group-active:scale-95 transition-transform">
                        {option.label}
                      </span>
                      {sort === option.id && (
                        <motion.div layoutId="sortCheck">
                          <FiCheck size={14} className="text-[var(--accent)]" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
                    Filter Items
                  </p>
                </div>

                <div
                  onClick={() => setHideOOS(!hideOOS)}
                  className={`flex items-center justify-between p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-500
                    ${hideOOS
                      ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
                      : "border-white/5 bg-white/5 hover:border-white/10"
                    }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${hideOOS ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                       Hide sold out items
                    </span>
                    <span className="text-[9px] font-medium text-[var(--muted)]">
                      Only show items in stock
                    </span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-500 p-1 flex items-center ${hideOOS ? "bg-[var(--accent)]" : "bg-white/10"}`}>
                    <motion.div
                      animate={{ x: hideOOS ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-4 bg-white/5 border-t border-white/5">
              <button
                onClick={onClose}
                className="group w-full py-5 rounded-[2rem] bg-[var(--accent)] text-black font-black uppercase tracking-[0.2em] italic text-xs shadow-xl hover:shadow-[var(--accent)]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Apply
                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <FiChevronRight size={16} />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
