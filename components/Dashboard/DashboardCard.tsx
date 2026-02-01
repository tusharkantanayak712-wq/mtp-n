"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FiActivity } from "react-icons/fi";

interface DashboardCardProps {
  tab: {
    key: string;
    label: string;
    value: string | number;
    icon: IconType;
  };
  activeTab: string;
  onClick?: () => void;
}

export default function DashboardCard({
  tab,
  activeTab,
  onClick,
}: DashboardCardProps) {
  const isActive = activeTab === (tab.key === 'query' ? 'support' : tab.key);
  const Icon = tab.icon || FiActivity;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full group p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden
        ${isActive
          ? "bg-[var(--accent)] border-[var(--accent)] shadow-[0_12px_24px_-8px_rgba(var(--accent-rgb),0.4)]"
          : "bg-[var(--card)]/40 backdrop-blur-md border-white/5 hover:border-[var(--accent)]/30"
        }`}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className={`text-[9px] font-bold uppercase tracking-widest
            ${isActive ? "text-black/50" : "text-[var(--muted)]"}
          `}>
            {tab.label}
          </span>
          <h3 className={`text-xl font-[900] uppercase italic tracking-tighter leading-none
            ${isActive ? "text-black" : "text-[var(--foreground)]"}
          `}>
            {tab.value}
          </h3>
        </div>

        <div className={`p-2.5 rounded-xl transition-all duration-300
          ${isActive
            ? "bg-black/10 text-black"
            : "bg-[var(--background)] text-[var(--muted)] group-hover:text-[var(--accent)] border border-[var(--border)]"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute bottom-0 left-0 h-1 w-full bg-white/20"
        />
      )}
    </motion.div>
  );
}
