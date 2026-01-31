"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ServiceGridSection({
  title,
  total,
  items,
  hrefPrefix,
}) {
  if (!items?.length) return null;

  return (
    <section className="max-w-7xl mx-auto mb-6 mt-7">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        <span className="text-sm text-[var(--muted)]">
          {total}
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={`${hrefPrefix}/${item.slug}`}
              className="group block relative overflow-hidden rounded-xl
              bg-[var(--card)]
              border border-[var(--border)]
              transition-all duration-300
              hover:shadow-xl hover:border-[var(--accent)]
              hover:-translate-y-1"
            >
              {/* IMAGE (WIDE, SHORT) */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--muted)]/10">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500
                  group-hover:scale-110"
                />

                {/* GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t
                from-black/70 via-black/20 to-transparent" />

                {/* CATEGORY BADGE */}
                {item.category && (
                  <span className="absolute top-2 left-2 text-[9px]
                  px-2 py-0.5 rounded-full
                  bg-black/60 text-white backdrop-blur-sm font-medium">
                    {item.category}
                  </span>
                )}
              </div>

              {/* CONTENT (COMPACT) */}
              <div className="px-2.5 py-2">
                <h3 className="text-xs font-semibold text-[var(--foreground)]
                truncate group-hover:text-[var(--accent)] transition-colors mb-0.5">
                  {item.name}
                </h3>

                <span className="text-[10px] text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                  View Plans →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
