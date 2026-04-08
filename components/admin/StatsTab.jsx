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
    FiXCircle,
    FiTrendingUp,
    FiActivity,
    FiMoreVertical
} from "react-icons/fi";
import { Loader2, Zap, ArrowUpRight, ArrowDownRight, User, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatsTab() {
    const [loading, setLoading] = useState(true);
    // Data state for stats & wallet list
    const [data, setData] = useState({
        totalBalance: 0,
        activeWallets: 0,
        deposits: { day: 0, week: 0, month: 0 },
        usage: { day: 0, week: 0, month: 0 },
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

    // Tab State
    const [activeTab, setActiveTab] = useState("history"); // history | wallets

    // Modal State
    const [selectedUserForWallet, setSelectedUserForWallet] = useState(null);
    const [quickAmount, setQuickAmount] = useState("");

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
                    deposits: json.data.deposits || { day: 0, week: 0, month: 0 },
                    usage: json.data.usage || { day: 0, week: 0, month: 0 }
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
    const handleManageWallet = async (action, overrideEmail = null, overrideAmount = null) => {
        const finalEmail = overrideEmail || manageEmail;
        const finalAmount = overrideAmount || manageAmount;

        if (!finalEmail || !finalAmount || Number(finalAmount) <= 0) {
            alert("Please enter a valid email and amount.");
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
                    email: finalEmail,
                    amount: Number(finalAmount),
                    action,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                alert(json.message || "Failed to update wallet");
            } else {
                // If it's a quick action, we might not want alerts, but for now keep it simple
                // alert(json.message); 
                setManageEmail("");
                setManageAmount("");
                setQuickAmount("");
                setSelectedUserForWallet(null);
                fetchStats();
                fetchWallets();
                fetchHistory();
            }
        } catch (err) {
            console.error("Wallet update error", err);
            alert("Something went wrong.");
        } finally {
            setUpdating(false);
        }
    };

    /* ================= UPDATE STATUS ================= */
    const handleStatusUpdate = async (id, newStatus) => {
        if (!confirm(`Do you want to mark this transaction as ${newStatus}?`)) return;

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
            alert("Could not update status.");
        }
    };


    // Initial load
    useEffect(() => {
        fetchStats();
    }, []);

    // Fetch on history change
    useEffect(() => {
        if (activeTab === "history") {
            fetchHistory();
        }
    }, [historyPage, historySearch, historyType, historyStatus, activeTab]);

    // Fetch on wallet list change
    useEffect(() => {
        if (activeTab === "wallets") {
            fetchWallets();
        }
    }, [walletPage, walletSearch, activeTab]);

    return (
        <div className="space-y-4 sm:space-y-8 pb-10">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">Wallet Management</h2>
                    <p className="hidden sm:block text-sm text-[var(--muted)] mt-1">
                        View stats, add or remove money manually, and check history.
                    </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                    {/* TABS */}
                    <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)] flex-1 sm:flex-none">
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex-1 sm:px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab("wallets")}
                            className={`flex-1 sm:px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'wallets' ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                        >
                            Wallets
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            fetchStats();
                            if (activeTab === "history") fetchHistory();
                            else fetchWallets();
                        }}
                        disabled={loading || (activeTab === "history" ? historyLoading : walletLoading)}
                        className="p-2 sm:p-2.5 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] active:scale-95 transition-all outline-none disabled:opacity-50"
                    >
                        {loading || (activeTab === "history" ? historyLoading : walletLoading) ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : (
                            <FiRefreshCw size={14} />
                        )}
                    </button>
                </div>
            </div>

            {loading && !data.totalBalance && (!data.wallets || !data.wallets.length) ? (
                <div className="py-32 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
                    <p className="text-sm text-[var(--muted)] font-medium">Fetching wallet data...</p>
                </div>
            ) : (
                <>
                    {/* TOP LEVEL OVERVIEW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <PremiumInsightCard
                            label="Customer Pool"
                            value={`₹${(data.totalBalance || 0).toLocaleString()}`}
                            color="blue"
                            icon={<Wallet size={20} />}
                            description="Total combined balance of all users"
                        />
                        <PremiumInsightCard
                            label="Active Wallets"
                            value={data.activeWallets || 0}
                            color="amber"
                            icon={<Zap size={20} />}
                            description="Number of accounts with active balances"
                        />
                        <div className="hidden lg:block">
                            <PremiumInsightCard
                                label="Total Transactions"
                                value={data.pagination?.total || 0}
                                color="purple"
                                icon={<FiActivity size={20} />}
                                description="Total recorded wallet operations"
                            />
                        </div>
                    </div>

                    {/* SNAPSHOT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Deposits Volume Column */}
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <FiArrowUp size={12} className="text-emerald-500" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Money Added</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <InsightCard label="Today" value={`₹${(data.deposits?.day || 0).toLocaleString()}`} color="emerald" compact pulse={data.deposits?.day > 0} />
                                <InsightCard label="Week" value={`₹${(data.deposits?.week || 0).toLocaleString()}`} color="emerald" compact />
                                <InsightCard label="Month" value={`₹${(data.deposits?.month || 0).toLocaleString()}`} color="emerald" compact />
                            </div>
                        </div>

                        {/* Usage Snapshot Column */}
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <FiArrowDown size={12} className="text-purple-500" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Money Spent</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <InsightCard label="Today" value={`₹${(data.usage?.day || 0).toLocaleString()}`} color="purple" compact pulse={data.usage?.day > 0} />
                                <InsightCard label="Week" value={`₹${(data.usage?.week || 0).toLocaleString()}`} color="purple" compact />
                                <InsightCard label="Month" value={`₹${(data.usage?.month || 0).toLocaleString()}`} color="purple" compact />
                            </div>
                        </div>
                    </div>

                    {/* MANUAL WALLET ADJUSTMENT */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">Add or Remove Money Manually</h3>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[10px] sm:text-xs font-semibold text-[var(--muted)] ml-1 uppercase tracking-wider">User Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="email"
                                        value={manageEmail}
                                        onChange={(e) => setManageEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full h-10 sm:h-11 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] text-[var(--foreground)] text-sm focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-[var(--muted)]/40"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48 space-y-1.5">
                                <label className="text-[10px] sm:text-xs font-semibold text-[var(--muted)] ml-1 uppercase tracking-wider">Amount</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                                    <input
                                        type="number"
                                        value={manageAmount}
                                        onChange={(e) => setManageAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        className="w-full h-10 sm:h-11 pl-9 pr-4 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] text-[var(--foreground)] text-sm focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-[var(--muted)]/40"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto pt-1 sm:pt-0">
                                <button
                                    onClick={() => handleManageWallet("add")}
                                    disabled={updating}
                                    className="flex-1 md:flex-none h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-emerald-500/20 active:scale-95 transition-all outline-none disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14} /> : <FiPlus size={14} />}
                                    <span className="hidden xs:inline">Add Money</span>
                                    <span className="xs:hidden">Add</span>
                                </button>
                                <button
                                    onClick={() => handleManageWallet("remove")}
                                    disabled={updating}
                                    className="flex-1 md:flex-none h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition-all outline-none disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={14} /> : <FiMinus size={14} />}
                                    <span className="hidden xs:inline">Remove Money</span>
                                    <span className="xs:hidden">Deduct</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TRANSACTION HISTORY */}
                    {activeTab === "history" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                        Wallet Action History
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
                                                <option value="">All Actions</option>
                                                <option value="credit">Money Added</option>
                                                <option value="debit">Money Spent</option>
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
                                                                                alert("Verification failed.");
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
                                                                                alert("Verification API failed.");
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
                    )}

                    {/* USER WALLETS TABLE */}
                    {activeTab === "wallets" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                    Customer Wallet List
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

                            <div className="lg:hidden space-y-4">
                                {walletLoading ? (
                                    <div className="py-20 text-center text-[var(--muted)]">
                                        <Loader2 className="animate-spin mx-auto mb-3 text-[var(--accent)]" size={32} />
                                        <p className="font-medium">Curating your user list...</p>
                                    </div>
                                ) : (!data.wallets || !data.wallets.length) ? (
                                    <div className="py-20 text-center text-[var(--muted)]/40 flex flex-col items-center">
                                        <FiUser size={48} className="mb-4 opacity-10" />
                                        <p className="text-sm font-medium">No users found.</p>
                                    </div>
                                ) : (
                                    data.wallets.map((user, idx) => (
                                        <motion.div
                                            key={user._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group relative bg-gradient-to-br from-[var(--card)] to-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-2xl p-4 overflow-hidden transition-all hover:border-[var(--accent)]/30"
                                        >
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Avatar name={user.name} type={user.userType} size="md" />
                                                        {user.userType === 'owner' && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--card)] shadow-lg shadow-red-500/40" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h4 className="font-black text-[var(--foreground)] text-sm truncate tracking-tight">{user.name || "Unknown"}</h4>
                                                            {user.userType === 'owner' && (
                                                                <span className="px-1.5 py-0.5 rounded text-[7px] bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest">
                                                                    OWNER
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-[var(--muted)] font-medium opacity-60 truncate max-w-[140px] lowercase">{user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-1 opacity-40">Wallet</p>
                                                        <p className="text-xl font-black text-[var(--foreground)] tabular-nums tracking-tighter shadow-sm">
                                                            <span className="text-[10px] mr-0.5 text-[var(--accent)] font-bold">₹</span>
                                                            {user.wallet.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUserForWallet(user);
                                                            setQuickAmount("");
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white transition-all flex items-center justify-center shadow-lg shadow-transparent hover:shadow-[var(--accent)]/20 active:scale-95 border border-[var(--accent)]/10"
                                                    >
                                                        <FiDollarSign size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Glow effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </motion.div>
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
                                                            <div className="flex items-center justify-end gap-3">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-xs font-black text-[var(--foreground)] tabular-nums">
                                                                        ₹{user.wallet.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-tighter opacity-50">Current Balance</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedUserForWallet(user);
                                                                        setQuickAmount("");
                                                                    }}
                                                                    className="w-8 h-8 rounded-lg bg-[var(--accent)]/5 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white transition-all flex items-center justify-center shadow-lg shadow-transparent hover:shadow-[var(--accent)]/20 active:scale-95"
                                                                >
                                                                    <FiDollarSign size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination Wallets */}
                            <div className="flex items-center justify-between px-2 sm:px-0 pt-6 border-t border-[var(--border)]">
                                <span className="text-xs font-semibold text-[var(--muted)]">
                                    Displaying <span className="text-[var(--foreground)]">{data.wallets.length}</span> results
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest hidden sm:block">
                                        Page {data.pagination?.page || 1} / {data.pagination?.totalPages || 1}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={!data.pagination || data.pagination.page === 1}
                                            onClick={() => setWalletPage(p => Math.max(1, p - 1))}
                                            className="h-9 px-4 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.03] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-xs font-bold"
                                        >
                                            <FiChevronLeft size={16} />
                                            Prev
                                        </button>
                                        <button
                                            disabled={!data.pagination || data.pagination.page === data.pagination.totalPages}
                                            onClick={() => setWalletPage(p => Math.min(data.pagination?.totalPages || 1, p + 1))}
                                            className="h-9 px-4 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.03] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-xs font-bold"
                                        >
                                            Next
                                            <FiChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* QUICK MANAGE MODAL */}
            <AnimatePresence>
                {selectedUserForWallet && (
                    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUserForWallet(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-[var(--background)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                                            <Wallet size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--foreground)]">Quick Adjust</h3>
                                            <p className="text-xs text-[var(--muted)]">Manage user balance</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUserForWallet(null)}
                                        className="w-10 h-10 rounded-full bg-[var(--foreground)]/[0.05] text-[var(--muted)] flex items-center justify-center hover:text-[var(--foreground)] transition-all"
                                    >
                                        <FiXCircle size={20} />
                                    </button>
                                </div>

                                <div className="bg-[var(--foreground)]/[0.02] border border-[var(--border)] rounded-2xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={selectedUserForWallet.name} type={selectedUserForWallet.userType} />
                                        <div className="min-w-0">
                                            <p className="font-bold text-[var(--foreground)] text-sm truncate">{selectedUserForWallet.name}</p>
                                            <p className="text-[10px] text-[var(--muted)] font-mono">{selectedUserForWallet.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Current Wallet</span>
                                        <span className="font-black text-[var(--foreground)]">₹{selectedUserForWallet.wallet.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Adjustment Amount</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] font-bold">₹</span>
                                            <input
                                                autoFocus
                                                type="number"
                                                value={quickAmount}
                                                onChange={(e) => setQuickAmount(e.target.value)}
                                                placeholder="Enter amount..."
                                                className="w-full h-14 pl-8 pr-4 rounded-2xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-bold text-lg outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 transition-all text-center"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <button
                                            onClick={() => handleManageWallet("remove", selectedUserForWallet.email, quickAmount)}
                                            disabled={updating || !quickAmount}
                                            className="h-12 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 shadow-lg shadow-transparent hover:shadow-rose-500/20"
                                        >
                                            {updating ? <Loader2 className="animate-spin" size={16} /> : <FiMinus size={16} />}
                                            Deduct
                                        </button>
                                        <button
                                            onClick={() => handleManageWallet("add", selectedUserForWallet.email, quickAmount)}
                                            disabled={updating || !quickAmount}
                                            className="h-12 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 shadow-lg shadow-transparent hover:shadow-emerald-500/20"
                                        >
                                            {updating ? <Loader2 className="animate-spin" size={16} /> : <FiPlus size={16} />}
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 mt-4">
                                <p className="text-[9px] text-center text-[var(--muted)] leading-relaxed px-4 opacity-50">
                                    Changes will be recorded in transaction history and adjusted immediately.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Avatar({ name, type, size = "md" }) {
    const initials = name?.[0]?.toUpperCase() || "U";
    const isOwner = type === "owner";
    
    return (
        <div className={`
            ${size === "lg" ? "w-14 h-14 text-xl" : "w-11 h-11 text-base"} 
            rounded-2xl flex items-center justify-center font-black relative
            ${isOwner 
                ? "bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 text-white shadow-[0_8px_20px_-4px_rgba(244,63,94,0.4)]" 
                : "bg-gradient-to-br from-[var(--foreground)]/[0.05] to-[var(--foreground)]/[0.1] text-[var(--foreground)] border border-[var(--border)] shadow-inner"}
        `}>
            <span className="relative z-10">{initials}</span>
            {isOwner && (
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-[1px]" />
            )}
        </div>
    );
}

function PremiumInsightCard({ label, value, color, icon, description }) {
    const colors = {
        blue: "from-blue-500/20 to-indigo-500/5 text-blue-500 border-blue-500/20",
        amber: "from-amber-500/20 to-orange-500/5 text-amber-500 border-amber-500/20",
        purple: "from-purple-500/20 to-pink-500/5 text-purple-500 border-purple-500/20",
        emerald: "from-emerald-500/20 to-teal-500/5 text-emerald-500 border-emerald-500/20",
    };

    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className={`relative p-3.5 sm:p-4.5 rounded-[1.5rem] border bg-gradient-to-b ${colors[color]} bg-[var(--card)]/40 backdrop-blur-xl overflow-hidden group transition-all`}
        >
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-lg`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40 mb-0.5">{label}</p>
                        <p className="text-xl sm:text-2xl font-black tabular-nums tracking-tighter text-[var(--foreground)] leading-none">{value}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/5 text-[7px] font-black uppercase tracking-[0.1em] opacity-50 shrink-0">
                    <FiTrendingUp className="text-emerald-500" /> Live
                </div>
            </div>
            
            {description && (
                <div className="relative z-10 mt-3 pt-2 text-[9px] font-medium opacity-30 border-t border-white/5 truncate">
                    {description}
                </div>
            )}
            
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}

function InsightCard({ label, value, color, pulse, compact }) {
    const colors = {
        blue: "text-blue-500 bg-blue-500/5 border-blue-500/10",
        amber: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        purple: "text-purple-500 bg-purple-500/5 border-purple-500/10",
        emerald: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border ${colors[color]} flex flex-col items-center justify-center text-center relative overflow-hidden bg-[var(--card)]`}
        >
            {pulse && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-current animate-ping" />
            )}
            <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-tight opacity-60 mb-0.5">{label}</span>
            <span className="text-xs sm:text-sm font-black tabular-nums whitespace-nowrap">{value}</span>
        </motion.div>
    );
}
