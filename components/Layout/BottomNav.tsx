"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiHome, FiCreditCard, FiShoppingBag, FiUsers, FiHeadphones, FiMessageSquare, FiGrid } from "react-icons/fi";

import { useUIStore } from "@/store/useUIStore";

const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { toggleChatbot, isChatbotOpen } = useUIStore();

    // Hide BottomNav on certain pages if needed
    const hideOnRoutes = ["/admin", "/owner"];
    if (hideOnRoutes.some(route => pathname?.startsWith(route))) return null;

    const navItems = [
        { label: "Wallet", icon: FiCreditCard, path: "/dashboard/wallet", action: () => router.push("/dashboard/wallet") },
        { label: "Games", icon: FiGrid, path: "/games", action: () => router.push("/games") },
        { label: "Orders", icon: FiShoppingBag, path: "/dashboard/orders", action: () => router.push("/dashboard/orders") },
        { label: "Home", icon: FiHome, path: "/", isHome: true, action: () => router.push("/") },
        { label: "Referral", icon: FiUsers, path: "/dashboard/referral", action: () => router.push("/dashboard/referral") },
        { label: "Support", icon: FiHeadphones, path: "/dashboard/support", action: () => router.push("/dashboard/support") },
        { label: "AI Chat", icon: FiMessageSquare, action: () => toggleChatbot() },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[var(--card)]/80 backdrop-blur-2xl border-t border-[var(--border)] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-around h-14 px-1">
                {navItems.map((item, idx) => {
                    const isActive = item.label === "AI Chat"
                        ? isChatbotOpen
                        : item.isHome
                            ? (pathname === "/" || pathname === "/home")
                            : (item.path && (pathname === item.path || pathname.startsWith(item.path + "/")));

                    const Icon = item.icon;

                    if (item.isHome) {
                        return (
                            <div key={idx} className="relative -top-3.5 flex-shrink-0">
                                <motion.button
                                    onClick={item.action}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-[3px] border-[var(--card)] transition-all duration-300 ${isActive
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--foreground)] text-[var(--background)]"
                                        }`}
                                >
                                    <Icon className="text-xl" />
                                </motion.button>
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--accent)] rounded-full shadow-[0_0_5px_var(--accent)]" />
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="flex flex-col items-center justify-center gap-0.5 w-10 transition-all active:scale-90"
                        >
                            <div className={`transition-colors duration-300 ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}>
                                <Icon className="text-base" />
                            </div>
                            <span className={`text-[6px] font-black uppercase tracking-tighter truncate w-full text-center ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted)]/60"}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
