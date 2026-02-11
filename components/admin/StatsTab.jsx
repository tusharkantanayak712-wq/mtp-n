"use client";

import { useEffect, useState } from "react";
import {
    FiUser,
    FiCreditCard,
    FiRefreshCw,
    FiPlus,
    FiMinus,
    FiMail,
    FiDollarSign,
    FiClock,
    FiSearch,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function StatsTab() {
    const [loading, setLoading] = useState(true);
    // Data state for stats & wallet list
    const [data, setData] = useState({
        totalBalance: 0,
        wallets: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 }
    });

    // Wallet List State
    const [walletPage, setWalletPage] = useState(1);
    const [walletSearch, setWalletSearch] = useState("");
    const [walletLoading, setWalletLoading] = useState(false);

    // Manage Wallet State
    const [manageEmail, setManageEmail] = useState("");
    const [manageAmount, setManageAmount] = useState("");
    const [updating, setUpdating] = useState(false);

    // History State
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historySearch, setHistorySearch] = useState("");
    const [historyTotalPages, setHistoryTotalPages] = useState(1);

    /* ================= FETCH STATS & WALLETS ================= */
    const fetchStats = async () => {
        try {
            setWalletLoading(true);
            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: walletPage,
                limit: 10,
                search: walletSearch
            });

            const res = await fetch(`/api/admin/stats?${params}`, {
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
            setWalletLoading(false);
        }
    };

    /* ================= FETCH HISTORY ================= */
    const fetchHistory = async () => {
        try {
            setHistoryLoading(true);
            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: historyPage,
                limit: 10,
                search: historySearch
            });

            const res = await fetch(`/api/admin/wallet/history?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setHistory(json.data);
                setHistoryTotalPages(json.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
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
                fetchHistory(); // Refresh history
            }
        } catch (err) {
            console.error("Wallet update error", err);
            alert("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchStats();
        fetchHistory();
    }, []);

    // Fetch on history change
    useEffect(() => {
        fetchHistory();
    }, [historyPage, historySearch]);

    // Fetch on wallet list change
    useEffect(() => {
        fetchStats();
    }, [walletPage, walletSearch]);

    return (
        <div className="space-y-8 pb-10">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Wallet Manager</h2>
                    <p className="text-sm text-[var(--muted)] mt-1">
                        Overview, Manual Adjustments & Transaction History.
                    </p>
                </div>

                <button
                    onClick={() => { fetchStats(); fetchHistory(); }}
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

            {loading && !data.totalBalance && (!data.wallets || !data.wallets.length) ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
                    <p className="text-sm text-[var(--muted)] font-medium">Fetching wallet data...</p>
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

                    {/* TRANSACTION HISTORY */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                Transaction History
                            </h3>

                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    value={historySearch}
                                    onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                                    placeholder="Search history..."
                                    className="h-9 pl-9 pr-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[var(--foreground)]/[0.03] border-b border-[var(--border)] text-[var(--muted)]">
                                        <tr className="text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-4">Transaction ID</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                            <th className="px-6 py-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {historyLoading ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-[var(--muted)]">
                                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                                    Loading history...
                                                </td>
                                            </tr>
                                        ) : history.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-[var(--muted)]">
                                                    No transactions found.
                                                </td>
                                            </tr>
                                        ) : (
                                            history.map((txn) => (
                                                <tr key={txn._id} className="group hover:bg-[var(--foreground)]/[0.02] transition-colors">
                                                    <td className="px-6 py-4 text-[11px] font-mono text-[var(--muted)]">
                                                        {txn.transactionId}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-medium text-[var(--foreground)] block">{txn.userId}</span>
                                                        <span className="text-[10px] text-[var(--muted)]">{txn.description}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${txn.type === 'credit'
                                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                            }`}>
                                                            {txn.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-mono font-bold ${txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                            {txn.type === 'credit' ? '+' : '-'}{txn.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[11px] text-[var(--muted)]">
                                                        {txn.performedBy === 'admin' ? 'Admin' : 'System/User'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[11px] text-[var(--muted)] font-mono">
                                                        {new Date(txn.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
                                <span className="text-xs text-[var(--muted)]">
                                    Page {historyPage} of {historyTotalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={historyPage === 1}
                                        onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FiChevronLeft size={14} />
                                    </button>
                                    <button
                                        disabled={historyPage === historyTotalPages}
                                        onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))}
                                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FiChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* USER WALLETS TABLE (Replcaed Top 10) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                User Wallets
                            </h3>

                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    value={walletSearch}
                                    onChange={(e) => { setWalletSearch(e.target.value); setWalletPage(1); }}
                                    placeholder="Search users..."
                                    className="h-9 pl-9 pr-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
                                />
                            </div>
                        </div>

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
                                        {walletLoading ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-[var(--muted)]">
                                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                                    Loading wallets...
                                                </td>
                                            </tr>
                                        ) : (!data.wallets || !data.wallets.length) ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-[var(--muted)] text-sm">
                                                    No wallet data available.
                                                </td>
                                            </tr>
                                        ) : (
                                            data.wallets.map((user, idx) => (
                                                <tr
                                                    key={user._id}
                                                    className="group hover:bg-[var(--foreground)]/[0.02] transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-center font-mono text-[var(--muted)]/60">
                                                        {(data.pagination.page - 1) * data.pagination.limit + idx + 1}
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
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
                                <span className="text-xs text-[var(--muted)]">
                                    Page {data.pagination?.page || 1} of {data.pagination?.totalPages || 1}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={!data.pagination || data.pagination.page === 1}
                                        onClick={() => setWalletPage(p => Math.max(1, p - 1))}
                                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FiChevronLeft size={14} />
                                    </button>
                                    <button
                                        disabled={!data.pagination || data.pagination.page === data.pagination.totalPages}
                                        onClick={() => setWalletPage(p => Math.min(data.pagination?.totalPages || 1, p + 1))}
                                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FiChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
