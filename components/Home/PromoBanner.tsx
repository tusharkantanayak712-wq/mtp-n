"use client";

import { motion } from "framer-motion";
import { FiExternalLink, FiLayout, FiPackage } from "react-icons/fi";

export default function PromoBanner() {
    const promoLink = "https://www.rupeebridge.in/";

    return (
        <section className="relative max-w-7xl mx-auto px-4 mt-4 mb-2">
            <div className="max-w-xl mx-auto">
                <motion.a
                    href={promoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl p-4 transition-all duration-300 hover:border-amber-500/30"
                >
                    {/* Background Decorative */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <FiLayout size={18} />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)] group-hover:text-amber-500 transition-colors leading-tight">
                                    SMM & Vouchers
                                </h3>
                                <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-tight mt-0.5">
                                    Checkout our new platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                            <span className="text-[9px] font-black uppercase tracking-widest">RupeeBridge</span>
                            <FiExternalLink size={10} />
                        </div>
                    </div>

                    {/* Subtle Shine Effect */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[var(--foreground)]/5 to-transparent pointer-events-none" />
                </motion.a>
            </div>
        </section>
    );
}
