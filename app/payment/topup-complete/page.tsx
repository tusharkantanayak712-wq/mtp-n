"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHome,
  FaWhatsapp,
} from "react-icons/fa";

export default function TopupComplete() {
  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const orderId = sessionStorage.getItem("pending_topup_order");
    const startTime = Date.now();
    let isMounted = true;

    if (!orderId) {
      setStatus("failed");
      setMessage("Order not found");
      return;
    }

    const verify = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await fetch("/api/order/verify-topup-payment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        return data?.success;
      } catch (err) {
        console.error("Topup verification error:", err);
        return false;
      }
    };

    const poll = async () => {
      if (!isMounted) return;

      const success = await verify();

      if (success) {
        if (isMounted) {
          setStatus("success");
          setMessage("Payment successful!");
          sessionStorage.removeItem("pending_topup_order");
        }
        return;
      }

      // If not success, check if we've exceeded the 90-second timeout
      if (Date.now() - startTime < 90000) {
        // Continue polling every 3 seconds
        setTimeout(poll, 3000);
      } else {
        // Timeout reached
        if (isMounted) {
          setStatus("failed");
          setMessage("Payment verification pending");
        }
      }
    };

    poll();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-6"
      >
        <AnimatePresence mode="wait">
          {/* CHECKING STATE */}
          {status === "checking" && (
            <motion.div
              key="checking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <FaSpinner className="text-4xl animate-spin text-[var(--accent)]" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-3">{message}</h1>
              <p className="text-sm text-[var(--muted)]">
                Please wait while we confirm your top-up payment.
              </p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <FaCheckCircle className="text-5xl text-green-500" />
                </motion.div>
              </div>

              <h1 className="text-2xl font-bold mb-3 text-green-500">
                {message}
              </h1>
              <p className="text-sm text-[var(--muted)] mb-6">
                Your order has been confirmed and will be delivered automatically.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Check Order Status
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/")}
                  className="w-full rounded-xl border border-[var(--border)] py-3 font-semibold hover:bg-[var(--muted)]/10 transition flex items-center justify-center gap-2"
                >
                  <FaHome />
                  Go to Home
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* FAILED STATE */}
          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center"
                >
                  <FaExclamationTriangle className="text-5xl text-yellow-500" />
                </motion.div>
              </div>

              <h1 className="text-2xl font-bold mb-3 text-yellow-500">
                {message}
              </h1>

              <div className="bg-[var(--muted)]/10 rounded-xl p-4 mb-6 text-sm text-left space-y-3">
                <p>
                  If the amount was deducted, your pack will be delivered automatically
                  within <strong className="text-[var(--accent)]">10–15 minutes</strong>.
                </p>

                <p>
                  If not received, please contact customer support:
                </p>

                <a
                  href="https://wa.me/916372305866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 justify-center w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                  <FaWhatsapp className="text-xl" />
                  Contact Support: 6372305866
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (window.location.href = "/")}
                className="w-full rounded-xl bg-[var(--accent)] py-3 font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FaHome />
                Go to Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
