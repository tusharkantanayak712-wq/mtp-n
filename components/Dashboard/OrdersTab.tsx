"use client";

import { useEffect, useState } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import OrderItem, { OrderType } from "./OrderItem";

export default function OrdersTab() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null;

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!token) return;

    fetch("/api/order/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page, limit, search }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setOrders(data.orders || []);
        setTotalCount(data.totalCount || 0);
      });
  }, [token, page, search]);

  /* ================= RESET PAGE ON SEARCH ================= */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= PAGE RANGE ================= */
  const getPageNumbers = () => {
    const pages: number[] = [];

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Orders</h2>
        <span className="text-sm text-[var(--muted)]">
          Showing {(page - 1) * limit + 1}–
          {Math.min(page * limit, totalCount)} of {totalCount}
        </span>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl
                     border border-[var(--border)]
                     bg-[var(--background)]
                     focus:ring-2 focus:ring-[var(--accent)]
                     outline-none"
        />
      </div>

      {/* LIST */}
      {orders.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          No orders found
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderItem key={order.orderId} order={order} />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">

              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg border border-[var(--border)]
                           disabled:opacity-40 hover:bg-[var(--background)]"
                aria-label="Previous page"
              >
                <FiChevronLeft size={18} />
              </button>

              {/* PAGE NUMBERS */}
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg border
                    ${
                      p === page
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "border-[var(--border)] hover:bg-[var(--background)]"
                    }`}
                >
                  {p}
                </button>
              ))}

              {/* NEXT */}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-[var(--border)]
                           disabled:opacity-40 hover:bg-[var(--background)]"
                aria-label="Next page"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
