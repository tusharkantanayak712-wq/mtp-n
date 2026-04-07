"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiSettings, FiTool, FiClock, FiLogOut, FiActivity, FiLock } from "react-icons/fi";

export default function Maintaince() {
    const [show, setShow] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLoggingOff = () => {
        setIsLoggingOut(true);
        const keysToRemove = ["token", "userName", "email", "userId", "phone", "userType", "walletBalance", "pending_topup_order", "avatar"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem("mlbb_verified_players");
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    };

    const handleLogin = () => {
        window.location.href = "/login";
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-sm bg-[#121214] border border-white/5 rounded-2xl p-7 text-center shadow-2xl"
                    >
                        <div className="flex flex-col items-center">
                            <Image 
                                src="/logoBB.png" 
                                alt="Logo" 
                                width={120} 
                                height={35} 
                                className="mb-8 opacity-100"
                            />

                            <h2 className="text-xl font-bold text-white mb-2">
                                We'll be back soon
                            </h2>
                            
                            <p className="text-[var(--muted)] text-xs mb-5 leading-relaxed">
                                We are performing a quick maintenance.
                                <br />
                                <span className="text-[var(--accent)] font-medium italic">Back in 10-30 minutes!</span>
                            </p>

                            {/* WhatsApp Support Block */}
                            <div className="w-full mb-7 p-4 rounded-xl bg-[#1a1a1d] border border-white/5 group hover:border-[#25D366]/30 transition-all">
                                <a 
                                    href="https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 text-white hover:text-[#25D366] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                                        <FaWhatsapp size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold leading-tight">Quick Topups</p>
                                        <p className="text-[10px] opacity-40">Join WhatsApp Channel</p>
                                    </div>
                                </a>
                            </div>

                            <div className="w-full space-y-3">
                                {!isLoggedIn ? (
                                    <button
                                        onClick={handleLogin}
                                        className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                                    >
                                        Login
                                    </button>
                                ) : !isLoggingOut ? (
                                    <button
                                        onClick={handleLoggingOff}
                                        className="w-full py-3.5 rounded-xl border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <div className="text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                        Logging Out...
                                    </div>
                                )}
                            </div>

                            <p className="mt-10 text-[8px] text-white/20 font-medium uppercase tracking-[0.3em]">
                                © 2026 BLUE BUFF NEXUS
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
