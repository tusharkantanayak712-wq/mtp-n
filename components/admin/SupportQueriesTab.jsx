"use client";

import { useState, useEffect } from "react";

export default function SupportQueriesTab() {
  const [queries, setQueries] = useState([]);
  const [activeQuery, setActiveQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchQueries();
  }, [page, limit, search]);

  /* ================= FETCH QUERIES ================= */
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `/api/admin/support-queries?page=${page}&limit=${limit}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      setQueries(data?.data || []);
      setPagination(
        data?.pagination || { total: 0, page: 1, totalPages: 1 }
      );
    } catch (err) {
      console.error("Fetch support queries failed", err);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE QUERY STATUS ================= */
  const updateQueryStatus = async (id, status) => {
    try {
      setUpdating(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch("/api/admin/support-queries/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update status");
        return;
      }

      fetchQueries();
    } finally {
      setUpdating(false);
    }
  };

  const statusMeta = {
    open: { label: "Open", class: "bg-yellow-500/15 text-yellow-400" },
    in_progress: {
      label: "In Progress",
      class: "bg-blue-500/15 text-blue-400",
    },
    resolved: {
      label: "Resolved",
      class: "bg-green-500/15 text-green-400",
    },
    closed: { label: "Closed", class: "bg-gray-500/15 text-gray-400" },
  };

  const getStatus = (status) => status || "open";

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-lg font-extrabold tracking-tight">
          Support Queries
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Messages submitted by users that require attention.
        </p>
      </div>

      {/* ================= SEARCH + META ================= */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by email, phone, message…"
          className="h-10 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
        />

        <span className="text-sm text-[var(--muted)]">
          Total Queries:{" "}
          <b className="text-[var(--foreground)]">
            {pagination.total}
          </b>
        </span>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="py-20 text-center text-[var(--muted)]">
          Loading support queries…
        </div>
      )}

      {!loading && (
        <>
          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/10">
                <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {queries.map((q) => {
                  const status = getStatus(q.status);
                  const meta = statusMeta[status];

                  return (
                    <tr
                      key={q._id}
                      onClick={() => setActiveQuery(q)}
                      className="border-t border-[var(--border)] hover:bg-black/5 cursor-pointer"
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium break-all">
                          {q.email || "User"}
                        </div>
                        {q.phone && (
                          <div className="text-xs text-[var(--muted)]">
                            {q.phone}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3 capitalize text-[var(--muted)]">
                        {q.type}
                      </td>

                      <td className="px-5 py-3 max-w-sm truncate text-[var(--muted)]">
                        {q.message}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${meta.class}`}
                        >
                          {meta.label}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-xs text-[var(--muted)]">
                        {new Date(q.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {!queries.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-[var(--muted)]"
                    >
                      No support queries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-3">
            {queries.map((q) => {
              const status = getStatus(q.status);
              const meta = statusMeta[status];

              return (
                <div
                  key={q._id}
                  onClick={() => setActiveQuery(q)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2 cursor-pointer"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold truncate">
                      {q.email || q.phone || "User"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.class}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="text-xs capitalize text-[var(--muted)]">
                    {q.type}
                  </div>

                  <p className="text-sm line-clamp-2">
                    {q.message}
                  </p>

                  <div className="text-xs text-[var(--muted)]">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
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

      {/* ================= MODAL ================= */}
      {activeQuery && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">
                Support Query Details
              </h3>
              <button onClick={() => setActiveQuery(null)}>✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <Info
                label="Contact"
                value={
                  activeQuery.email ||
                  activeQuery.phone ||
                  "-"
                }
              />

              <Info
                label="Type"
                value={activeQuery.type}
                capitalize
              />

              <div>
                <p className="text-xs text-[var(--muted)] mb-1">
                  Message
                </p>
                <p className="font-medium whitespace-pre-wrap">
                  {activeQuery.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)] mb-1">
                  Status
                </p>
                <select
                  value={getStatus(activeQuery.status)}
                  disabled={updating}
                  onChange={(e) => {
                    updateQueryStatus(
                      activeQuery._id,
                      e.target.value
                    );
                    setActiveQuery(null);
                  }}
                  className="w-full h-9 rounded-lg border bg-[var(--background)] text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <p className="text-xs text-[var(--muted)]">
                Created:{" "}
                {new Date(
                  activeQuery.createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= HELPER ================= */

function Info({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`font-medium ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}
