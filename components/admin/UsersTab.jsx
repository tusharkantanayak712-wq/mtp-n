"use client";

import { useEffect, useState } from "react";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  // 🔽 FILTERS
  const [userType, setUserType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, userType, fromDate, toDate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit,
        search,
      });

      if (userType) params.append("userType", userType);
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data?.data || []);
      setPagination(
        data?.pagination || { total: 0, page: 1, totalPages: 1 }
      );
    } catch (err) {
      console.error("Fetch users failed", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId, newUserType) => {
    try {
      setUpdatingUserId(userId);
      const token = sessionStorage.getItem("token");

      const res = await fetch("/api/admin/users/change-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newUserType }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update role");
        return;
      }

      fetchUsers();
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getIndex = (i) => (page - 1) * limit + i + 1;

  return (
    <div className="w-full space-y-4">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-extrabold">Users</h2>
        <p className="text-sm text-[var(--muted)]">
          Manage users and roles
        </p>
      </div>

      {/* ================= SEARCH BAR ================= */}
     <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
  {/* SEARCH */}
  <input
    value={search}
    onChange={(e) => {
      setPage(1);
      setSearch(e.target.value);
    }}
    placeholder="Search name, email, phone"
    className="
      w-full
      h-10 px-4
      rounded-lg
      border
      bg-[var(--background)]
      text-sm
    "
  />

  {/* ACTIONS */}
  <div className="flex items-center justify-between gap-3 md:justify-start">
    <button
      onClick={() => setShowFilters(true)}
      className="
        h-10 px-4
        rounded-lg
        border
        bg-[var(--background)]
        text-sm
        w-full md:w-auto
      "
    >
      Filters
    </button>

    <span className=" md:block text-sm text-[var(--muted)]">
      Total:{" "}
      <b className="text-[var(--foreground)]">
        {pagination.total}
      </b>
    </span>
  </div>
</div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="py-16 text-center text-[var(--muted)]">
          Loading users…
        </div>
      )}

      {!loading && (
        <>
          {/* ================= MOBILE ================= */}
          <div className="md:hidden space-y-3">
            {users.map((u, i) => (
              <div
                key={u._id}
                className="rounded-xl border bg-[var(--background)] p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[var(--muted)]">
                    #{getIndex(i)}
                  </span>
                  {updatingUserId === u.userId && (
                    <span className="text-xs text-[var(--muted)]">
                      Updating…
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Avatar user={u} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{u.name}</p>
                    <p className="text-xs text-[var(--muted)] truncate">
                      {u.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm capitalize">
                    Role: <b>{u.userType}</b>
                  </span>

                  <select
                    value={u.userType}
                    disabled={u.userType === "owner"}
                    onChange={(e) =>
                      changeUserRole(u.userId, e.target.value)
                    }
                    className="h-8 px-3 rounded-lg border bg-[var(--background)] text-sm"
                  >
                    <option value="user">User</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    {u.userType === "owner" && (
                      <option value="owner">Owner</option>
                    )}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:block rounded-xl border bg-[var(--card)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/10">
                <tr className="text-xs uppercase text-[var(--muted)]">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} className="border-t hover:bg-black/5">
                    <td className="px-4 py-3 text-xs">
                      {getIndex(i)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {u.userId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-xs">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.userType}
                        disabled={u.userType === "owner"}
                        onChange={(e) =>
                          changeUserRole(u.userId, e.target.value)
                        }
                        className="h-8 px-3 rounded-lg border bg-[var(--background)] text-sm"
                      >
                        <option value="user">User</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        {u.userType === "owner" && (
                          <option value="owner">Owner</option>
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-40"
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
                className="px-4 py-2 border rounded disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= FILTER SIDEBAR ================= */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative ml-auto w-full max-w-sm h-full bg-[var(--card)] border-l p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)]">
                User Role
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full h-10 mt-1 px-3 rounded-lg border bg-[var(--background)]"
              >
                <option value="">All</option>
                <option value="user">User</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)]">
                Created From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-10 mt-1 px-3 rounded-lg border bg-[var(--background)]"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)]">
                Created To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-10 mt-1 px-3 rounded-lg border bg-[var(--background)]"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setUserType("");
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className="flex-1 h-10 rounded-lg border"
              >
                Clear
              </button>

              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 h-10 rounded-lg bg-[var(--accent)] text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= AVATAR ================= */

function Avatar({ user }) {
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="h-9 w-9 rounded-full object-cover border"
      />
    );
  }

  const initials = user.userId
    ?.replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-[var(--accent)] to-purple-500">
      {initials || "U"}
    </div>
  );
}
