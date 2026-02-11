"use client";

import { useState } from "react";
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
}

export default function WalletTab({
  walletBalance,
  setWalletBalance,
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
        <div className="relative p-6 sm:p-8 rounded-[2.5rem] bg-black/40 border border-white/5 flex items-center justify-between overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] text-[var(--accent)]/5 rotate-12">
            <FiZap size={140} />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2 italic">
              Wallet Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
                ₹{walletBalance}
              </span>
              <span className="text-[10px] font-bold text-[var(--muted)]/40 uppercase tracking-widest leading-none">
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
                className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-[var(--accent)]/40 text-2xl font-black italic tracking-tight placeholder:text-white/5 outline-none transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--muted)]/40 uppercase tracking-widest">
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
                  className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 bg-white/5 hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all"
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
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${method === 'upi' ? 'bg-[var(--accent)] text-black' : 'bg-white/5 text-[var(--muted)]'}`}>
                    <FiSmartphone size={18} />
                  </div>
                  <div className="text-left">
                    <span className={`text-[11px] font-black uppercase tracking-widest italic leading-none ${method === 'upi' ? 'text-[var(--accent)]' : 'text-white'}`}>
                      UPI / Netbanking
                    </span>
                    <p className="text-[9px] font-medium text-[var(--muted)]/40 uppercase tracking-wider mt-1">Instant Add</p>
                  </div>
                </div>
              </button>

              <div className="flex flex-col gap-2 p-4 rounded-2xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500">
                    <FiDollarSign size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest italic text-white block">
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
    </div>
  );
}
