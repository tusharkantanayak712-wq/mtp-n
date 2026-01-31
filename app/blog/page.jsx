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
];

/* ================= SETTINGS ================= */
const POSTS_PER_PAGE = 6;

const isNewPost = (date) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

/* ================= PAGE ================= */
export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBlogs = useMemo(() => {
    let blogs = [...BLOGS_DATA];

    if (search) {
      blogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== "all") {
      blogs = blogs.filter((b) => b.type === type);
    }

    blogs.sort((a, b) =>
      sort === "latest"
        ? +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : +new Date(a.publishedAt) - +new Date(b.publishedAt)
    );

    return blogs;
  }, [search, type, sort]);

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
  }, [search, type, sort]);

  return (
    <section className="min-h-screen bg-[var(--background)] px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-6xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
            MLBB Blogs & Guides
          </h1>
          <p className="text-base text-[var(--muted)] max-w-2xl">
            Latest pricing updates, safety tips, and MLBB recharge guides.
          </p>
        </motion.header>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] outline-none text-sm focus:ring-2 focus:ring-[var(--accent)]/20 transition shadow-sm"
          />
        </motion.div>

        {/* BLOG GRID */}
        <AnimatePresence mode="wait">
          {paginatedBlogs.length > 0 ? (
            <motion.div
              key="blogs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {paginatedBlogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 text-[var(--muted)]"
            >
              <p className="text-lg">No articles found.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mt-8 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-xl border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--accent)] transition flex items-center gap-2"
            >
              <FiChevronLeft size={16} />
              Prev
            </motion.button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl border transition ${currentPage === i + 1
                  ? "bg-[var(--accent)] text-white font-semibold border-[var(--accent)]"
                  : "border-[var(--border)] hover:border-[var(--accent)]"
                  }`}
              >
                {i + 1}
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--accent)] transition flex items-center gap-2"
            >
              Next
              <FiChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ================= BLOG CARD ================= */
function BlogCard({ blog, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="group block rounded-2xl p-6 bg-[var(--card)] border border-[var(--border)] hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] transition-all duration-300"
      >
        <div className="flex items-center gap-2 text-xs mb-4">
          <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
            {blog.type}
          </span>
          {blog.featured && <FiStar className="text-[var(--accent)]" />}
          {isNewPost(blog.publishedAt) && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 font-semibold">
              New
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold group-hover:text-[var(--accent)] transition mb-3">
          {blog.title}
        </h2>

        <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4">
          {blog.excerpt}
        </p>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <FiClock />
              {blog.readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCalendar />
              {new Date(blog.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[var(--accent)] text-sm font-medium opacity-0 group-hover:opacity-100 transition">
            Read more
            <FiArrowRight className="group-hover:translate-x-1 transition" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
