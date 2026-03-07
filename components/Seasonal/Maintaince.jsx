"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSettings, FiTool, FiClock, FiLogOut, FiActivity, FiLock } from "react-icons/fi";

export default function Maintaince() {
    const [show, setShow] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Overlay is visible immediately
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLoggingOff = () => {
        setIsLoggingOut(true);

        // Clear storage as seen in Header.jsx
        const keysToRemove = ["token", "userName", "email", "userId", "phone", "userType", "walletBalance", "pending_topup_order", "avatar"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem("mlbb_verified_players");

        // Redirect after a short delay to show the "Logging out" animation
        setTimeout(() => {
            window.location.href = "/";
        }, 2500);
    };

    const handleLogin = () => {
        window.location.href = "/login";
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                    {/* Backdrop with extreme blur for "Maintenance" focus */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    {/* Premium Card Design */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="relative w-full max-w-[400px] bg-[#0c0c0e] border border-blue-500/20 rounded-[40px] p-8 text-center shadow-[0_0_80px_rgba(59,130,246,0.1)] overflow-hidden"
                    >
                        {/* Ambient Background Glows */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col items-center">

                            {/* Animated Maintenance Icon */}
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm"
                                >
                                    <FiSettings className="text-blue-500 text-4xl opacity-50" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <FiTool className="text-blue-400 text-3xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </motion.div>

                                {/* Floating Micro-elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -top-2 -right-4 text-blue-300 opacity-40"
                                >
                                    <FiActivity size={16} />
                                </motion.div>
                                <motion.div
                                    animate={{ x: [0, 10, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    className="absolute bottom-2 -left-6 text-blue-500/40"
                                >
                                    <FiClock size={20} />
                                </motion.div>
                            </div>

                            {/* Text Content */}
                            <h2 className="text-3xl font-[900] italic uppercase tracking-tighter text-white leading-tight mb-2">
                                System Under <span className="text-blue-500">Maintenance</span>
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/60 mb-6">
                                Maintenance Protocol Active
                            </p>

                            <div className="space-y-4 mb-8">
                                <p className="text-white/70 text-sm font-medium leading-relaxed">
                                    We're polishing things up for you.
                                    <br />
                                    <span className="text-white font-bold">Will soon be working!</span>
                                </p>
                                <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mx-auto" />
                            </div>

                            {/* Dynamic Action Area */}
                            <div className="w-full">
                                {!isLoggedIn ? (
                                    <motion.button
                                        onClick={handleLogin}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-[800] uppercase tracking-wider text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <FiLock className="text-sm group-hover:scale-110 transition-transform" />
                                        Secure Login
                                    </motion.button>
                                ) : !isLoggingOut ? (
                                    <motion.button
                                        onClick={handleLoggingOff}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-[800] uppercase tracking-wider text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <FiLogOut className="text-sm group-hover:-translate-x-1 transition-transform" />
                                        Logout
                                    </motion.button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                                            />
                                            <span className="text-sm font-bold text-white uppercase tracking-widest italic">
                                                Logging Out...
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2 }}
                                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="mt-8 text-[8px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                                Blue Buff Nexus • 2026
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
