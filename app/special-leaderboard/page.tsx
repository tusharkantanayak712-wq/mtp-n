"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";

export default function SpecialLeaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventStatus, setEventStatus] = useState<
    "upcoming" | "active" | "ended"
  >("upcoming");

  const limit = 10;

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();

    const startDate = new Date(year, 1, 5);
    const endDate = new Date(year, 1, 14, 23, 59, 59);

    if (now < startDate) {
      setEventStatus("upcoming");
      setLoading(false);
      return;
    }

    if (now > endDate) {
      setEventStatus("ended");
      setLoading(false);
      return;
    }

    setEventStatus("active");

    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch(
      `/api/leaderboard?range=custom&start=${startDate
        .toISOString()
        .split("T")[0]}&end=${endDate
          .toISOString()
          .split("T")[0]}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((res) => setData(res.success ? res.data : []))
      .finally(() => setLoading(false));
  }, []);

  const topStyles = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400/20 to-pink-500/20 border-yellow-400/50";
    if (rank === 2)
      return "bg-gradient-to-r from-slate-400/20 to-pink-500/20 border-slate-400/50";
    if (rank === 3)
      return "bg-gradient-to-r from-orange-400/20 to-pink-500/20 border-orange-400/50";
    return "border-pink-500/20";
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: 'linear-gradient(-45deg, #120010, #1b001d, #0a0008, #1a0015)',
          backgroundSize: '400% 400%',
          animation: 'gradient-x 15s ease infinite'
        }}
      />

      {/* Soft Glow Orbs with enhanced animation */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full -z-10"
        style={{
          filter: 'blur(160px)',
          animation: 'pulse-glow 6s ease-in-out infinite'
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-600/20 rounded-full -z-10"
        style={{
          filter: 'blur(160px)',
          animation: 'pulse-glow 6s ease-in-out infinite 3s'
        }}
      />

      {/* HERO Section with enhanced styling */}
      <div className="text-center pt-24 pb-12 px-4" style={{ animation: 'fadeUp 0.8s ease-out' }}>
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-2"
          style={{
            background: 'linear-gradient(135deg, #fda4af, #f472b6, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            animation: 'gradient-x 3s ease infinite'
          }}
        >
          💖 Valentine Special Leaderboard
        </h1>

        <p className="text-pink-300 mt-4 text-lg">
          Compete from <span className="font-semibold">5 Feb – 14 Feb</span>
        </p>

        <div
          className="mt-6 inline-block px-6 py-3 rounded-full border backdrop-blur-md font-semibold relative overflow-hidden"
          style={{
            background: 'rgba(236, 72, 153, 0.15)',
            borderColor: 'rgba(236, 72, 153, 0.4)',
            color: '#fda4af',
            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.2)'
          }}
        >
          🎁 Top 5 Players Will Receive Special Prizes
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">

        {/* UPCOMING */}
        {eventStatus === "upcoming" && (
          <div
            className="text-center py-16 rounded-3xl border backdrop-blur-md"
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              borderColor: 'rgba(236, 72, 153, 0.3)',
              animation: 'slideUp 0.5s ease-out'
            }}
          >
            <div className="text-6xl mb-4" style={{ animation: 'heartBeat 2s ease-in-out infinite' }}>
              ⏳
            </div>
            <h2 className="text-2xl font-bold mb-2">Event Not Started</h2>
            <p className="text-pink-300">
              The competition begins on February 5 💕
            </p>
          </div>
        )}

        {/* ENDED */}
        {eventStatus === "ended" && (
          <div
            className="text-center py-16 rounded-3xl border backdrop-blur-md"
            style={{
              background: 'rgba(147, 51, 234, 0.1)',
              borderColor: 'rgba(147, 51, 234, 0.3)',
              animation: 'slideUp 0.5s ease-out'
            }}
          >
            <div className="text-6xl mb-4" style={{ animation: 'heartBeat 2s ease-in-out infinite' }}>
              💌
            </div>
            <h2 className="text-2xl font-bold mb-2">Event Ended</h2>
            <p className="text-purple-300">
              Winners will be announced soon!
            </p>
          </div>
        )}

        {/* ACTIVE */}
        {eventStatus === "active" && (
          <>
            {loading ? (
              <div className="text-center py-20 text-pink-300">
                <div className="relative inline-block h-8 w-8 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-pink-500/20" />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-pink-500 border-t-transparent"
                    style={{ animation: 'spin-slow 1s linear infinite' }}
                  />
                </div>
                <p>Loading rankings...</p>
              </div>
            ) : (
              <div
                className="rounded-3xl border backdrop-blur-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.2)',
                  animation: 'slideUp 0.6s ease-out'
                }}
              >

                {/* Table Header */}
                <div
                  className="grid grid-cols-4 text-sm p-4 font-semibold"
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#fda4af'
                  }}
                >
                  <div>Rank</div>
                  <div>User ID</div>
                  <div>Name</div>
                  <div>Total Spent</div>
                </div>

                {/* Leaderboard Rows */}
                {data.map((item, index) => {
                  const rank = index + 1;

                  return (
                    <div
                      key={index}
                      className={`grid grid-cols-4 p-4 border-t items-center transition-all duration-300 hover:bg-pink-900/20 ${topStyles(
                        rank
                      )}`}
                      style={{
                        animation: `slideUp ${0.3 + index * 0.1}s ease-out`
                      }}
                    >
                      <div className="font-bold text-lg">
                        {rank === 1 && "🥇"}
                        {rank === 2 && "🥈"}
                        {rank === 3 && "🥉"}
                        {rank > 3 && `#${rank}`}
                      </div>

                      <div className="text-gray-300">
                        {item.user?.userId || "—"}
                      </div>

                      <div>
                        {item.user?.name || "Anonymous"}
                      </div>

                      <div className="text-green-400 font-semibold">
                        ₹{item.totalSpent}
                      </div>
                    </div>
                  );
                })}

                {data.length === 0 && (
                  <div className="text-center py-16 text-pink-300">
                    <div className="text-5xl mb-4" style={{ animation: 'heartBeat 2s ease-in-out infinite' }}>
                      💗
                    </div>
                    <p>Be the first to claim the #1 spot</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
