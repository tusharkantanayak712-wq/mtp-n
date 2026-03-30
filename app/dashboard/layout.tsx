"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import AuthGuard from "../../components/AuthGuard";
import { FiZap, FiInbox, FiHelpCircle, FiZap as FiZapIcon, FiUser, FiCreditCard, FiUsers, FiKey, FiGift } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardCard from "../../components/Dashboard/DashboardCard";

interface UserContextType {
    userDetails: {
        name: string;
        email: string;
        phone: string;
        userId: string;
        userType: string;
        referralUsed: boolean;
        referralCount: number;
    };
    walletBalance: number;
    setWalletBalance: (balance: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [walletBalance, setWalletBalance] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        userId: "",
        userType: "user",
        referralUsed: false,
        referralCount: 0,
    });
    const pathname = usePathname();

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    useEffect(() => {
        if (!token) return;

        const refreshData = () => {
            fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.success) return;
                    setUserDetails({
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone,
                        userId: data.user.userId,
                        userType: data.user.userType,
                        referralUsed: data.user.referralUsed,
                        referralCount: data.user.referralCount,
                    });
                    setWalletBalance(data.user.wallet || 0);
                    localStorage.setItem("walletBalance", String(data.user.wallet || 0));
                });
        };

        refreshData();

        // Listen for wallet updates to refresh balance
        const handleSync = () => {
            const balance = localStorage.getItem("walletBalance");
            if (balance !== null) setWalletBalance(Number(balance));
            // Also refresh from API to be sure
            refreshData();
        };

        window.addEventListener("walletUpdated", handleSync);
        window.addEventListener("storage", handleSync);

        return () => {
            window.removeEventListener("walletUpdated", handleSync);
            window.removeEventListener("storage", handleSync);
        };
    }, [token]);

    const activeTab = pathname.split("/").pop() || "orders";

    const tabCards = [
        { key: "orders", label: "Operations", value: "Orders", icon: FiInbox, href: "/dashboard/orders" },
        { key: "support", label: "Protocol", value: "Support", icon: FiHelpCircle, href: "/dashboard/support" },
        { key: "wallet", label: "Credits", value: "Wallet", icon: FiCreditCard, href: "/dashboard/wallet" },
        { key: "redeem", label: "Gift Card", value: "Redeem", icon: FiGift, href: "/dashboard/redeem" },
        { key: "referral", label: "Network", value: "Referral", icon: FiUsers, href: "/dashboard/referral" },
        // { key: "account", label: "Identity", value: "Profile", icon: FiUser, href: "/dashboard/account" },
    ];

    tabCards.push({ key: "api-keys", label: "Access", value: "API Keys", icon: FiKey, href: "/dashboard/api-keys" });

    return (
        <AuthGuard>
            <UserContext.Provider value={{ userDetails, walletBalance, setWalletBalance }}>
                <section className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-[var(--background)]">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[200px] bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* TACTICAL HEADER */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
                        >
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                                    <FiZap className="text-[var(--accent)] animate-pulse" size={8} />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--accent)] italic">
                                        Systems Online
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                                    COMMAND <span className="text-[var(--accent)]">CENTER</span>
                                </h1>
                                <p className="text-[var(--muted)] text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 italic">
                                    Operative: {userDetails.name || "UNIDENTIFIED"} • Sync Active
                                </p>
                            </div>

                            {/* QUICK STATS */}
                            {/* <div className="flex gap-4">
                                <Link href="/dashboard/wallet" className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]/40 mb-0.5 group-hover:text-[var(--accent)]/60 transition-colors">Wallet Assets</p>
                                    <p className="text-sm font-black italic text-[var(--accent)] leading-none">₹{walletBalance}</p>
                                </Link>
                            </div> */}
                        </motion.div>

                        {/* TACTICAL NAVIGATION */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
                            {tabCards.map((tab, index) => (
                                <motion.div
                                    key={tab.key}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.05 + index * 0.03 }}
                                >
                                    <Link href={tab.href} className="block w-full">
                                        <DashboardCard
                                            tab={tab}
                                            activeTab={activeTab === 'dashboard' ? 'orders' : activeTab}
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* PAGE CONTENT AREA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[var(--card)]/40 backdrop-blur-2xl border border-[var(--border)] rounded-[2rem] p-5 sm:p-8 shadow-2xl min-h-[500px]"
                        >
                            {children}
                        </motion.div>
                    </div>
                </section>
            </UserContext.Provider>
        </AuthGuard>
    );
}
