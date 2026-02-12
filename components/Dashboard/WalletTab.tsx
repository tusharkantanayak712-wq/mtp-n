"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlusCircle,
  FiCreditCard,
  FiSmartphone,
  FiLoader,
  FiDollarSign,
  FiZap,
} from "react-icons/fi";

interface WalletTabProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  userReferral?: {
    userId: string;
    referralUsed: boolean;
    referralCount: number;
  };
}

export default function WalletTab({
  walletBalance,
  setWalletBalance,
  userReferral,
}: WalletTabProps) {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [50, 100, 250, 500];

  const handleProceed = async () => {
    const numAmount = Number(amount);

    if (!amount || numAmount < 15) {
      setAmountError("Minimum amount is ₹15");
      return;
    }

    if (numAmount > 5000) {
      setAmountError("Maximum amount is ₹5,000");
      return;
    }

    if (!Number.isInteger(numAmount)) {
      setAmountError("Amount must be a whole number");
      return;
    }

    if (!method) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in again to continue");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Number(amount),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.message);
      return;
    }

    localStorage.setItem("pending_order", data.orderId);
    window.location.href = data.paymentUrl;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* TACTICAL BALANCE MODULE */}
      <div className="relative group overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)]/30 to-transparent blur-3xl opacity-20 pointer-events-none" />
        <div className="relative p-6 sm:p-8 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] flex items-center justify-between overflow-hidden shadow-sm">
          <div className="absolute right-[-20px] top-[-20px] text-[var(--accent)]/5 rotate-12">
            <FiZap size={140} />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2 italic">
              Wallet Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                ₹{walletBalance}
              </span>
              <span className="text-[10px] font-bold text-[var(--muted)]/60 uppercase tracking-widest leading-none">
                Available
              </span>
            </div>
          </div>

          <div className="relative z-10 w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20 shadow-[0_0_20px_var(--accent)]/10">
            <FiDollarSign size={24} />
          </div>
        </div>
      </div>

      {/* ACQUISITION INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
              <FiPlusCircle className="text-[var(--accent)]" /> Enter Amount
            </label>

            <div className="relative">
              <input
                type="number"
                value={amount}
                placeholder="0.00"
                step="1"
                min="15"
                max="5000"
                onKeyDown={(e) => {
                  // Prevent decimal point and comma
                  if (e.key === '.' || e.key === ',') {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  // Only allow whole numbers
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setAmount(value);
                    setAmountError("");
                  }
                }}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] focus:bg-[var(--foreground)]/[0.02] focus:border-[var(--accent)]/40 text-2xl font-black italic tracking-tight text-[var(--foreground)] placeholder:text-[var(--muted)]/30 outline-none transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--muted)] uppercase tracking-widest">
                INR
              </div>
            </div>

            {amountError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-widest">
                {amountError}
              </motion.p>
            )}

            <div className="flex gap-2 mt-4 flex-wrap">
              {presetAmounts.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setAmount(String(v));
                    setAmountError("");
                  }}
                  className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all"
                >
                  ₹{v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
              <FiCreditCard className="text-[var(--accent)]" /> Payment Method
            </label>

            <div className="grid gap-3">
              <button
                onClick={() => setMethod("upi")}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                  ${method === "upi"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--foreground)]/[0.02]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${method === 'upi' ? 'bg-[var(--accent)] text-black' : 'bg-[var(--foreground)]/[0.05] text-[var(--muted)]'}`}>
                    <FiSmartphone size={18} />
                  </div>
                  <div className="text-left">
                    <span className={`text-[11px] font-black uppercase tracking-widest italic leading-none ${method === 'upi' ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                      UPI / Netbanking
                    </span>
                    <p className="text-[9px] font-medium text-[var(--muted)]/60 uppercase tracking-wider mt-1">Instant Add</p>
                  </div>
                </div>
              </button>

              <div className="flex flex-col gap-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500">
                    <FiDollarSign size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest italic text-[var(--foreground)] block">
                      Crypto / USDT
                    </span>
                    <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      1 USD = 97 Coins
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-medium text-[var(--muted)] mt-2 pl-1">
                  Contact customer service for adding via crypto.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-[0.2em] italic text-xs shadow-[0_20px_40px_-10px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
          >
            {loading ? <FiLoader className="animate-spin" size={18} /> : "Add Funds"}
          </button>
        </div>
      </div>

      {/* TRANSACTION HISTORY SECTION */}
      <div className="pt-8 border-t border-[var(--border)]/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Transaction History
          </h3>
          <TransactionHistoryRefresh />
        </div>

        <TransactionHistoryWrapper />
      </div>
    </div>
  );
}

function TransactionHistoryRefresh() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("refreshTransactionHistory"))}
      className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.05] transition-all"
      title="Refresh History"
    >
      <FiLoader size={14} className="hover:animate-spin" />
    </button>
  );
}

function TransactionHistoryWrapper() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setKey(k => k + 1);
    window.addEventListener("refreshTransactionHistory", handleRefresh);
    return () => window.removeEventListener("refreshTransactionHistory", handleRefresh);
  }, []);

  return <TransactionHistory key={key} />;
}

function TransactionHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/wallet/history?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  if (loading && history.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <FiLoader className="animate-spin text-[var(--accent)]" size={24} />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--muted)] text-sm">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--foreground)]/[0.03] text-[var(--muted)] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              {history.map((txn) => (
                <tr key={txn._id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${txn.type === 'credit'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                      {txn.type}
                    </span>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5 max-w-[150px] truncate">
                      {txn.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">
                    <span className={txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[var(--muted)]">
                    {new Date(txn.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${txn.status === 'success' ? 'text-green-500' : txn.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Pagination */}
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
  );
}
