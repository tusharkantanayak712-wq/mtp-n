"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly"); // default weekly

  const limit = 10;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    fetch(`/api/leaderboard?limit=${limit}&range=${range}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.success ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [range]);

  const rankBadge = (rank) => {
    if (rank === 1)
      return "bg-yellow-400/20 text-yellow-300 border-yellow-400";
    if (rank === 2)
      return "bg-slate-400/20 text-slate-200 border-slate-400";
    if (rank === 3)
      return "bg-orange-400/20 text-orange-300 border-orange-400";
    return "bg-gray-800 text-gray-400 border-gray-700";
  };

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            🏆 Top Spenders
          </h1>
          <p className="text-gray-400 mt-2">
            Ranked by total purchase value
          </p>
        </div>

        {/* Range Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          {/* ALL TIME – DISABLED */}
          <button
            disabled
            title="All-time leaderboard coming soon"
            className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800"
          >
            All Time
          </button>

          {["weekly", "monthly"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition ${
                range === r
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {r === "weekly" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">
            Loading leaderboard…
          </div>
        ) : data.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-xl bg-gray-900/40">
            <p className="text-2xl font-semibold mb-2">
              🚀 No entries yet
            </p>
            <p className="text-gray-400 mb-3">
              The leaderboard is waiting for its first champion.
            </p>
            <p className="text-sm text-gray-500">
              Make a purchase and claim the #1 spot 🥇
            </p>
          </div>
        ) : (
          /* Table Card */
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur">
            <table className="w-full">
              <thead className="bg-gray-950/70">
                <tr className="text-gray-400 text-sm">
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">User ID</th>
                  <th className="p-4 text-left">Name</th>
                  {/* <th className="p-4 text-left">Orders</th> */}
                  <th className="p-4 text-left">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={index}
                      className="border-t border-gray-800 hover:bg-gray-800/60 transition"
                    >
                      <td className="p-4">
                        <span
                          className={`inline-flex min-w-[48px] justify-center px-3 py-1 rounded-full border text-sm font-bold ${rankBadge(
                            rank
                          )}`}
                        >
                          #{rank}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {item.user?.userId || "—"}
                      </td>
                      <td className="p-4">
                        {item.user?.name || "Anonymous"}
                      </td>
                      {/* <td className="p-4">
                        {item.totalOrders}
                      </td> */}
                      <td className="p-4 font-semibold text-green-400">
                        ₹{item.totalSpent}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
