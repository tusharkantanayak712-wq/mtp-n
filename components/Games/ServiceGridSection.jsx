"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiZap, FiTv, FiShield, FiChevronRight } from "react-icons/fi";

export default function ServiceGridSection({
  title,
  total,
  items,
  hrefPrefix,
  showCategory = true,
  ctaText = "View Details"
}) {
  if (!items?.length) return null;

  // Determine icon and gradient based on title
  const isOtt = title?.toLowerCase().includes("ott");
  const config = isOtt
    ? { icon: FiTv, gradient: "from-purple-500 to-indigo-600" }
    : { icon: FiShield, gradient: "from-amber-400 to-orange-500" };

  const Icon = config.icon;

  return (
    <section className="relative mb-16 px-1">
      {/* HEADER SYSTEM */}
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8"
        >
          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
                {total} Elite Items
              </span>
            </div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        </motion.div>
      )}

      {/* GRID SYSTEM (Responsive Columns) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.03,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            whileHover={{ y: -5 }}
          >
            <Link
              href={`${hrefPrefix}/${item.slug}`}
              className="group relative block rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl transition-all duration-500 hover:border-[var(--accent)]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full aspect-square sm:aspect-video overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* HOVER GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial-gradient from-[var(--accent)]/20 via-transparent to-transparent pointer-events-none" />

                {/* CATEGORY & MANUAL BADGES */}
                <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start gap-2">
                  {showCategory && item.category && (
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white">
                      {item.category}
                    </span>
                  )}
                  {item.isManual && (
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-lg bg-amber-500/80 backdrop-blur-md border border-amber-400/30 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)] flex items-center gap-1">
                      <FiZap size={8} fill="currentColor" />
                      Manual
                    </span>
                  )}
                </div>

                {/* VIEW BUTTON (MATCHING GAMECARD) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-95">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                    <FiEye size={18} />
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-2 sm:p-2.5 relative">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-tight italic leading-tight line-clamp-2 transition-colors text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {item.name}
                  </h3>
                  <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-all group-hover:translate-x-1" size={14} />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40 group-hover:bg-[var(--accent)] transition-colors shadow-[0_0_8px_var(--accent)]" />
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tight text-[var(--muted)]">
                    {ctaText}
                  </p>
                  {item.isManual && (
                    <span className="flex-1 text-right text-[7px] font-black text-amber-500 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                      • Manual
                    </span>
                  )}
                </div>
              </div>

              {/* ACCENT BAR */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent)] group-hover:w-full transition-all duration-700 shadow-[0_0_10px_var(--accent)]" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
