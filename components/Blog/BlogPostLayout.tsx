"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiCalendar, FiArrowLeft, FiShare2 } from "react-icons/fi";
import { ReactNode } from "react";

interface BlogPostLayoutProps {
    title: string;
    category: string;
    readTime: string;
    date: string;
    image: string;
    children: ReactNode;
    backHref?: string;
}

export default function BlogPostLayout({
    title,
    category,
    readTime,
    date,
    image,
    children,
    backHref = "/blog",
}: BlogPostLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 pb-32 transition-colors duration-300">

            {/* Background Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[10%] w-[50%] h-[30%] bg-[var(--accent)]/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-12 md:pt-24 relative z-10">

                {/* BACK BUTTON */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.4em] transition-all group no-underline"
                    >
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Insights
                    </Link>
                </motion.div>

                {/* HEADER */}
                <header className="mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[9px] font-black uppercase tracking-widest border border-[var(--accent)]/10">
                                {category}
                            </span>
                            <div className="flex items-center gap-4 text-[var(--muted)] opacity-50 text-[10px] font-black uppercase tracking-widest ml-2">
                                <span className="flex items-center gap-1.5"><FiClock size={12} /> {readTime}</span>
                                <span className="flex items-center gap-1.5"><FiCalendar size={12} /> {date}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-[1000] italic tracking-tighter uppercase leading-[0.9] text-[var(--foreground)] mb-8 drop-shadow-sm">
                            {title}
                        </h1>
                    </motion.div>

                    {image && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="relative rounded-[40px] overflow-hidden border border-[var(--border)] shadow-2xl aspect-[16/9]"
                        >
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/40 to-transparent pointer-events-none" />
                        </motion.div>
                    )}
                </header>

                {/* CONTENT SECTION */}
                <section className="max-w-2xl mx-auto">
                    <div className="prose prose-invert prose-p:text-[var(--muted)] prose-p:opacity-80 prose-p:leading-relaxed prose-headings:text-[var(--foreground)] prose-headings:italic prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-[var(--accent)] prose-ul:list-disc prose-ul:marker:text-[var(--accent)] prose-ol:list-decimal prose-ol:marker:text-[var(--accent)] space-y-10 selection:bg-[var(--accent)]/20 transition-colors">
                        {children}
                    </div>
                </section>

                {/* SHARE SECTION */}
                <footer className="max-w-2xl mx-auto mt-24 pt-10 border-t border-[var(--border)] flex flex-col items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--muted)] opacity-40">Enjoyed this guide? Share it</span>
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <button key={i} className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all hover:scale-110 shadow-lg">
                                <FiShare2 size={18} />
                            </button>
                        ))}
                    </div>
                </footer>
            </article>
        </div>
    );
}
