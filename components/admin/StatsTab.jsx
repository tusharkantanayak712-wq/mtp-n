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
    FiChevronRight,
    FiArrowUp,
    FiArrowDown,
    FiFilter,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

export default function StatsTab() {
    const [loading, setLoading] = useState(true);
    // Data state for stats & wallet list
    const [data, setData] = useState({
        totalBalance: 0,
        activeWallets: 0,
        todayDeposits: 0,
        todayUsage: 0,
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
    const [historyType, setHistoryType] = useState(""); // credit | debit
    const [historyStatus, setHistoryStatus] = useState(""); // success | failed | pending
    const [historyTotalPages, setHistoryTotalPages] = useState(1);

    /* ================= FETCH STATS ================= */
    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setData(prev => ({
                    ...prev,
                    totalBalance: json.data.totalBalance,
                    activeWallets: json.data.activeWallets,
                    todayDeposits: json.data.todayDeposits,
                    todayUsage: json.data.todayUsage
                }));
            }
        } catch (err) {
            console.error("Failed to fetch statistics", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= FETCH WALLET LIST ================= */
    const fetchWallets = async () => {
        try {
            setWalletLoading(true);
            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: walletPage,
                limit: 10,
                search: walletSearch
            });

            const res = await fetch(`/api/admin/stats/data?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setData(prev => ({
                    ...prev,
                    wallets: json.data || [],
                    pagination: json.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
                }));
            }
        } catch (err) {
            console.error("Failed to fetch wallet list", err);
        } finally {
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
                search: historySearch,
                type: historyType,
                status: historyStatus
            });

            const res = await fetch(`/api/admin/wallet/history?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.success) {
                setHistory(json.data || []);
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
                fetchWallets(); // Refresh wallet list
                fetchHistory(); // Refresh history
            }
        } catch (err) {
            console.error("Wallet update error", err);
            alert("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    /* ================= UPDATE STATUS ================= */
    const handleStatusUpdate = async (id, newStatus) => {
        if (!confirm(`Are you sure you want to mark this transaction as ${newStatus}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/wallet/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id, status: newStatus }),
            });
            const json = await res.json();

            if (json.success) {
                alert(json.message);
                fetchHistory();
                fetchStats(); // Update stats as balance might change
                fetchWallets(); // Update wallet list
            } else {
                alert(json.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Status update error", err);
            alert("Failed to update status");
        }
    };


    // Initial load
    useEffect(() => {
        fetchStats();
        fetchWallets();
        fetchHistory();
    }, []);

    // Fetch on history change
    useEffect(() => {
        fetchHistory();
    }, [historyPage, historySearch, historyType, historyStatus]);

    // Fetch on wallet list change
    useEffect(() => {
        fetchWallets();
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
                    onClick={() => { fetchStats(); fetchWallets(); fetchHistory(); }}
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
                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <InsightCard
                            label="Wallet Liability"
                            value={`₹${(data.totalBalance || 0).toLocaleString()}`}
                            icon={<FiCreditCard size={14} />}
                            color="blue"
                        />
                        <InsightCard
                            label="Active Wallets"
                            value={data.activeWallets || 0}
                            icon={<FiUser size={14} />}
                            color="amber"
                        />
                        <InsightCard
                            label="Today's Deposits"
                            value={`₹${(data.todayDeposits || 0).toLocaleString()}`}
                            icon={<FiArrowUp size={14} />}
                            color="emerald"
                            pulse={data.todayDeposits > 0}
                        />
                        <InsightCard
                            label="Today's Usage"
                            value={`₹${(data.todayUsage || 0).toLocaleString()}`}
                            icon={<FiArrowDown size={14} />}
                            color="purple"
                        />
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
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                    Transaction History
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                {/* SEARCH */}
                                <div className="sm:col-span-6 relative">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        value={historySearch}
                                        onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                                        placeholder="Search transactions..."
                                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/50"
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <div className="relative">
                                        <select
                                            value={historyType}
                                            onChange={(e) => { setHistoryType(e.target.value); setHistoryPage(1); }}
                                            className="w-full h-10 px-3 pr-8 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
                                        >
                                            <option value="">All Types</option>
                                            <option value="credit">Credit</option>
                                            <option value="debit">Debit</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
                                            <FiFilter size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <div className="relative">
                                        <select
                                            value={historyStatus}
                                            onChange={(e) => { setHistoryStatus(e.target.value); setHistoryPage(1); }}
                                            className="w-full h-10 px-3 pr-8 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
                                        >
                                            <option value="">All Status</option>
                                            <option value="success">Success</option>
                                            <option value="failed">Failed</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-4 h-4 rounded-full bg-[var(--foreground)]/10 text-[var(--muted)]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE CARD VIEW FOR HISTORY */}
                        <div className="md:hidden space-y-3">
                            {historyLoading ? (
                                <div className="py-12 text-center text-[var(--muted)]">
                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                    Loading history...
                                </div>
                            ) : history.length === 0 ? (
                                <div className="py-12 text-center text-[var(--muted)]">No transactions found.</div>
                            ) : (
                                history.map((txn) => (
                                    <div key={txn._id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-3 relative overflow-hidden">

                                        <div className="flex justify-between items-start z-10 relative">
                                            <div>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${txn.type === 'credit'
                                                    ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-red-500/5 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {txn.type === 'credit' ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />}
                                                    {txn.type}
                                                </span>
                                                <p className="text-[10px] text-[var(--muted)] font-mono mt-2 tracking-wide uppercase opacity-70">TXN ID</p>
                                                <p className="text-xs font-mono text-[var(--foreground)]">{txn.transactionId}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-mono font-bold ${txn.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {txn.type === 'credit' ? '+' : '-'}{txn.amount.toLocaleString()}
                                                </div>
                                                <div className="mt-2 flex justify-end gap-2">
                                                    <div className="mt-2 flex justify-end gap-2">
                                                        {txn.status === 'pending' && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm("Verify with Gateway?")) return;
                                                                    try {
                                                                        const token = localStorage.getItem("token");
                                                                        const res = await fetch("/api/admin/wallet/verify", {
                                                                            method: "POST",
                                                                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                                            body: JSON.stringify({ transactionId: txn._id })
                                                                        });
                                                                        const json = await res.json();
                                                                        alert(json.message);
                                                                        if (json.success) fetchHistory();
                                                                    } catch (e) {
                                                                        alert("Verification Failed");
                                                                    }
                                                                }}
                                                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                                                title="Check & Auto Approve"
                                                            >
                                                                <FiRefreshCw size={14} />
                                                            </button>
                                                        )}
                                                        {txn.status !== 'success' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(txn._id, 'success')}
                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                                                                title="Manually Mark Success"
                                                            >
                                                                <FiCheckCircle size={14} />
                                                            </button>
                                                        )}
                                                        {txn.status !== 'failed' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(txn._id, 'failed')}
                                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                                title="Mark Failed & Deduct"
                                                            >
                                                                <FiXCircle size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs pt-3 mt-1 border-t border-[var(--border)]/40 relative z-10">
                                            <div>
                                                <div className="font-semibold text-[var(--foreground)] mb-0.5">{txn.userId}</div>
                                                <div className="text-[10px] text-[var(--muted)] font-mono">{new Date(txn.createdAt).toLocaleString()}</div>
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${txn.status === 'success'
                                                ? 'text-emerald-500'
                                                : txn.status === 'failed'
                                                    ? 'text-red-500'
                                                    : 'text-yellow-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${txn.status === 'success' ? 'bg-emerald-500' : txn.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                                {txn.status || 'success'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* DESKTOP TABLE VIEW FOR HISTORY */}
                        <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[var(--foreground)]/[0.03] border-b border-[var(--border)] text-[var(--muted)]">
                                        <tr className="text-xs font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-4">Transaction ID</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                            <th className="px-6 py-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {historyLoading ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-[var(--muted)]">
                                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                                    Loading history...
                                                </td>
                                            </tr>
                                        ) : history.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-[var(--muted)]">
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
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${txn.type === 'credit'
                                                            ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                                                            : 'bg-red-500/5 text-red-500 border-red-500/20'
                                                            }`}>
                                                            {txn.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-mono font-bold ${txn.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {txn.type === 'credit' ? '+' : '-'}{txn.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${txn.status === 'success'
                                                            ? 'text-emerald-500'
                                                            : txn.status === 'failed'
                                                                ? 'text-red-500'
                                                                : 'text-yellow-500'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${txn.status === 'success' ? 'bg-emerald-500' : txn.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                                            {txn.status || 'success'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {txn.status === 'pending' && (
                                                                <button
                                                                    onClick={async () => {
                                                                        if (!confirm("Verify this Pending Transaction with Gateway?")) return;
                                                                        try {
                                                                            const token = localStorage.getItem("token");
                                                                            const res = await fetch("/api/admin/wallet/verify", {
                                                                                method: "POST",
                                                                                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                                                body: JSON.stringify({ transactionId: txn._id })
                                                                            });
                                                                            const json = await res.json();
                                                                            alert(json.message);
                                                                            if (json.success) fetchHistory();
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                            alert("Verification API Failed");
                                                                        }
                                                                    }}
                                                                    className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                                                                    title="Check Gateway & Auto Approve"
                                                                >
                                                                    <FiRefreshCw size={14} />
                                                                </button>
                                                            )}
                                                            {txn.status !== 'success' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(txn._id, 'success')}
                                                                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                                                                    title="Manually Mark as Success"
                                                                >
                                                                    <FiCheckCircle size={14} />
                                                                </button>
                                                            )}
                                                            {txn.status !== 'failed' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(txn._id, 'failed')}
                                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                    title="Mark as Failed & Deduct Funds"
                                                                >
                                                                    <FiXCircle size={14} />
                                                                </button>
                                                            )}
                                                        </div>
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
                        </div>

                        {/* Pagination History */}
                        <div className="flex items-center justify-between px-2 sm:px-0 pt-2 border-t border-[var(--border)]">
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

                    {/* USER WALLETS TABLE */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                User Wallets
                            </h3>

                            <div className="relative w-full sm:w-64">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                <input
                                    value={walletSearch}
                                    onChange={(e) => { setWalletSearch(e.target.value); setWalletPage(1); }}
                                    placeholder="Search users..."
                                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/50"
                                />
                            </div>
                        </div>

                        {/* MOBILE CARD VIEW FOR WALLETS */}
                        <div className="md:hidden space-y-3">
                            {walletLoading ? (
                                <div className="py-12 text-center text-[var(--muted)]">
                                    <Loader2 className="animate-spin mx-auto mb-2" />
                                    Loading wallets...
                                </div>
                            ) : (!data.wallets || !data.wallets.length) ? (
                                <div className="py-12 text-center text-[var(--muted)] text-sm">
                                    No wallet data available.
                                </div>
                            ) : (
                                data.wallets.map((user) => (
                                    <div key={user._id} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-sm">
                                                {user.name?.[0]?.toUpperCase() || <FiUser />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[var(--foreground)] text-sm">{user.name || "Unknown"}</span>
                                                    {user.userType === 'owner' && (
                                                        <span className="px-1 py-0.5 rounded text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase">
                                                            OWNER
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-[var(--muted)] font-mono">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-0.5">Balance</div>
                                            <div className="font-bold text-[var(--foreground)] text-sm tabular-nums">
                                                {user.wallet.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* DESKTOP TABLE VIEW FOR WALLETS */}
                        <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
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
                        </div>

                        {/* Pagination Wallets */}
                        <div className="flex items-center justify-between px-2 sm:px-0 pt-2 border-t border-[var(--border)]">
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
                </>
            )}
        </div>
    );
}

function InsightCard({ label, value, icon, color, pulse }) {
    const colors = {
        blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
        amber: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        purple: "text-purple-500 bg-purple-500/5 border-purple-500/10",
        emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    };

    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} flex flex-col gap-2 relative overflow-hidden bg-[var(--card)]`}>
            {pulse && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            )}
            <div className="flex items-center gap-2 opacity-60">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-xl font-black tabular-nums">{value}</span>
        </div>
    );
}
