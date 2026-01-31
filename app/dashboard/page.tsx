"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AuthGuard from "../../components/AuthGuard";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import WalletTab from "../../components/Dashboard/WalletTab";
import AccountTab from "../../components/Dashboard/AccountTab";
import QueryTab from "../../components/Dashboard/QueryTab";
import OrdersTab from "../../components/Dashboard/OrdersTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null;

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setUserDetails({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });

        setWalletBalance(data.user.wallet || 0);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const tabCards = [
    { key: "orders", label: "Orders", value: "View" },
    // { key: "wallet", label: "Wallet", value: `₹${walletBalance}` },
    // { key: "account", label: "Account", value: "Manage" },
    { key: "query", label: "Support", value: "Help" },
  ];

  return (
    <AuthGuard>
      <section className="min-h-screen px-5 py-5 bg-[var(--background)] text-[var(--foreground)]">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row gap-5 md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
              Welcome back, {userDetails.name || "Player"} 👋
            </h1>
            <p className="text-base text-[var(--muted)] mt-2">
              Track orders, manage wallet & account
            </p>
          </div>
        </motion.div>

        {/* CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
          {tabCards.map((tab, index) => (
            <motion.div
              key={tab.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <DashboardCard
                tab={tab}
                activeTab={activeTab}
                onClick={() => setActiveTab(tab.key)}
              />
            </motion.div>
          ))}
        </div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto bg-[var(--card)]
                        border border-[var(--border)]
                        rounded-2xl p-6 shadow-xl"
        >
          <AnimatePresence mode="wait">
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <OrdersTab />
              </motion.div>
            )}
            {activeTab === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <WalletTab
                  walletBalance={walletBalance}
                  setWalletBalance={setWalletBalance}
                />
              </motion.div>
            )}
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <AccountTab userDetails={userDetails} />
              </motion.div>
            )}
            {activeTab === "query" && (
              <motion.div
                key="query"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <QueryTab />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </AuthGuard>
  );
}
