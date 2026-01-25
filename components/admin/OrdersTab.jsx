"use client";

import { useState, useEffect } from "react";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
const [filters, setFilters] = useState({
  status: "",
  gameSlug: "",
  from: "",
  to: "",
});

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

useEffect(() => {
  fetchOrders();
}, [page, limit, search, filters]);


  /* ================= FETCH ORDERS ================= */
 const fetchOrders = async () => {
  try {
    setLoading(true);
    const token = sessionStorage.getItem("token");

    const params = new URLSearchParams({
      page,
      limit,
      search,
      ...(filters.status && { status: filters.status }),
      ...(filters.gameSlug && { gameSlug: filters.gameSlug }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    });

    const res = await fetch(
      `/api/admin/orders?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    setOrders(data?.data || []);
    setPagination(
      data?.pagination || { total: 0, page: 1, totalPages: 1 }
    );
  } catch (err) {
    console.error("Fetch orders failed", err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};


  /* ================= UPDATE ORDER STATUS ================= */
  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdating(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update order");
        return;
      }

      fetchOrders();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">
          Orders
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Review, verify, and manage customer orders.
        </p>
      </div>

      {/* ================= FILTERS ================= */}
<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
  {/* STATUS */}
  <select
    value={filters.status}
    onChange={(e) => {
      setPage(1);
      setFilters({ ...filters, status: e.target.value });
    }}
    className="h-10 px-3 rounded-lg border bg-[var(--background)] text-sm"
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="success">Success</option>
    <option value="failed">Failed</option>
  </select>

  {/* GAME */}
  <input
    placeholder="Game slug"
    value={filters.gameSlug}
    onChange={(e) => {
      setPage(1);
      setFilters({ ...filters, gameSlug: e.target.value });
    }}
    className="h-10 px-3 rounded-lg border bg-[var(--background)] text-sm"
  />

  {/* FROM DATE */}
  <input
    type="date"
    value={filters.from}
    onChange={(e) => {
      setPage(1);
      setFilters({ ...filters, from: e.target.value });
    }}
    className="h-10 px-3 rounded-lg border bg-[var(--background)] text-sm"
  />

  {/* TO DATE */}
  <input
    type="date"
    value={filters.to}
    onChange={(e) => {
      setPage(1);
      setFilters({ ...filters, to: e.target.value });
    }}
    className="h-10 px-3 rounded-lg border bg-[var(--background)] text-sm"
  />

  {/* RESET */}
  <button
    onClick={() => {
      setPage(1);
      setFilters({ status: "", gameSlug: "", from: "", to: "" });
    }}
    className="h-10 rounded-lg border text-sm hover:bg-black/5"
  >
    Reset
  </button>
</div>


      {/* ================= SEARCH + META ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by order ID, email, game…"
          className="h-10 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
        />

        <span className="text-sm text-[var(--muted)]">
          Total Orders:{" "}
          <b className="text-[var(--foreground)]">
            {pagination.total}
          </b>
        </span>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="py-20 text-center text-[var(--muted)]">
          Loading orders…
        </div>
      )}

      {!loading && (
        <>
          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/5">
                <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-5 py-3 text-left">Game</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Item</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    onClick={() => setSelectedOrder(o)}
                    className="border-t border-[var(--border)] hover:bg-black/5 cursor-pointer"
                  >
                    <td className="px-5 py-4 font-medium capitalize">
                      {o.gameSlug}
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--muted)]">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 max-w-sm truncate text-[var(--muted)]">
                      {o.itemName}
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-green-400">
                      ₹{o.price}
                    </td>

                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusSelect
                        value={o.status}
                        disabled={updating}
                        onChange={(v) =>
                          updateOrderStatus(o.orderId, v)
                        }
                      />
                    </td>
                  </tr>
                ))}

                {!orders.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-[var(--muted)]"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-3">
            {orders.map((o) => (
              <div
                key={o._id}
                onClick={() => setSelectedOrder(o)}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2 cursor-pointer"
              >
                <div className="flex justify-between">
                  <span className="font-semibold capitalize">
                    {o.gameSlug}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-[var(--muted)] line-clamp-2">
                  {o.itemName}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">
                    ₹{o.price}
                  </span>

                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      value={o.status}
                      disabled={updating}
                      onChange={(v) =>
                        updateOrderStatus(o.orderId, v)
                      }
                    />
                  </div>
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
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                ← Prev
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
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= DRAWER ================= */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}

/* ================= DRAWER ================= */

function OrderDrawer({ order, onClose, onUpdateStatus }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(order.orderId, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative ml-auto w-full max-w-md h-full bg-[var(--card)] border-l border-[var(--border)] shadow-2xl">
        <div className="px-6 py-5 border-b border-[var(--border)] space-y-3 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full"
          >
            ✕
          </button>

          <p className="text-xs text-[var(--muted)]">Order Amount</p>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-extrabold text-green-400">
              ₹{order.price}
            </span>

            <StatusSelect
              value={order.status}
              onChange={handleStatusChange}
            />
          </div>

          <p className="text-xs text-[var(--muted)] break-all">
            {order.orderId}
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-120px)] text-sm">
          <Section title="Game & Item">
            <Detail label="Game" value={order.gameSlug} />
            <Detail label="Item" value={order.itemName} />
            <Detail label="Slug" value={order.itemSlug} />
          </Section>

          <Section title="Player">
            <Detail label="Player ID" value={order.playerId} />
            <Detail label="Zone ID" value={order.zoneId} />
          </Section>

          <Section title="Payment">
            <Detail label="Method" value={order.paymentMethod} />
            <Detail label="Payment Status" value={order.paymentStatus} />
            <Detail label="Topup Status" value={order.topupStatus} />
          </Section>

          <Section title="User">
            <Detail label="Email" value={order.email || "—"} />
            <Detail label="Phone" value={order.phone || "—"} />
            <Detail
              label="Created"
              value={new Date(order.createdAt).toLocaleString()}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function StatusSelect({ value, onChange, disabled }) {
  const styles = {
    pending: "bg-yellow-500/15 border-yellow-500 text-yellow-400",
    success: "bg-green-500/15 border-green-500 text-green-400",
    failed: "bg-red-500/15 border-red-500 text-red-400",
  };

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`h-8 px-3 rounded-lg text-xs font-semibold border ${styles[value]} disabled:opacity-50`}
    >
      <option value="pending">PENDING</option>
      <option value="success">SUCCESS</option>
      <option value="failed">FAILED</option>
    </select>
  );
}

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
