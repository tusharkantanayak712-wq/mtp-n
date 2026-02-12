"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiUsers, FiCopy, FiCheck, FiArrowRight, FiUserPlus } from "react-icons/fi";

export default function HomeReferralStats() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                if (json.success) {
                    setUser(json.user);
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const copyToClipboard = () => {
        if (user?.userId) {
            navigator.clipboard.writeText(user.userId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!user && !loading) return null;
    if (loading) return null;

    return (
        <section className="relative max-w-7xl mx-auto px-4 mt-8 mb-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group rounded-3xl p-[1px] overflow-hidden"
                >
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/50 to-[var(--accent)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                    <div className="absolute inset-0 bg-[var(--border)] rounded-3xl" />

                    <div className="relative rounded-3xl bg-[var(--card)]/80 backdrop-blur-xl p-6 h-full transition-all duration-300 group-hover:bg-[var(--card)]/90">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

                        <div className="relative z-10 flex items-center justify-between gap-6">

                            {/* Text Info - Centered/Streamlined without Icon */}
                            <div className="flex flex-col gap-1.5 flex-1">
                                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] to-[var(--muted)] group-hover:to-[var(--accent)] transition-all duration-500">
                                    Referral Hub
                                </h3>

                                <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">

                                    {/* Invites Row */}
                                    <div className="flex items-center gap-2">
                                        <span className="opacity-70">Invites</span>
                                        <div className="h-px w-4 bg-[var(--border)] group-hover:bg-[var(--accent)]/30 transition-colors" />
                                        <span className="text-[var(--foreground)] text-xs font-black tabular-nums">{user.referralCount || 0}</span>
                                    </div>

                                    {/* Code Row */}
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 group/code w-fit hover:opacity-100 transition-opacity text-left"
                                    >
                                        <span className="opacity-70 group-hover/code:text-[var(--accent)] transition-colors">Code</span>
                                        <div className="h-px w-6 bg-[var(--border)] group-hover/code:bg-[var(--accent)]/50 transition-colors" />
                                        <div className="px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--border)] group-hover/code:border-[var(--accent)]/40 group-hover/code:shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)] transition-all flex items-center gap-2">
                                            <span className="text-[var(--foreground)] font-mono text-xs tracking-wider">{user.userId}</span>
                                            {copied ? <FiCheck size={10} className="text-emerald-500" /> : <FiCopy size={10} className="opacity-0 group-hover/code:opacity-100 transition-opacity text-[var(--accent)]" />}
                                        </div>
                                    </button>

                                    {/* Footer Row */}
                                    <div className="pt-2 mt-1 border-t border-[var(--border)]/40 flex items-center gap-2">
                                        <FiUserPlus size={10} className="text-[var(--accent)]" />
                                        {user.referredBy ? (
                                            <span className="text-[10px] font-mono opacity-50">Invited by {user.referredBy}</span>
                                        ) : (
                                            <Link href="/dashboard/referral" className="flex items-center gap-1 text-[var(--accent)] hover:text-[var(--foreground)] transition-colors text-[10px] font-bold tracking-widest">
                                                ADD REFERRER <FiArrowRight size={10} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Ultra Premium Button */}
                            <Link
                                href="/dashboard/referral"
                                className="relative w-14 h-14 flex items-center justify-center rounded-full border border-[var(--accent)]/20 bg-gradient-to-br from-[var(--card)] to-[var(--background)] shadow-[0_4px_20px_rgba(0,0,0,0.2)] group/btn overflow-hidden hover:scale-105 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent)]/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                <FiArrowRight
                                    size={22}
                                    className="text-[var(--muted)] group-hover/btn:text-[var(--accent)] -rotate-45 group-hover/btn:rotate-0 transition-all duration-500 ease-out"
                                />
                            </Link>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
