"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiSearch,
  FiClock,
  FiCalendar,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

/* ================= BLOG DATA ================= */
const BLOGS_DATA = [
  {
    id: "1",
    title: "MLBB Weekly Pass Price in India (2025)",
    slug: "mlbb-weekly-pass-price-in-india",
    type: "Guide",
    excerpt:
      "Learn the latest MLBB weekly pass price in India and whether it's worth buying.",
    publishedAt: "2025-01-10",
    readingTime: "4 min read",
    featured: true,
  },
  {
    id: "2",
    title: "How to Buy MLBB Diamonds Safely in India",
    slug: "how-to-buy-mlbb-diamonds-safely-in-india",
    type: "Safety",
    excerpt:
      "Step-by-step guide to buying MLBB diamonds safely in India.",
    publishedAt: "2025-01-12",
    readingTime: "5 min read",
    featured: true,
  },
  {
    id: "3",
    title: "Is MLBB Top-Up Legal in India?",
    slug: "is-mlbb-top-up-legal-in-india",
    type: "Info",
    excerpt:
      "Understand whether MLBB top-ups are legal in India.",
    publishedAt: "2025-01-05",
    readingTime: "3 min read",
  },
  {
    id: "4",
    title: "How to Gift MLBB Diamonds to Friends (2025)",
    slug: "how-to-gift-mlbb-diamonds",
    type: "Guide",
    excerpt:
      "A complete guide on how to safely gift Mobile Legends diamonds to your friends using their Player ID.",
    publishedAt: "2025-02-07",
    readingTime: "3 min read",
    featured: true,
  },
  {
    id: "5",
    title: "Best MLBB Diamond Packages – Which Gives the Most Value? (2025)",
    slug: "best-mlbb-diamond-packages-value-guide",
    type: "Value Guide",
    excerpt:
      "Not all MLBB diamond packages are equal. Find out which bundle gives you the most diamonds per rupee and how to save more with bonus events.",
    publishedAt: "2025-02-26",
    readingTime: "5 min read",
    featured: true,
  },
];

/* ================= SETTINGS ================= */
const POSTS_PER_PAGE = 6;

const isNewPost = (date) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

/* ================= PAGE ================= */
export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = useMemo(() => {
    let blogs = [...BLOGS_DATA];
    if (search) {
      blogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    blogs.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return blogs;
  }, [search]);

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <section className="min-h-screen bg-[var(--background)] relative pb-32 transition-colors duration-300 px-6">

      <div className="max-w-4xl mx-auto pt-16 md:pt-24 relative z-10">

        {/* 🏆 HEADER SECTION - SIMPLIFIED */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-[900] italic tracking-tighter uppercase leading-none mb-2">
            MLBB <span className="text-[var(--accent)]">INSIGHTS</span>
          </h1>
          <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic font-sans">
            Safety Tips & Pricing Guides
          </p>
        </motion.div>

        {/* 🔍 SEARCH - SLIMMER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-16"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="text-[var(--muted)] opacity-50" size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH..."
            className="w-full h-14 pl-11 pr-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] outline-none text-[12px] font-bold tracking-widest uppercase focus:border-[var(--accent)]/40 transition-all font-sans"
          />
        </motion.div>

        {/* 📄 BLOG GRID - SINGLE COLUMN FOR SIMPLICITY */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {paginatedBlogs.length > 0 ? (
              paginatedBlogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em] italic opacity-20"
              >
                No Articles Discovered
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🔢 PAGINATION - SIMPLE */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] disabled:opacity-20 transition-all hover:border-[var(--accent)]/30"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-black text-[var(--muted)] mx-4 uppercase tracking-[0.2em]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] disabled:opacity-20 transition-all hover:border-[var(--accent)]/30"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= BLOG CARD - STREAMLINED ================= */
function BlogCard({ blog, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="group block relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 hover:border-[var(--accent)]/30 transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.15em] italic">
                {blog.type}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span className="text-[9px] font-bold text-[var(--muted)] opacity-50 uppercase tracking-[0.1em]">
                {new Date(blog.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-[900] uppercase tracking-tighter italic text-[var(--foreground)] leading-[1.1] group-hover:text-[var(--accent)] transition-colors mb-2">
              {blog.title}
            </h2>

            <p className="text-[var(--muted)] text-xs leading-relaxed opacity-60 line-clamp-1">
              {blog.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="hidden md:flex flex-col items-end gap-1 text-[9px] font-black text-[var(--muted)] opacity-30 uppercase tracking-widest group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1.5"><FiClock size={10} /> {blog.readingTime}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-all group-hover:scale-105">
              <FiArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
