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
    const token = sessionStorage.getItem("token");
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
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
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
        : "Free User";

  const daysLeft =
    expiry
      ? Math.max(
        0,
        Math.ceil((expiry.getTime() - Date.now()) / 86400000)
      )
      : null;

  return (
    <AuthGuard>
      <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-2xl"
        >

          {/* ================= CURRENT TIER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-[var(--border)]"
          >
            <div>
              <p className="text-sm text-[var(--muted)] mb-1">Your Membership</p>
              <p className="text-3xl font-extrabold flex items-center gap-3">
                {isOwner && <FaCrown className="text-yellow-400" />}
                {isReseller && <FaUserTie className="text-yellow-500" />}
                {isSilver && <FaStar className="text-gray-400" />}
                {currentTier}
              </p>
            </div>

            {(isSilver || isReseller) && expiry && (
              <div className="text-left sm:text-right">
                <p className="text-xs text-[var(--muted)] mb-1">Expires in</p>
                <p className="text-2xl font-bold text-[var(--accent)]">
                  {daysLeft} days
                </p>
              </div>
            )}
          </motion.div>

          {/* ================= OWNER VIEW ================= */}
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <FaCrown className="text-7xl text-yellow-400 mx-auto mb-6" />
              </motion.div>
              <p className="text-2xl font-bold mb-2">
                Lifetime Access Enabled
              </p>
              <p className="text-base text-[var(--muted)]">
                You have full access to all features.
              </p>
            </motion.div>
          )}

          {/* ================= PLANS ================= */}
          {!isOwner && (
            <>
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center gap-4 mb-10"
              >
                <PlanTab
                  active={activeTab === "silver"}
                  label="Silver"
                  icon={<FaStar />}
                  onClick={() => setActiveTab("silver")}
                />
                <PlanTab
                  active={activeTab === "reseller"}
                  label="Reseller"
                  icon={<FaUserTie />}
                  onClick={() => setActiveTab("reseller")}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {/* Silver Plan */}
                {activeTab === "silver" && (
                  <motion.div
                    key="silver"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PerkList
                      perks={[
                        "Cheaper product pricing",
                        "Collage / Profile Maker access",
                        "ID Rent priority access",
                      ]}
                    />

                    {(isUser || isSilver) && (
                      <div className="flex justify-center mt-10">
                        <ActionButton
                          href={
                            isSilver
                              ? "/games/membership/reseller-membership"
                              : "/games/membership/silver-membership"
                          }
                          label={
                            isSilver
                              ? "Upgrade to Reseller"
                              : "Buy Silver Membership"
                          }
                          type="silver"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Reseller Plan */}
                {activeTab === "reseller" && (
                  <motion.div
                    key="reseller"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PerkList
                      perks={[
                        "Lowest possible prices",
                        "Bulk tools & reseller dashboard",
                        "Collage / Profile Maker access",
                        "Highest priority ID Rent access",
                      ]}
                    />

                    {(isUser || isSilver) && (
                      <div className="flex justify-center mt-10">
                        <ActionButton
                          href="/games/membership/reseller-membership"
                          label="Buy Reseller Membership"
                          type="gold"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </section>
    </AuthGuard>
  );
}

/* ================= SUB COMPONENTS ================= */

function PlanTab({ active, label, icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-3.5 rounded-full font-semibold text-sm
                  flex items-center gap-2 transition-all shadow-sm
        ${active
          ? "bg-[var(--accent)] text-white shadow-lg"
          : "bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)]"
        }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function PerkList({ perks }) {
  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
      {perks.map((perk, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-4 px-6 py-5 text-sm
            ${i % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]"}`}
        >
          <FaCheckCircle className="text-green-500 text-lg shrink-0" />
          <span className="font-medium">{perk}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ActionButton({ href, label, type }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={`px-10 py-4 rounded-xl font-bold text-center transition-all shadow-lg inline-flex items-center gap-2
          ${type === "gold"
            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
            : "bg-gradient-to-r from-gray-300 to-gray-400 text-black hover:from-gray-400 hover:to-gray-500"
          }`}
      >
        {label}
        <FaArrowRight />
      </Link>
    </motion.div>
  );
}
