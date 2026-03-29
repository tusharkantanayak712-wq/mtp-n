"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiCalendar, FiArrowLeft, FiShare2, FiArrowRight } from "react-icons/fi";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { BLOGS_DATA } from "@/lib/blogData";

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
    const pathname = usePathname();

    const relatedArticles = useMemo(() => {
        const currentSlug = pathname.split("/").pop();
        const filtered = BLOGS_DATA.filter((b) => b.slug !== currentSlug);
        // Shuffle and take 3
        return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 pb-32 transition-colors duration-300">

            {/* Background Lighting */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[10%] w-[50%] h-[30%] bg-[var(--accent)]/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-6 md:pt-12 relative z-10">

                {/* BREADCRUMB SYSTEM */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/50"
                >
                    <Link href="/blog" className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all mr-1">
                        <FiArrowLeft size={14} />
                    </Link>
                    <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                    <span className="opacity-20">/</span>
                    <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">Insights</Link>
                    <span className="opacity-20">/</span>
                    <span className="text-[var(--muted)] line-clamp-1 italic">{title}</span>
                </motion.div>


                <header className="mb-8 md:mb-12">
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

                        <h1 className="text-3xl md:text-6xl font-[1000] italic tracking-tighter uppercase leading-[0.9] text-[var(--foreground)] mb-6 drop-shadow-sm">
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

                {/* RELATED ARTICLES */}
                <section className="mt-32 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-[1px] bg-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Elevate your game</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase mb-10">Related <span className="text-[var(--accent)]">Insights</span></h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                className="group block h-full p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-wider italic">{blog.type}</span>
                                    <h4 className="text-sm md:text-base font-black uppercase italic tracking-tighter leading-tight group-hover:text-[var(--accent)] transition-colors">{blog.title}</h4>
                                </div>
                                <div className="mt-6 flex items-center justify-between text-[var(--muted)] opacity-40 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black uppercase">{blog.readingTime}</span>
                                    <FiArrowRight size={14} />
                                </div>
                            </Link>
                        ))}
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
