"use client";

import { useEffect, useState } from "react";
import {
    FiUser,
    FiCreditCard,
    FiRefreshCw,
    FiPlus,
    FiMinus,
    FiMail,
    FiDollarSign
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function StatsTab() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ totalBalance: 0, topWallets: [] });

    const [manageEmail, setManageEmail] = useState("");
    const [manageAmount, setManageAmount] = useState("");
    const [updating, setUpdating] = useState(false);

    /* ================= FETCH STATS ================= */
    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            }
        } catch (err) {
            console.error("Failed to fetch stats", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= MANAGE WALLET ================= */
    const handleManageWallet = async (action) => {
        if (!manageEmail || !manageAmount || Number(manageAmount) <= 0) {
            alert("Please enter a valid email and amount");
            return;
        }

        try {
            setUpdating(true);
            const token = localStorage.getItem("token");

            const res = await fetch("/api/admin/wallet/manage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: manageEmail,
                    amount: Number(manageAmount),
                    action,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.message || "Failed to update wallet");
            } else {
                alert(json.message);
                setManageEmail("");
                setManageAmount("");
                fetchStats(); // Refresh stats
            }
        } catch (err) {
            console.error("Wallet update error", err);
            alert("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 pb-10">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Platform Statistics</h2>
                    <p className="text-sm text-[var(--muted)] mt-1">
                        Overview of cumulative wallet balances and top user accounts.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] active:scale-95 transition-all outline-none disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <FiRefreshCw size={16} />
                    )}
                </button>
            </div>

            {loading && !data.totalBalance && !data.topWallets.length ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
                    <p className="text-sm text-[var(--muted)] font-medium">Fetching statistics...</p>
                </div>
            ) : (
                <>
                    {/* TOTAL BALANCE CARD */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all">
                        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)] opacity-20 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide">
                                    Total Wallet Liability
                                </p>
                                <p className="text-[10px] text-[var(--muted)]/60 mt-1 max-w-sm">
                                    The cumulative sum of all user wallet balances currently held across the platform.
                                </p>
                            </div>
                            <div className="p-3 bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
                                <FiCreditCard size={24} />
                            </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
                                {(data.totalBalance || 0).toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-[var(--muted)]">Credits</span>
                        </div>
                    </div>

                    {/* MANUAL WALLET ADJUSTMENT */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            <h3 className="text-lg font-bold text-[var(--foreground)]">Manual Wallet Adjustment</h3>
                        </div>

                        <div className="flex flex-col md:flex-row items-end gap-4">
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-xs font-semibold text-[var(--muted)] ml-1">User Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="email"
                                        value={manageEmail}
                                        onChange={(e) => setManageEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] text-[var(--foreground)] text-sm focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-[var(--muted)]/40"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 space-y-2">
                                <label className="text-xs font-semibold text-[var(--muted)] ml-1">Amount</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="number"
                                        value={manageAmount}
                                        onChange={(e) => setManageAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] text-[var(--foreground)] text-sm focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-[var(--muted)]/40"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => handleManageWallet("add")}
                                    disabled={updating}
                                    className="flex-1 md:flex-none h-11 px-5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/20 active:scale-95 transition-all outline-none disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14} /> : <FiPlus size={14} />}
                                    Add Funds
                                </button>
                                <button
                                    onClick={() => handleManageWallet("remove")}
                                    disabled={updating}
                                    className="flex-1 md:flex-none h-11 px-5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition-all outline-none disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14} /> : <FiMinus size={14} />}
                                    Remove Funds
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TOP WALLETS TABLE */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            Top 10 Wallets
                        </h3>

                        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[var(--foreground)]/[0.03] border-b border-[var(--border)] text-[var(--muted)]">
                                        <tr className="text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-4 w-16 text-center">#</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Email / ID</th>
                                            <th className="px-6 py-4 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {data.topWallets.map((user, idx) => (
                                            <tr
                                                key={user._id}
                                                className="group hover:bg-[var(--foreground)]/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-4 text-center font-mono text-[var(--muted)]/60">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-xs">
                                                            {user.name?.[0]?.toUpperCase() || <FiUser />}
                                                        </div>
                                                        <span className="font-medium text-[var(--foreground)]">
                                                            {user.name || "Unknown"}
                                                        </span>
                                                        {user.userType === 'owner' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 font-semibold">
                                                                OWNER
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[var(--foreground)]/80 text-xs font-mono">{user.email || 'No Email'}</span>
                                                        <span className="text-[10px] text-[var(--muted)]/60 font-mono mt-0.5">{user.userId}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-[var(--foreground)] tabular-nums">
                                                        {user.wallet.toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {!data.topWallets.length && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-[var(--muted)] text-sm">
                                                    No wallet data available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
