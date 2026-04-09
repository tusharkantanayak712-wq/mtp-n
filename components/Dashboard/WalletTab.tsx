"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlusCircle,
  FiCreditCard,
  FiSmartphone,
  FiLoader,
  FiDollarSign,
  FiZap,
  FiCopy,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";

interface WalletTabProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  userReferral?: {
    userId: string;
    userType?: string;
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
  // Determine default method: 'member' role uses USDT by default, others use UPI
  const isMemberOnly = userReferral?.userType === "member";
  const isAdminOrOwner = userReferral?.userType === "admin" || userReferral?.userType === "owner";

  const [method, setMethod] = useState(isMemberOnly ? "usdt" : "upi");
  const [loading, setLoading] = useState(false);

  // USDT flow state
  const [usdtStep, setUsdtStep] = useState<"idle" | "amount" | "deposit" | "submitted" | "confirmed">("idle");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [usdtNetwork, setUsdtNetwork] = useState<"BEP20">("BEP20");
  const [usdtDeposit, setUsdtDeposit] = useState<any>(null);
  const [txHash, setTxHash] = useState("");
  const [usdtLoading, setUsdtLoading] = useState(false);
  const [usdtError, setUsdtError] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const presetAmounts = [50, 100, 250, 500];
  const usdtPresets = [1, 5, 10, 50];
  const USDT_RATE = 98; // 1 USDT = 98 coins
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (usdtStep === "deposit" && usdtDeposit?.expiresAt) {
      timer = setInterval(() => {
        const expiry = new Date(usdtDeposit.expiresAt).getTime();
        const now = new Date().getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("EXPIRED");
          setUsdtError("This deposit has expired. Please start a new one.");
          return;
        }

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [usdtStep, usdtDeposit]);

  const fetchStatus = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/wallet/usdt/status?depositId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsdtDeposit(data.deposit);
        if (data.deposit.status === "confirmed") {
          setUsdtStep("confirmed");
          setWalletBalance(walletBalance); // Trigger some refresh
        }
        else if (data.deposit.status === "submitted") {
          setUsdtStep("submitted");
          startPolling(id);
        }
        else if (data.deposit.status === "waiting") {
           setUsdtStep("deposit");
           setMethod("usdt");
        }
      }
    } catch (err) {
      console.error("Fetch status failed:", err);
    }
  };

  const handleResumeUsdt = (txn: any) => {
    if (txn.status === "waiting") {
      setUsdtDeposit({
        depositId: txn.transactionId,
        usdtAmount: (txn.description.match(/([\d.]+) USDT/)?.[1]) || 0,
        coinsToCredit: txn.amount,
        network: (txn.description.match(/via (\w+)/)?.[1]) || "BEP20",
        depositAddress: "",
        expiresAt: txn.createdAt, // Placeholder until fetchStatus
      });
      fetchStatus(txn.transactionId);
    }
  };

  // Auto-resume active deposit on mount if user is on USDT tab
  useEffect(() => {
    const checkActive = async () => {
       const token = localStorage.getItem("token");
       if (!token) return;
       try {
         const res = await fetch("/api/wallet/history?filter=usdt&page=1&limit=5", {
           headers: { Authorization: `Bearer ${token}` }
         });
         const data = await res.json();
         if (data.success && data.data?.[0]?.status === "waiting") {
            handleResumeUsdt(data.data[0]);
         }
       } catch (err) { console.error("Auto-resume check failed", err); }
    };
    checkActive();
  }, []);

  // ============ UPI PROCEED ============
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again to continue");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/wallet/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.success) { alert(data.message); return; }
    localStorage.setItem("pending_order", data.orderId);
    window.location.href = data.paymentUrl;
  };

  // ============ USDT FLOW ============
  const handleUsdtInitiate = async () => {
    const num = parseFloat(usdtAmount);
    if (!usdtAmount || isNaN(num) || num < 1) {
      setUsdtError("Minimum deposit is 1 USDT");
      return;
    }
    if (num > 10000000) {
      setUsdtError("Deposit amount is too high.");
      return;
    }
    setUsdtLoading(true);
    setUsdtError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/wallet/usdt/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ usdtAmount: num, network: usdtNetwork }),
      });
      const data = await res.json();
      if (!data.success) {
        setUsdtError(data.message || "Could not start deposit. Try again.");
        return;
      }
      setUsdtDeposit(data);
      setUsdtStep("deposit");
    } catch {
      setUsdtError("Network error. Please try again.");
    } finally {
      setUsdtLoading(false);
    }
  };

  const handleUsdtSubmitHash = async () => {
    if (!txHash.trim() || txHash.trim().length < 40) {
      setUsdtError("Please enter a valid transaction hash");
      return;
    }
    setUsdtLoading(true);
    setUsdtError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/wallet/usdt/submit-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ depositId: usdtDeposit.depositId, txHash: txHash.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setUsdtError(data.message || "Could not submit your hash. Try again.");
        return;
      }
      setUsdtStep("submitted");
      startPolling(usdtDeposit.depositId);
    } catch {
      setUsdtError("Network error. Please try again.");
    } finally {
      setUsdtLoading(false);
    }
  };

  const startPolling = (id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/wallet/usdt/status?depositId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.deposit?.status === "confirmed") {
          clearInterval(pollRef.current!);
          setUsdtStep("confirmed");
          window.dispatchEvent(new Event("walletUpdated"));
        }
      } catch { /* silent */ }
    }, 15000); // poll every 15 seconds
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const copyToClipboard = (text: string, type: "address" | "hash") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "address") { setCopiedAddress(true); setTimeout(() => setCopiedAddress(false), 2000); }
      else { setCopiedHash(true); setTimeout(() => setCopiedHash(false), 2000); }
    });
  };

  const resetUsdtFlow = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setUsdtStep("idle");
    setUsdtAmount("");
    setUsdtDeposit(null);
    setTxHash("");
    setUsdtError("");
    setMethod(isMemberOnly ? "usdt" : "upi");
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
          <AnimatePresence mode="wait">
            {/* ─── INR Input (UPI / no method selected) ─── */}
            {method !== "usdt" && (
              <motion.div
                key="inr-input"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
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
                      if (e.key === '.' || e.key === ',') e.preventDefault();
                    }}
                    onChange={(e) => {
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
                      onClick={() => { setAmount(String(v)); setAmountError(""); }}
                      className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)] transition-all"
                    >
                      ₹{v}
                    </button>
                  ))}
                </div>

                {/* Add Funds button */}
                <button
                  onClick={handleProceed}
                  disabled={loading}
                  className="w-full mt-2 p-4 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-[0.2em] italic text-xs shadow-[0_20px_40px_-10px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <FiLoader className="animate-spin" size={18} /> : "Add Funds"}
                </button>
              </motion.div>
            )}

            {/* ─── USDT Input (Crypto selected) ─── */}
            {method === "usdt" && (
              <motion.div
                key="usdt-input"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
                  <FiDollarSign className="text-green-400" /> Enter USDT Amount
                </label>

                {/* Network Select (Only BEP20) */}
                <div className="flex gap-2">
                  <div className="flex-1 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500 bg-green-500/10 text-green-400 text-center">
                    Network: BEP20 (Recommended)
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={usdtAmount}
                    placeholder="0.00"
                    step="1"
                    min="1"
                    max="10000000"
                    onChange={(e) => { setUsdtAmount(e.target.value); setUsdtError(""); }}
                    className="w-full p-4 rounded-2xl border border-green-500/20 bg-[var(--card)] focus:border-green-500/60 text-2xl font-black italic tracking-tight text-[var(--foreground)] placeholder:text-[var(--muted)]/30 outline-none transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-400 uppercase tracking-widest">USDT</div>
                </div>

                {/* Live preview */}
                {usdtAmount && parseFloat(usdtAmount) > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">You receive:</span>
                    <span className="text-base font-black text-green-400">{Math.floor(parseFloat(usdtAmount) * USDT_RATE)} Coins</span>
                  </div>
                )}

                {usdtError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                    <FiAlertCircle size={10} /> {usdtError}
                  </motion.p>
                )}

                <div className="flex gap-2 flex-wrap">
                  {usdtPresets.map((v) => (
                    <button key={v} onClick={() => { setUsdtAmount(String(v)); setUsdtError(""); }}
                      className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-green-500/20 bg-[var(--card)] text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all">
                      {v} USDT
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleUsdtInitiate}
                  disabled={usdtLoading}
                  className="w-full p-4 rounded-2xl bg-green-500 text-black font-black uppercase tracking-[0.2em] italic text-xs hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {usdtLoading ? <FiLoader className="animate-spin" size={18} /> : "Show Me the Address →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2 mb-4">
              <FiCreditCard className="text-[var(--accent)]" /> Payment Method
            </label>

            <div className="grid gap-3">
              {/* UPI (Hidden for 'member' type, visible for everyone else) */}
              {!isMemberOnly && (
                <button
                  onClick={() => { setMethod("upi"); resetUsdtFlow(); setUsdtStep("idle"); }}
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
              )}

              {/* USDT (Available to Everyone) */}
              <button
                onClick={() => { setMethod("usdt"); setUsdtStep("amount"); }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                  ${method === "usdt"
                    ? "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    : "border-[var(--border)] bg-[var(--card)] hover:bg-green-500/5 hover:border-green-500/30"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${method === 'usdt' ? 'bg-green-500 text-black' : 'bg-green-500/10 text-green-500'}`}>
                    <FiDollarSign size={18} />
                  </div>
                  <div className="text-left">
                    <span className={`text-[11px] font-black uppercase tracking-widest italic leading-none ${method === 'usdt' ? 'text-green-400' : 'text-[var(--foreground)]'}`}>
                      Crypto / USDT
                    </span>
                    <p className="text-[9px] font-bold text-green-500/70 uppercase tracking-wider mt-1">1 USDT = 98 Coins • BEP20 Only</p>
                  </div>
                </div>
                {method === "usdt" && (
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-lg">Selected</span>
                )}
              </button>
            </div>
          </div>

          {/* PENDING NOTICE */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
            <div className="p-1 rounded-full bg-amber-500/20 text-amber-500 mt-0.5">
              <FiLoader size={12} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Important Note</p>
              <p className="text-[10px] font-medium text-[var(--muted)] leading-relaxed">
                Pending orders are usually fixed within <strong>30 minutes</strong>.
                If your payment is still pending after that, please <a href="/support" className="text-[var(--accent)] underline hover:text-[var(--foreground)] transition-colors">contact support</a> and share your order ID.
              </p>
            </div>
          </div>
        </div>


        {/* USDT FLOW PANEL */}
        <AnimatePresence>
          {method === "usdt" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="col-span-full rounded-3xl border border-green-500/20 bg-green-500/5 p-6 space-y-5"
            >

              {/* STEP: Show Deposit Address */}
              {usdtStep === "deposit" && usdtDeposit && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUsdtStep("amount")} className="p-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                      <FiArrowLeft size={14} />
                    </button>
                    <span className="text-[11px] font-black uppercase tracking-widest text-green-400">Send USDT to this address</span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 ml-2">
                       <FiClock size={12} className="animate-spin-slow" />
                       <span className="text-[10px] font-black tracking-widest tabular-nums">{timeLeft}</span>
                    </div>
                    <span className="ml-auto text-[9px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">{usdtDeposit.network}</span>
                  </div>

                  {/* Summary Box */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <p className="text-[8px] text-[var(--muted)] uppercase tracking-wider mb-1">Send</p>
                      <p className="text-sm font-black text-green-400">{usdtDeposit.usdtAmount} USDT</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <p className="text-[8px] text-[var(--muted)] uppercase tracking-wider mb-1">Rate</p>
                      <p className="text-sm font-black text-[var(--foreground)]">×{USDT_RATE}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[var(--card)] border border-green-500/20 bg-green-500/5">
                      <p className="text-[8px] text-[var(--muted)] uppercase tracking-wider mb-1">Receive</p>
                      <p className="text-sm font-black text-green-400">{usdtDeposit.coinsToCredit} Coins</p>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Deposit Address ({usdtDeposit.network})</p>
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--card)] border border-green-500/20">
                      <span className="font-mono text-[10px] text-green-400 break-all flex-1">{usdtDeposit.depositAddress}</span>
                      <button
                        onClick={() => copyToClipboard(usdtDeposit.depositAddress, "address")}
                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/30 transition-colors flex-shrink-0"
                      >
                        {copiedAddress ? <FiCheckCircle size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-2 items-start">
                    <FiAlertCircle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[9px] text-amber-300 leading-relaxed">
                      Send <strong>exactly {usdtDeposit.usdtAmount} USDT</strong> on <strong>{usdtDeposit.network}</strong> only. If you use the wrong network, funds can be lost. After you send, paste your TX hash below.
                    </p>
                  </div>

                  {/* TX Hash Input */}
                  <div>
                    <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Paste Your Transaction Hash (after sending)</p>
                    <input
                      type="text"
                      value={txHash}
                      placeholder="Paste your TX hash here..."
                      onChange={(e) => { setTxHash(e.target.value); setUsdtError(""); }}
                      className="w-full p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] focus:border-green-500/50 text-[11px] font-mono text-[var(--foreground)] placeholder:text-[var(--muted)]/30 outline-none transition-all"
                    />
                  </div>

                  {usdtError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                      <FiAlertCircle size={10} /> {usdtError}
                    </motion.p>
                  )}

                  <button
                    onClick={handleUsdtSubmitHash}
                    disabled={usdtLoading || !txHash.trim()}
                    className="w-full p-4 rounded-2xl bg-green-500 text-black font-black uppercase tracking-[0.2em] italic text-xs hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {usdtLoading ? <FiLoader className="animate-spin" size={18} /> : "I've Sent — Confirm"}
                  </button>
                </div>
              )}

              {/* STEP: Submitted — Pending Verification */}
              {usdtStep === "submitted" && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <FiClock size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-black text-[var(--foreground)] text-sm">Checking Your Payment...</p>
                    <p className="text-[10px] text-[var(--muted)] mt-1">We got your TX hash. We're checking it now and will add <strong className="text-green-400">{usdtDeposit?.coinsToCredit} coins</strong> to your wallet automatically.</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[9px] text-[var(--muted)]">
                    <FiRefreshCw size={10} className="animate-spin" />
                    Checking every 15 seconds...
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left">
                    <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">Deposit ID</p>
                    <p className="font-mono text-[10px] text-[var(--foreground)] break-all">{usdtDeposit?.depositId}</p>
                  </div>
                  <button onClick={resetUsdtFlow} className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest hover:text-[var(--foreground)] transition-colors underline underline-offset-2">
                    New Deposit
                  </button>
                </div>
              )}

              {/* STEP: Confirmed */}
              {usdtStep === "confirmed" && (
                <div className="space-y-4 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
                    <FiCheckCircle size={24} className="text-green-400" />
                  </motion.div>
                  <div>
                    <p className="font-black text-green-400 text-sm">Deposit Confirmed! 🎉</p>
                    <p className="text-[10px] text-[var(--muted)] mt-1"><strong className="text-green-400">{usdtDeposit?.coinsToCredit} coins</strong> have been credited to your wallet.</p>
                  </div>
                  <button
                    onClick={resetUsdtFlow}
                    className="w-full p-4 rounded-2xl bg-green-500 text-black font-black uppercase tracking-[0.2em] italic text-xs hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* TRANSACTION HISTORY SECTION */}
      <TransactionHistorySection onResumeUsdt={handleResumeUsdt} />
    </div >
  );
}

function TransactionHistorySection({ onResumeUsdt }: { onResumeUsdt: (txn: any) => void }) {
  const [showHistory, setShowHistory] = useState(true);
  const [filter, setFilter] = useState("all"); // all, inr, usdt

  return (
    <div className="pt-8 border-t border-[var(--border)]/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          Transaction History
        </h3>
        
        <div className="flex items-center gap-2">
          {showHistory && (
            <div className="flex items-center gap-1 bg-[var(--card)] border border-[var(--border)] p-1 rounded-xl mr-2">
              {["all", "inr", "usdt"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    filter === f 
                      ? "bg-[var(--accent)] text-black" 
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            {showHistory && <TransactionHistoryRefresh />}
            <button
              onClick={() => setShowHistory((v) => !v)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                showHistory
                  ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]"
                  : "bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/30"
              }`}
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TransactionHistoryWrapper filter={filter} onResumeUsdt={onResumeUsdt} />
        </motion.div>
      )}
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

function TransactionHistoryWrapper({ filter, onResumeUsdt }: { filter: string, onResumeUsdt?: (txn: any) => void }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setKey(k => k + 1);
    window.addEventListener("refreshTransactionHistory", handleRefresh);
    return () => window.removeEventListener("refreshTransactionHistory", handleRefresh);
  }, []);

  return <TransactionHistory key={`${key}-${filter}`} filter={filter} onResumeUsdt={onResumeUsdt} />;
}

function TransactionHistory({ filter, onResumeUsdt }: { filter: string, onResumeUsdt?: (txn: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/wallet/history?page=${page}&limit=5&filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
        }

        // AUTO-VERIFY PENDING TRANSACTIONS
        // If we find any 'pending' transaction in the list, let's proactively check it
        const pendingTxns = json.data.filter((t: any) => t.status === 'pending');
        if (pendingTxns.length > 0) {
          checkPendingStatuses(pendingTxns);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingStatuses = async (txns: any[]) => {
    const token = localStorage.getItem("token");
    let updated = false;

    // Check each pending txn (limit to first 3 to avoid spamming)
    const toCheck = txns.slice(0, 3);
    for (let i = 0; i < toCheck.length; i++) {
      const txn = toCheck[i];
      if (!txn.referenceId) continue;
      try {
        // We reuse the existing check-status API usually meant for payment-complete page
        // This API calls gateway and updates DB if success
        const res = await fetch("/api/wallet/check-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ orderId: txn.referenceId })
        });
        const data = await res.json();
        if (data.success) updated = true;
      } catch (e) {
        console.error("Auto-check failed for", txn._id);
      }
    }

    if (updated) {
      // If any status changed to success effectively, reload history to show green
      // prevent infinite loop by not calling fetchHistory directly here if possible, 
      // but since we updated state, a re-fetch is needed.
      // Let's just create a new fetch to update UI
      const res = await fetch(`/api/wallet/history?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setHistory(json.data);

      // Also update wallet balance
      window.dispatchEvent(new Event("walletUpdated"));
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
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden sm:block rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--foreground)]/[0.03] text-[var(--muted)] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              {history.map((txn) => (
                <tr key={txn._id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[9px] text-[var(--muted)] block">
                      {txn.transactionId
                        ? txn.transactionId.slice(0, 14) + "…"
                        : txn._id?.slice(0, 10) + "…"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      txn.type === 'credit'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {txn.type}
                    </span>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5 max-w-[120px] truncate">
                      {txn.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">
                    <span className={txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-[var(--muted)]">
                    {txn.balanceAfter !== undefined ? `₹${txn.balanceAfter}` : "---"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      txn.status === 'success' ? 'text-green-500'
                      : txn.status === 'failed' ? 'text-red-500'
                      : txn.status === 'refund' || txn.status === 'refunded' ? 'text-blue-500'
                      : txn.status === 'waiting' ? 'text-amber-500'
                      : 'text-yellow-500'
                    }`}>
                      {txn.status}
                    </span>
                    {txn.status === 'waiting' && onResumeUsdt && (
                      <button 
                        onClick={() => onResumeUsdt(txn)}
                        className="block mt-2 ml-auto text-[8px] font-black uppercase tracking-[0.2em] bg-green-500 text-black px-2 py-1 rounded-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        Submit Hash
                      </button>
                    )}
                    <p className="text-[8px] opacity-50 block mt-1">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="sm:hidden space-y-3">
        {history.map((txn) => (
          <div key={txn._id} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-tighter">
                  ID: {txn.transactionId || txn._id?.slice(0, 10)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                    txn.type === 'credit' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {txn.type}
                  </span>
                  <p className="text-[11px] font-bold text-[var(--foreground)]">{txn.description}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest italic ${
                txn.status === 'success' ? 'text-green-500'
                : txn.status === 'failed' ? 'text-red-500'
                : txn.status === 'waiting' ? 'text-amber-500'
                : 'text-yellow-500'
              }`}>
                {txn.status}
                {txn.status === 'waiting' && onResumeUsdt && (
                  <button 
                    onClick={() => onResumeUsdt(txn)}
                    className="block mt-1 text-[8px] font-black uppercase tracking-[0.2em] bg-green-500 text-black px-2 py-1 rounded-lg"
                  >
                    Submit Hash
                  </button>
                )}
              </span>
            </div>
            <div className="flex items-end justify-between border-t border-[var(--border)]/10 pt-3">
              <div className="text-[10px] text-[var(--muted)]">
                {new Date(txn.createdAt).toLocaleDateString()} • {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {txn.balanceAfter !== undefined && (
                  <p className="mt-1 font-mono">After: ₹{txn.balanceAfter}</p>
                )}
              </div>
              <div className={`text-sm font-black italic ${txn.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
              </div>
            </div>
          </div>
        ))}
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
