"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiCreditCard, FiShoppingBag, FiGrid, FiTarget, FiGift, FiHeadphones, FiZap, FiLayers, FiAward } from "react-icons/fi";


const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide BottomNav on certain pages if needed
    const hideOnRoutes = ["/admin", "/owner", "/blog", "/login", "/register"];
    if (hideOnRoutes.some(route => pathname?.startsWith(route))) return null;

    // Retained 7 items, preserving symmetry around the Home button
    const navItems = [
        { label: "Wallet", icon: FiCreditCard, path: "/dashboard/wallet", action: () => router.push("/dashboard/wallet") },
        { label: "Games", icon: FiGrid, path: "/games", action: () => router.push("/games") },
        { label: "Home", icon: FiHome, path: "/", action: () => router.push("/") },
        { label: "Earn", icon: FiZap, path: "/dashboard/coins", isHome: true, action: () => router.push("/dashboard/coins") },
        { label: "Blog", icon: FiLayers, path: "/blog", action: () => router.push("/blog") },
        { label: "Tourney", icon: FiAward, path: "/tournament", action: () => router.push("/tournament") },
        { label: "Orders", icon: FiShoppingBag, path: "/dashboard/orders", action: () => router.push("/dashboard/orders") },
    ];

    return (
        <div className="md:hidden fixed bottom-1 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full flex justify-center px-1">
            <div className={`relative flex items-center justify-between gap-0.5 sm:gap-1.5 px-1.5 py-0.5 rounded-[1.25rem] transition-all duration-500 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${scrolled ? 'bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)]/70' : 'bg-[var(--card)]/95 backdrop-blur-2xl border border-[var(--border)] shadow-2xl'}`}>

                {/* Ambient glow behind dock */}
                <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-r from-[var(--accent)]/10 via-[var(--foreground)]/5 to-[var(--accent)]/10 blur-xl z-[-1] opacity-50"></div>
                {/* Subtle inner top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>

                {navItems.map((item, idx) => {
                    const isActive = item.isHome
                        ? (pathname === "/" || pathname === "/home")
                        : (item.path && (pathname === item.path || pathname.startsWith(item.path + "/")));

                    const Icon = item.icon;

                    if (item.isHome) {
                        return (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="relative flex flex-col items-center justify-end w-[36px] h-[38px] sm:w-[40px] sm:h-[40px] rounded-xl transition-all duration-300 group"
                                aria-label={item.label}
                            >
                                {/* Distinctive Prominent Floating Circle */}
                                <div className="absolute -top-2 z-20">
                                    <div className={`flex items-center justify-center w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full shadow-[0_4px_12px_rgba(var(--accent-rgb),0.4)] border-[2px] border-[var(--card)] transition-transform duration-300 ${isActive ? 'bg-gradient-to-br from-[var(--accent)] to-indigo-600 scale-105' : 'bg-[var(--accent)] hover:scale-105'}`}>
                                        <Icon className="text-[0.95rem] sm:text-[1rem] text-white" />
                                    </div>
                                </div>
                                <span className={`absolute bottom-0.5 text-[4.5px] sm:text-[5px] font-[900] uppercase tracking-tighter transition-all duration-300 ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]/80 group-hover:text-[var(--foreground)]/90"}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="relative flex flex-col items-center justify-center w-[36px] h-[38px] sm:w-[40px] sm:h-[40px] rounded-xl transition-all duration-300 group overflow-hidden"
                            aria-label={item.label}
                        >
                            {/* Animated indicator pill */}
                            {isActive && (
                                <div className="absolute inset-0 bg-[var(--foreground)]/5 border border-[var(--border)]/40 rounded-xl pointer-events-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />
                            )}

                            <div className="flex flex-col items-center gap-[1px] z-10 w-full mt-0.5">
                                <Icon className={`text-[0.95rem] transition-all duration-300 ${isActive ? "text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)] -translate-y-0.5 scale-110" : "text-[var(--muted)] group-hover:text-[var(--foreground)]/80 group-hover:-translate-y-0.5"}`} />
                                <span className={`text-[4.5px] sm:text-[5px] font-[900] uppercase tracking-tighter transition-all duration-300 ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]/80 group-hover:text-[var(--foreground)]/90"}`}>
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
