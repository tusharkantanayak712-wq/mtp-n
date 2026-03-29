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

import { BLOGS_DATA } from "@/lib/blogData";


/* ================= SETTINGS ================= */
const POSTS_PER_PAGE = 6;

const isNewPost = (date) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

/* ================= PAGE ================= */
export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    return ["all", ...new Set(BLOGS_DATA.map((b) => b.type))];
  }, []);

  const filteredBlogs = useMemo(() => {
    let blogs = [...BLOGS_DATA];
    if (search) {
      blogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedType !== "all") {
      blogs = blogs.filter((b) => b.type === selectedType);
    }
    blogs.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return blogs;
  }, [search, selectedType]);

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
  }, [search, selectedType]);

  return (
    <section className="min-h-screen bg-[var(--background)] relative pb-32 transition-colors duration-300 px-6">

      <div className="max-w-4xl mx-auto pt-8 md:pt-12 relative z-10">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-[var(--accent)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Insights & Intel</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-2xl md:text-4xl font-[1000] italic tracking-tighter uppercase leading-none">
              The <span className="text-[var(--accent)]">Blog</span>
            </h2>
            
            {/* 🔍 SEARCH - COMPACT */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch className="text-[var(--muted)] opacity-50" size={14} />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH..."
                className="w-full h-11 pl-10 pr-6 rounded-xl bg-[var(--card)] border border-[var(--border)] outline-none text-[10px] font-bold tracking-widest uppercase focus:border-[var(--accent)]/40 transition-all font-sans"
              />
            </div>
          </div>
        </motion.div>

        {/* 🔖 FILTERS - HORIZONTAL PILLS */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-nowrap gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar"
        >
          {categories.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedType === type
                  ? "bg-[var(--accent)] border-[var(--accent)] text-black italic scale-105"
                  : "bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>



        {/* 📄 BLOG GRID - SINGLE COLUMN FOR SIMPLICITY */}
        <div className="space-y-3">
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

        {/* 🏔️ SEO FOOTER - HEAVY CONTENT MOVED HERE */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 pt-16 border-t border-[var(--border)]/30"
        >
            <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-none mb-6 opacity-20">
                MLBB <span className="text-[var(--accent)]">INSIGHTS & GUIDES</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed italic max-w-2xl opacity-40">
                Your definitive collection of <strong className="text-[var(--foreground)]">MLBB top up india guides</strong>, pricing analysis, and safety protocols. Stay updated with the latest <strong className="text-[var(--foreground)]">mobile legends recharge india fast</strong> tips and diamond bundle value comparisons. We provide the most accurate information for <strong>Mobile Legends players in India</strong> to ensure safe and cheap diamond top-ups.
            </p>
        </motion.div>
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
        className="group block relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 md:p-6 hover:border-[var(--accent)]/30 transition-all duration-300"
      >
        <div className="flex items-center gap-4 md:gap-8">
          {/* 🖼️ THUMBNAIL */}
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-[var(--border)] bg-[var(--card)] group-hover:border-[var(--accent)]/40 transition-colors">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* 📝 CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
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

          {/* ➡️ ACTION */}
          <div className="hidden sm:flex items-center gap-4 text-right">
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
