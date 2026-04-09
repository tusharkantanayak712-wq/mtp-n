"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHome,
  FaWhatsapp,
  FaRegClipboard,
  FaArrowRight,
  FaHistory,
} from "react-icons/fa";

// --- Types ---
interface OrderData {
  orderId: string;
  gameSlug: string;
  itemName: string;
  price: number;
  playerId: string;
  status: string;
}

export default function TopupComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("Verifying payment...");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds timeout
  const [pollInterval, setPollInterval] = useState(3000); // 3 seconds

  // --- Initialization ---
  useEffect(() => {
    const storedOrderId = localStorage.getItem("pending_topup_order");
    if (storedOrderId) {
      setOrderId(storedOrderId);
    } else {
      setStatus("failed");
      setMessage("Order not found");
    }
  }, []);

  // --- Fetch Order Details ---
  const fetchOrderDetails = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/order/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: id, limit: 1 }),
      });
      const data = await res.json();
      if (data.success && data.orders?.length > 0) {
        setOrderData(data.orders[0]);
      }
    } catch (err) {
      console.error("Fetch order details error:", err);
    }
  }, []);

  // --- Verification Logic ---
  useEffect(() => {
    if (!orderId || status === "success" || status === "failed" && message !== "Order not found") return;

    let isMounted = true;
    const startTime = Date.now();

    // Check if wallet payment
    const urlParams = new URLSearchParams(window.location.search);
    const isWalletPayment = urlParams.get("wallet") === "true";
    if (isWalletPayment) {
      setMessage("Almost done...");
    }

    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/order/verify-topup-payment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        // Update message based on internal state
        if (data.topupStatus === "processing") {
          setMessage("Sending your top-up...");
        }

        return data;
      } catch (err) {
        console.error("Topup verification error:", err);
        return { success: false };
      }
    };

    const poll = async () => {
      if (!isMounted) return;

      const result = await verify();

      if (result.success) {
        if (isMounted) {
          setStatus("success");
          setMessage("Payment done!");
          localStorage.removeItem("pending_topup_order");
          fetchOrderDetails(orderId);
        }
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed < 90) {
        const remaining = Math.max(0, 90 - Math.floor(elapsed));
        setTimeLeft(remaining);
        setTimeout(poll, pollInterval);
      } else {
        if (isMounted) {
          setStatus("failed");
          setMessage("Taking too long...");
        }
      }
    };

    poll();

    return () => {
      isMounted = false;
    };
  }, [orderId, pollInterval, fetchOrderDetails]);

  // --- Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden px-4 py-8">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(var(--accent) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <div className="relative group">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

          <div className="relative border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* --- CHECKING STATE --- */}
              {status === "checking" && (
                <motion.div
                  key="checking"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="relative mb-6">
                    {/* Tactical Radar Effect */}
                    <div className="w-20 h-20 rounded-full border-2 border-[var(--accent)]/20 flex items-center justify-center relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-[var(--accent)]"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center"
                      >
                        <FaSpinner className="text-2xl animate-spin text-[var(--accent)]" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.h1 variants={itemVariants} className="text-xl font-black italic uppercase tracking-tight mb-2">
                    {message}
                  </motion.h1>
                  <motion.p variants={itemVariants} className="text-[var(--muted)] text-xs mb-6 px-4">
                   Don't close this page. We are checking your payment.
                  </motion.p>

                  <div className="w-full max-w-[280px]">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Checking...</span>
                      <span className="text-[10px] font-mono text-[var(--muted)]">{timeLeft}s left</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeLeft / 90) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- SUCCESS STATE --- */}
              {status === "success" && (
                <motion.div
                  key="success"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  {/* Success Header */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 mb-3"
                    >
                      <FaCheckCircle className="text-3xl text-white" />
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-2xl font-black italic uppercase tracking-tighter text-emerald-500 mb-1">
                      TOP-UP DONE!
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-[var(--muted)] text-xs">
                       Your order is complete. Diamonds have been sent!
                    </motion.p>
                  </div>

                  {/* Order Details Panel */}
                  <motion.div
                    variants={itemVariants}
                    className="w-full bg-[var(--muted)]/5 border border-[var(--border)] rounded-xl p-4 mb-6 space-y-3"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="text-[var(--muted)] font-medium uppercase tracking-wider">Your Order</span>
                       <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded font-mono">DONE</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-widest">Order ID</p>
                        <p className="text-xs font-mono truncate">{orderId || "---"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-widest">Item</p>
                        <p className="text-xs font-bold truncate">{orderData?.itemName || "Digital Product"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-widest">Player ID</p>
                        <p className="text-xs font-mono">{orderData?.playerId || "---"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-[var(--muted)] uppercase font-bold tracking-widest">You Paid</p>
                        <p className="text-xs font-black text-[var(--accent)]">₹{orderData?.price || "---"}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <div className="w-full space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => (window.location.href = "/dashboard")}
                      className="w-full group rounded-xl bg-[var(--accent)] py-3 font-black italic uppercase tracking-wide text-white hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/20"
                    >
                      <FaHistory className="text-sm" />
                       See My Orders
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <button
                      onClick={() => (window.location.href = "/")}
                      className="w-full rounded-xl border border-[var(--border)] py-3 font-bold text-[var(--muted)] text-sm hover:bg-[var(--muted)]/5 transition flex items-center justify-center gap-2"
                    >
                      <FaHome className="text-sm" />
                      Home
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --- FAILED / PENDING STATE --- */}
              {status === "failed" && (
                <motion.div
                  key="failed"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <motion.div
                      variants={itemVariants}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-3"
                    >
                      <FaExclamationTriangle className="text-3xl text-yellow-500" />
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-xl font-black italic uppercase tracking-tighter text-yellow-500 mb-1">
                      {message === "Order not found" ? "ORDER NOT FOUND" : "STILL CHECKING..."}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-[var(--muted)] text-xs max-w-[280px]">
                      {message === "Order not found"
                        ? "We could not find this order. Please contact support."
                        : "This is taking longer than usual. Don't worry, your money is safe."}
                    </motion.p>
                  </div>

                  {/* Support Notice Box */}
                  <motion.div
                    variants={itemVariants}
                    className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-start gap-3 text-[11px]">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-yellow-500">i</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[var(--foreground)] leading-relaxed">
                           Your top-up will be done within <strong className="text-yellow-500">10–15 mins</strong>. If not, we will refund the money to your wallet.
                        </p>
                        <p className="text-[var(--muted)] font-mono text-[9px]">
                          REF: {orderId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <div className="w-full space-y-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={`https://wa.me/919178521537?text=Hi, my order ${orderId} is pending. Please check.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#25D366] py-3 font-black italic uppercase tracking-wide text-white flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                    >
                      <FaWhatsapp className="text-lg" />
                       Chat on WhatsApp
                    </motion.a>

                    <button
                      onClick={() => (window.location.href = "/")}
                      className="w-full rounded-xl border border-[var(--border)] py-3 font-bold text-[var(--muted)] text-sm hover:bg-[var(--muted)]/5 transition flex items-center justify-center gap-2"
                    >
                      <FaHome className="text-sm" />
                      Home
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            <div className="flex items-center gap-1.5 focus:outline-none cursor-pointer hover:text-[var(--accent)] transition-colors"
              onClick={() => {
                if (orderId) navigator.clipboard.writeText(orderId);
              }}>
              <FaRegClipboard className="text-xs" />
               Copy Order ID
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Safe & Secure
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
