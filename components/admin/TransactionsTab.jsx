"use client";

import { useState, useEffect } from "react";

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, search]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `/api/admin/transactions?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setTransactions(data?.data || []);
      setPagination(
        data?.pagination || {
          total: 0,
          page: 1,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error("Transaction fetch failed", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = {
    success: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    pending: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">
          Transactions
        </h2>
        <p className="text-sm text-[var(--muted)]">
          All processed and attempted payments.
        </p>
      </div>

      {/* ================= META ================= */}
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span>
          Total Transactions:{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {pagination.total}
          </span>
        </span>

        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="py-20 text-center text-[var(--muted)]">
          Loading transactions…
        </div>
      )}

      {!loading && (
        <>
          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/5">
                <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Order ID</th>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Game</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => setSelectedTx(t)}
                    className="border-t border-[var(--border)] hover:bg-black/5 cursor-pointer transition"
                  >
                    <td className="px-5 py-4 text-xs text-[var(--muted)]">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs break-all">
                      {t.orderId}
                    </td>

                    <td className="px-5 py-4 truncate">
                      {t.email || t.userId || "—"}
                    </td>

                    <td className="px-5 py-4 capitalize text-[var(--muted)]">
                      {t.gameSlug}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-green-400">
                      ₹{t.price}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta[t.status]}`}
                      >
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}

                {!transactions.length && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[var(--muted)]">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-3">
            {transactions.map((t) => (
              <div
                key={t._id}
                onClick={() => setSelectedTx(t)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2 cursor-pointer active:scale-[0.98] transition"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusMeta[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-lg font-bold text-green-400">
                  ₹{t.price}
                </div>

                <div className="text-xs text-[var(--muted)] capitalize">
                  {t.gameSlug}
                </div>

                <div className="text-xs font-mono truncate">
                  {t.orderId}
                </div>

                <div className="text-xs text-[var(--muted)] truncate">
                  {t.email || t.userId || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
              >
                ← Previous
              </button>

              <span className="text-sm text-[var(--muted)]">
                Page <b>{pagination.page}</b> of{" "}
                <b>{pagination.totalPages}</b>
              </span>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(pagination.totalPages, p + 1)
                  )
                }
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= DRAWER ================= */}
      {selectedTx && (
        <TransactionDrawer
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}

/* ================= DRAWER ================= */

function TransactionDrawer({ tx, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const statusMeta = {
    success: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    pending: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative ml-auto w-full max-w-md h-full bg-[var(--card)] border-l border-[var(--border)] shadow-2xl animate-slide-in">
        <div className="px-6 py-5 border-b border-[var(--border)] relative space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/10"
          >
            ✕
          </button>

          <p className="text-xs text-[var(--muted)]">Transaction Amount</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-green-400">
              ₹{tx.price}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta[tx.status]}`}
            >
              {tx.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-[var(--muted)] font-mono break-all">
            {tx.orderId}
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-120px)] text-sm">
          <Section title="Game & Item">
            <Detail label="Game" value={tx.gameSlug} />
            <Detail label="Item Name" value={tx.itemName} />
            <Detail label="Item Slug" value={tx.itemSlug} />
          </Section>

          <Section title="Player">
            <Detail label="Player ID" value={tx.playerId} />
            <Detail label="Zone ID" value={tx.zoneId} />
          </Section>

          <Section title="Payment">
            <Detail label="Method" value={tx.paymentMethod} />
            <Detail label="Payment Status" value={tx.paymentStatus} />
            <Detail label="Topup Status" value={tx.topupStatus} />
          </Section>

          <Section title="User">
            <Detail label="Email" value={tx.email || "—"} />
            <Detail label="Phone" value={tx.phone || "—"} />
            <Detail
              label="Created"
              value={new Date(tx.createdAt).toLocaleString()}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="font-medium break-words max-w-[60%] text-right">
        {value}
      </span>
    </div>
  );
}
