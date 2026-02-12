"use client";

import { useState, useEffect } from "react";
import {
    FiUsers,
    FiCopy,
    FiCheckCircle,
    FiLoader,
    FiGift,
    FiAward,
    FiShare2,
    FiDownload,
    FiActivity,
    FiZap
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ReferralTabProps {
    userReferral?: {
        userId: string;
        referralUsed: boolean;
        referralCount: number;
    };
}

export default function ReferralTab({
    userReferral,
}: ReferralTabProps) {
    // Referral states
    const [referralCodeInput, setReferralCodeInput] = useState("");
    const [referralLoading, setReferralLoading] = useState(false);
    const [referralMessage, setReferralMessage] = useState("");
    const [referralSuccess, setReferralSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        if (userReferral?.userId) {
            navigator.clipboard.writeText(userReferral.userId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRedeemReferral = async () => {
        if (!referralCodeInput.trim()) return;

        setReferralLoading(true);
        setReferralMessage("");
        setReferralSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/wallet/redeem-referral", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ referralCode: referralCodeInput }),
            });

            const data = await res.json();

            if (data.success) {
                setReferralSuccess(true);
                setReferralMessage(data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } else {
                setReferralMessage(data.message);
            }
        } catch (error) {
            setReferralMessage("Failed to redeem code.");
        } finally {
            setReferralLoading(false);
        }
    };


    // Referral List states
    const [referrals, setReferrals] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingList, setLoadingList] = useState(true);

    const fetchReferrals = async () => {
        try {
            setLoadingList(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/wallet/referrals?page=${page}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setReferrals(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch referrals", error);
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [page]);


    return (
        <div className="max-w-2xl mx-auto space-y-10">
            {/* TACTICAL STATS MODULE */}
            <div className="relative group overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)]/30 to-transparent blur-3xl opacity-20 pointer-events-none" />
                <div className="relative p-6 sm:p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] flex items-center justify-between overflow-hidden shadow-sm">
                    <div className="absolute right-[-20px] top-[-20px] text-[var(--accent)]/5 rotate-12">
                        <FiUsers size={140} />
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2 italic">
                            Total Referrals
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                                {userReferral?.referralCount || 0}
                            </span>
                            <span className="text-[10px] font-bold text-[var(--muted)]/60 uppercase tracking-widest leading-none">
                                Recruits
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20 shadow-[0_0_20px_var(--accent)]/10">
                        <FiActivity size={24} />
                    </div>
                </div>
            </div>

            {/* ACTION INTERFACE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* SHARE CODE */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
                            <FiShare2 className="text-[var(--accent)]" /> Your Agent Code
                        </label>

                        <div className="relative group">
                            <div className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between group-hover:border-[var(--accent)]/50 transition-all shadow-sm">
                                <code className="text-xl font-black italic tracking-widest text-[var(--foreground)]">
                                    {userReferral?.userId || "Loading..."}
                                </code>
                                <button
                                    onClick={handleCopyCode}
                                    className="p-3 rounded-xl bg-[var(--foreground)]/[0.05] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-black transition-all"
                                >
                                    {copied ? <FiCheckCircle size={18} /> : <FiCopy size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* SUBTLE REWARDS PROMO */}
                        <div className="flex flex-col gap-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] mt-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                                    <FiGift size={18} />
                                </div>
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-widest italic text-[var(--foreground)] block">
                                        Monthly Rewards
                                    </span>
                                    <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">
                                        1 Referral = 1 Coin + Bonus
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REDEEM CODE */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
                            <FiDownload className="text-[var(--accent)]" /> Redeem Code
                        </label>

                        {!userReferral?.referralUsed ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        value={referralCodeInput}
                                        onChange={(e) => setReferralCodeInput(e.target.value)}
                                        className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] focus:bg-[var(--foreground)]/[0.02] focus:border-[var(--accent)]/40 text-lg font-bold font-mono tracking-tight text-[var(--foreground)] placeholder:text-[var(--muted)]/30 outline-none transition-all uppercase"
                                    />
                                </div>
                                {referralMessage && (
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${referralSuccess ? "text-green-500" : "text-red-500"}`}>
                                        {referralMessage}
                                    </p>
                                )}
                                <button
                                    onClick={handleRedeemReferral}
                                    disabled={referralLoading || !referralCodeInput}
                                    className="w-full p-4 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-[0.2em] italic text-xs shadow-[0_20px_40px_-10px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                                >
                                    {referralLoading ? <FiLoader className="animate-spin" size={18} /> : "Redeem Code"}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center gap-3 text-center">
                                <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                                    <FiCheckCircle size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                                    Referral Code Redeemed
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NETWORK LIST (Like Transaction History) */}
            <div className="pt-8 border-t border-[var(--border)]/20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        My Network
                    </h3>
                    <button
                        onClick={fetchReferrals}
                        className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.05] transition-all"
                        title="Refresh Network"
                    >
                        <FiLoader size={14} className={loadingList ? "animate-spin" : ""} />
                    </button>
                </div>

                {loadingList && referrals.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <FiLoader className="animate-spin text-[var(--accent)]" size={24} />
                    </div>
                ) : referrals.length === 0 ? (
                    <div className="text-center py-10 text-[var(--muted)] text-sm">
                        No recruits found. Share your code!
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[var(--foreground)]/[0.03] text-[var(--muted)] font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Recruit</th>
                                            <th className="px-4 py-3">Date Joined</th>
                                            <th className="px-4 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                                        {referrals.map((ref) => (
                                            <tr key={ref._id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                                                        {ref.name?.[0]?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{ref.name || "Unknown"}</p>
                                                        <p className="text-[9px] text-[var(--muted)] font-mono">{ref.userId}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-[10px] text-[var(--muted)] font-mono">
                                                    {new Date(ref.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--foreground)]/[0.05] text-[10px] font-bold text-[var(--muted)] hover:text-[var(--foreground)] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Prev
                                </button>
                                <span className="text-xs font-mono self-center text-[var(--muted)]">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--foreground)]/[0.05] text-[10px] font-bold text-[var(--muted)] hover:text-[var(--foreground)] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
