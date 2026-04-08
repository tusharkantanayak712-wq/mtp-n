"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Clock, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed | delayed
  const [message, setMessage] = useState("Checking payment...");

  useEffect(() => {
    const orderId = localStorage.getItem("pending_order");

    if (!orderId) {
      setStatus("failed");
      setMessage("Order not found");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // 30 seconds (3s interval)

    async function checkPayment() {
      if (attempts >= maxAttempts) {
        setStatus("delayed");
        setMessage("Verification pending");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/wallet/check-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (data?.success) {
          setStatus("success");
          setMessage("Payment successful");

          const oldBal = Number(localStorage.getItem("walletBalance") || "0");
          const newBal = oldBal + Number(data.amount || 0);
          localStorage.setItem("walletBalance", String(newBal));

          window.dispatchEvent(new Event("walletUpdated"));
          localStorage.removeItem("pending_order");
        } else {
          // Retry
          attempts++;
          setTimeout(checkPayment, 3000);
        }
      } catch (err) {
        console.error("Payment check error:", err);
        attempts++;
        setTimeout(checkPayment, 3000);
      }
    }

    checkPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Header Status Bar */}
          <div className={`h-1.5 w-full ${status === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
            status === 'failed' ? 'bg-gradient-to-r from-red-500 to-rose-400' :
              status === 'delayed' ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                'bg-[var(--accent)] animate-pulse'
            }`} />

          <div className="p-10 text-center">

            {/* ICON ANIMATION AREA */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {status === "checking" && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--accent)]/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="w-20 h-20 text-[var(--accent)] animate-spin relative z-10" />
                  </div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 drop-shadow-lg" />
                  </motion.div>
                )}

                {status === "failed" && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20"
                  >
                    <XCircle className="w-12 h-12 text-red-500 drop-shadow-lg" />
                  </motion.div>
                )}

                {status === "delayed" && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 relative"
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-dashed animate-[spin_10s_linear_infinite]" />
                    <Clock className="w-12 h-12 text-amber-500 drop-shadow-lg relative z-10" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* STATUS MESSAGE */}
            <h1 className="text-3xl font-black uppercase tracking-tight mb-3 text-[var(--foreground)]">
              {message}
            </h1>

            {/* DESCRIPTION */}
            <div className="text-[var(--muted)] text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-8">
              {status === "checking" && (
                <p className="animate-pulse">Checking payment gateway...</p>
              )}

              {status === "success" && (
                <p>Money has been added to your wallet. You can continue now.</p>
              )}

              {status === "delayed" && (
                <div className="space-y-2">
                  <p className="font-medium text-amber-500/90">Payment sent for admin approval.</p>
                  <p className="text-xs text-[var(--muted)]">
                    Don't worry. Your payment is safe. We will check and add it to your wallet soon.
                    No further action is needed.
                  </p>
                </div>
              )}

              {status === "failed" && (
                <p>We could not verify payment right now. If money was deducted, it will be refunded or added within 24 hours.</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              <Link href="/" className="block w-full">
                <button className="group w-full py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <span>Return Home</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              {(status === "delayed" || status === "failed") && (
                <Link href="/support" className="block w-full">
                  <button className="w-full py-4 rounded-xl border border-[var(--border)] text-[var(--muted)] font-bold text-sm uppercase tracking-wider hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/[0.03] transition-all flex items-center justify-center gap-2">
                    <HelpCircle size={16} />
                    <span>Contact Support</span>
                  </button>
                </Link>
              )}
            </div>

          </div>

          {/* Footer Security Badge */}
          <div className="bg-[var(--foreground)]/[0.02] border-t border-[var(--border)] p-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold text-[var(--muted)]/60 tracking-widest">
            <ShieldCheck size={12} />
            <span>Secure 256-bit payment</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
