"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import {
  FaCrown,
  FaStar,
  FaUserTie,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

export default function AdminPanalPage() {
  const [role, setRole] = useState("user");
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("silver");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.userType) setRole(data.userType);
        if (data?.membershipExpiresAt)
          setExpiry(new Date(data.membershipExpiresAt));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = role === "owner";
  const isReseller = role === "admin";
  const isSilver = role === "member";
  const isUser = role === "user";

  const currentTier = isOwner
    ? "Owner"
    : isReseller
      ? "Reseller"
      : isSilver
        ? "Silver"
        : "Free";

  const daysLeft =
    expiry
      ? Math.max(
        0,
        Math.ceil((expiry.getTime() - Date.now()) / 86400000)
      )
      : null;

  const silverPerks = [
    "Collage Maker",
    "Lowest Prices",
    "ID Rental",
    "Priority Deal",
    "API Access & Docs",
    "All Games Included",
    "Wallet Support",
  ];

  const resellerPerks = [
    "Low Price",
    "Discounted Offers",
    "ID Rental",
    "Priority Support",
    "Wallet Support",
  ];

  return (
    <AuthGuard>
      <section className="min-h-screen bg-black p-4 flex flex-col items-center pt-6">
        <div className="w-full max-w-sm bg-neutral-900 border border-white/5 rounded-3xl p-5 shadow-2xl space-y-5">

          {/* STATUS */}
          <div className="flex justify-between items-center px-1">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--accent)] italic opacity-40">Current Tier</p>
              <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-1.5 leading-none text-white">
                {isOwner && <FaCrown size={14} className="text-yellow-400" />}
                {isReseller && <FaUserTie size={14} className="text-yellow-500" />}
                {isSilver && <FaStar size={14} className="text-gray-400" />}
                {currentTier}
              </h2>
            </div>
            {(isSilver || isReseller) && expiry && (
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 opacity-40">Expiry</p>
                <p className="text-xs font-black italic uppercase text-[var(--accent)] leading-none">{daysLeft}D Left</p>
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* CONTENT */}
          {isOwner ? (
            <div className="text-center py-6 space-y-2">
              <FaCrown className="text-3xl text-yellow-400 mx-auto" />
              <p className="text-base font-black italic uppercase tracking-tighter text-white">Owner Access</p>
              <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Unlimited Enterprise Portal</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* TABS */}
              <div className="flex p-0.5 bg-white/5 rounded-xl gap-0.5">
                <button
                  onClick={() => setActiveTab("silver")}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest italic transition-all ${activeTab === "silver" ? "bg-[var(--accent)] text-black" : "text-neutral-500 hover:text-[var(--accent)]"}`}
                >
                  Silver
                </button>
                <button
                  onClick={() => setActiveTab("reseller")}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic transition-all ${activeTab === "reseller" ? "bg-[var(--accent)] text-black" : "text-neutral-500 hover:text-[var(--accent)]"}`}
                >
                  Reseller
                </button>
              </div>

              {/* LIST */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  {(activeTab === "silver" ? silverPerks : resellerPerks).map((perk, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900/50 border-b border-white/5 last:border-0">
                      <FaCheckCircle className="text-emerald-500/50 text-[10px]" />
                      <span className="text-[10px] font-black italic uppercase tracking-tight text-neutral-400 leading-none">{perk}</span>
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTON - FORCED CONTRAST */}
                {(isUser || (activeTab === "reseller" && isSilver)) && (
                  <Link
                    href={activeTab === "silver" ? "/games/membership/silver-membership" : "/games/membership/reseller-membership"}
                    className="flex w-full h-11 rounded-xl bg-[var(--accent)] items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                    style={{ color: '#000000', textDecoration: 'none' }}
                  >
                    <span className="text-[11px] font-[1000] italic uppercase tracking-[0.15em]" style={{ color: '#000000' }}>
                      {activeTab === "silver" ? "Get Silver" : "Get Reseller"}
                    </span>
                    <FaArrowRight size={11} style={{ color: '#000000' }} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </AuthGuard>
  );
}
