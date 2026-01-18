"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiCalendar,
  FiUser,
  FiGrid,
  FiCreditCard,
  FiPackage,
  FiHash,
  FiShare2,
  FiCopy,
  FiX,
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

/* ================= GAME NAME ================= */

const getGameName = (slug: string) => {
  const s = slug.toLowerCase();

  const mlbbSlugs = [
    "mobile-legends988",
    "mlbb-smallphp638",
    "mlbb-double332",
    "sgmy-mlbb893",
    "value-pass-ml948",
    "mlbb-russia953",
    "mlbb-indo42",
  ];

  if (mlbbSlugs.some((k) => s.includes(k))) return "Mobile Legends";
  if (s.includes("pubg-mobile138")) return "BGMI";

  return slug;
};

/* ================= MAIN ================= */

export default function OrderItem({ order }: { order: OrderType }) {
  const [open, setOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const status = order.topupStatus || order.status;

  const statusStyle = {
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    failed: "bg-red-500/10 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  }[status] || "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

  return (
    <>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        {/* HEADER */}
        <div className="px-4 py-4 space-y-2">
          {/* ROW 1 */}
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <FiHash />
            <span className="truncate">{order.orderId}</span>
          </div>

          {/* ROW 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <FiCalendar />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="text-base font-bold">₹{order.price}</div>
          </div>

          {/* ROW 3 */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold border ${statusStyle}`}
            >
              {status.toUpperCase()}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReceipt(true)}
                className="p-2 rounded-lg border border-[var(--border)]"
                aria-label="Open receipt"
              >
                <FiShare2 size={16} />
              </button>

              <button
                onClick={() => setOpen(!open)}
                className="p-2"
                aria-label="Expand"
              >
                <FiChevronDown
                  className={`transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* EXPANDED */}
        <div
          className={`grid transition-all duration-300 ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden px-4 pb-4">
            <div className="border-t border-[var(--border)] pt-4 space-y-3 text-sm">
              <Info label="Game" value={getGameName(order.gameSlug)} icon={<FiUser />} />
              <Info label="Player ID" value={order.playerId} mono icon={<FiUser />} />
              <Info label="Zone ID" value={order.zoneId} mono icon={<FiGrid />} />
              <Info
                label="Payment"
                value={order.paymentMethod.toUpperCase()}
                icon={<FiCreditCard />}
              />

              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-3">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1">
                  <FiPackage /> Item
                </div>
                <p className="font-medium break-words">
                  {order.itemName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && (
        <ReceiptModal order={order} onClose={() => setShowReceipt(false)} />
      )}
    </>
  );
}

/* ================= RECEIPT MODAL ================= */

function ReceiptModal({
  order,
  onClose,
}: {
  order: OrderType;
  onClose: () => void;
}) {
  const receiptText = `
Order Receipt

Order ID: ${order.orderId}
Game: ${getGameName(order.gameSlug)}
Player ID: ${order.playerId}
Zone ID: ${order.zoneId}
Item: ${order.itemName}
Payment: ${order.paymentMethod.toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleString()}
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(receiptText);
    alert("Copied");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Order Receipt",
        text: receiptText,
      });
    } else {
      await navigator.clipboard.writeText(receiptText);
      alert("Share not supported. Copied instead.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
      <div className="w-full bg-white text-black rounded-t-2xl p-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-lg font-bold text-center mb-4">
          Receipt
        </h2>

        <pre className="text-xs bg-gray-100 rounded-xl p-3 whitespace-pre-wrap mb-4">
          {receiptText}
        </pre>

        {/* COPY LEFT · SHARE RIGHT */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2
                       border border-[var(--border)] py-2.5 rounded-xl font-semibold"
          >
            <FiCopy /> Copy
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2
                       bg-[var(--primary)] text-white py-2.5 rounded-xl font-semibold"
          >
            <FiShare2 /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Info({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-3">
      <div className="flex items-center gap-2 text-[var(--muted)]">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className={`${
          mono ? "font-mono text-xs" : "font-medium"
        } text-right break-all`}
      >
        {value}
      </span>
    </div>
  );
}
