"use client";

import Link from "next/link";
import { FiShoppingCart, FiDollarSign, FiClock, FiChevronRight } from "react-icons/fi";

export default function TradeMarketplaceBanner() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 mt-2">
      <div className="max-w-xl mx-auto">
        <Link
          href="/trade"
          className="group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--accent)]/10 via-[var(--foreground)]/[0.02] to-purple-500/10 backdrop-blur-xl p-3 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-lg active:scale-[0.98]"
        >
          {/* Background Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-[40px] pointer-events-none group-hover:bg-[var(--accent)]/10 transition-colors" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[FiShoppingCart, FiDollarSign, FiClock].map((Icon, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform shadow-sm group-hover:z-10"
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-tight italic">
                  Game ID Marketplace
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-tight">Buy</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--muted)]/30" />
                  <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-tight">Sell</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--muted)]/30" />
                  <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-tight">Rent</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
              <span className="text-[8px] font-black uppercase tracking-widest">Trade Now</span>
              <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[var(--foreground)]/5 to-transparent pointer-events-none" />
        </Link>
      </div>
    </section>
  );
}
