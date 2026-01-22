"use client";

import { useState, useEffect } from "react";

import AuthGuard from "../../components/AuthGuard";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import WalletTab from "../../components/Dashboard/WalletTab";
import AccountTab from "../../components/Dashboard/AccountTab";
import QueryTab from "../../components/Dashboard/QueryTab";
import OrdersTab from "../../components/Dashboard/OrdersTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [walletBalance, setWalletBalance] = useState(0);

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
    if (!token) return;

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
      });
  }, [token]);

  const tabCards = [
    { key: "orders", label: "Orders", value: "View" },
    { key: "wallet", label: "Wallet", value: `₹${walletBalance}` },
    { key: "account", label: "Account", value: "Manage" },
    { key: "query", label: "Support", value: "Help" },
  ];

  return (
    <AuthGuard>
      <section className="min-h-screen px-5 py-10 bg-[var(--background)] text-[var(--foreground)]">

        {/* HEADER */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {userDetails.name || "Player"} 👋
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Track orders, manage wallet & account
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
          {tabCards.map((tab) => (
            <DashboardCard
              key={tab.key}
              tab={tab}
              activeTab={activeTab}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto bg-[var(--card)]
                        border border-[var(--border)]
                        rounded-2xl p-6 shadow-xl">

          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "wallet" && (
            <WalletTab
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
            />
          )}
          {activeTab === "account" && (
            <AccountTab userDetails={userDetails} />
          )}
          {activeTab === "query" && <QueryTab />}
        </div>
      </section>
    </AuthGuard>
  );
}
