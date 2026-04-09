"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiCalendar,
  FiUser,
  FiGrid,
  FiCreditCard,
  FiHash,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

/* ================= TYPES ================= */

export type OrderType = {
  orderId: string;
  gameSlug: string;
  itemName: string;
  playerId: string;
  zoneId: string;
  paymentMethod: string;
  price: number;
  status: string;
  topupStatus?: string;
  createdAt: string;
};

/* ================= HELPERS ================= */

const getGameName = (slug: string) => {
  const s = slug.toLowerCase();
  const mlbbSlugs = ["mobile-legends", "mlbb", "diamond"];
  if (mlbbSlugs.some((k) => s.includes(k))) return "Mobile Legends";
  if (s.includes("pubg") || s.includes("bgmi")) return "BGMI";
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

/* ================= MAIN ITEM COMPONENT ================= */

export default function OrderItem({ order }: { order: OrderType }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.status);
  const [localTopupStatus, setLocalTopupStatus] = useState(order.topupStatus);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (verifyLoading) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setVerifyLoading(true);
    try {
      const res = await fetch("/api/order/verify-topup-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.orderId }),
      });

      const data = await res.json();
      if (data.success || data.topupStatus === "success" || data.topupStatus === "SUCCESS") {
        setLocalStatus("success");
        setLocalTopupStatus("success");
      } else if (data.message === "Topup processing") {
        setLocalTopupStatus("processing");
      } else if (data.paymentStatus === "failed") {
        setLocalStatus("failed");
      }
      
      if (data.message) {
        // We don't have a toast system visible here, so we'll just rely on status update
        console.log("Verification result:", data.message);
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  const rawStatus = (
    localStatus?.toLowerCase().includes("refund")
      ? "refund"
      : (localTopupStatus || localStatus || "")
  ).toLowerCase();

  const getStatusConfig = (s: string) => {
    if (s.includes("success") || s.includes("completed") || s.includes("deployed")) {
      return { color: "#10b981", icon: FiCheckCircle, label: "SUCCESS" };
    }
    if (s.includes("failed") || s.includes("cancelled") || s.includes("error")) {
      return { color: "#ef4444", icon: FiAlertCircle, label: "FAILED" };
    }
    if (s.includes("refund")) {
      return { color: "#3b82f6", icon: FiCheckCircle, label: "REFUNDED" };
    }
    if (s.includes("processing")) {
      return { color: "#3b82f6", icon: FiLoader, label: "PROCESSING" };
    }
    return { color: "#f59e0b", icon: FiLoader, label: "PENDING" };
  };

  const config = getStatusConfig(rawStatus);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[var(--card)]/40 backdrop-blur-xl transition-all duration-300">

      {/* TOP STATUS BAR */}
      <div
        className="px-4 py-1.5 flex items-center justify-between border-b border-white/[0.02]"
        style={{ backgroundColor: `${config.color}03` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" style={{ color: config.color }}>
            <config.icon size={11} className={config.label === 'PENDING' || config.label === 'PROCESSING' ? 'animate-spin' : ''} />
            <span className="text-[8.5px] font-black uppercase tracking-widest">
              {config.label}
            </span>
          </div>

          {config.label === 'PENDING' && order.paymentMethod?.toLowerCase() === 'upi' && (
            <button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="px-1.5 py-0.5 rounded-sm bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-[var(--accent)] text-[7px] font-black uppercase tracking-wider hover:bg-[var(--accent)] hover:text-black transition-all flex items-center gap-1"
            >
              {verifyLoading ? <FiLoader className="animate-spin" size={6} /> : "Check Status"}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-40">
          <span className="text-[7.5px] font-bold text-[var(--foreground)] font-mono break-all leading-none max-w-[140px]">
            {order.orderId.toUpperCase()}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 hover:text-[var(--accent)] transition-colors flex-shrink-0"
          >
            {copied ? <FiCheck size={10} /> : <FiCopy size={10} />}
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-3.5 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-[var(--foreground)] uppercase leading-none mb-1.5">
              {getGameName(order.gameSlug)}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">{order.itemName}</span>
              <div className="flex items-center gap-1.5 opacity-60">
                <FiUser className="text-[var(--accent)]" size={10} />
                <span className="text-[9px] font-bold font-mono">{order.playerId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end leading-none">
              <div className="text-base font-black text-[var(--foreground)]">₹{order.price}</div>
              <div className="text-[8px] font-bold text-[var(--muted)] uppercase mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} className="text-[var(--muted)] opacity-50">
              <FiChevronDown size={16} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* EXPANDED DATA */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 overflow-hidden"
          >
            <div className="border-t border-[var(--border)] pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoNode label="Player ID" value={order.playerId} icon={FiUser} mono />
              <InfoNode label="Zone ID" value={order.zoneId} icon={FiGrid} mono />
              <InfoNode label="Payment" value={order.paymentMethod.toUpperCase()} icon={FiCreditCard} />
            </div>
            
            {/* Additional info for pending UPI status */}
            {config.label === 'PENDING' && order.paymentMethod?.toLowerCase() === 'upi' && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-[9px] font-medium text-amber-500/80 uppercase tracking-widest leading-relaxed">
                  Paid via UPI but order still shows pending? Tap "Check Status" above to update it.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoNode({ label, value, icon: Icon, mono }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
      <div className="flex items-center gap-2 text-[var(--muted)] font-bold uppercase text-[9px] tracking-widest">
        <Icon size={14} />
        {label}
      </div>
      <div className={`text-[var(--foreground)] uppercase font-bold text-[11px] ${mono ? 'font-mono' : ''}`}>
        {value || 'N/A'}
      </div>
    </div>
  );
}
