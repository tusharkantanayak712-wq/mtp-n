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
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full group p-3.5 rounded-xl border transition-all duration-300 text-left overflow-hidden
        ${isActive
          ? "bg-[var(--accent)] border-[var(--accent)] shadow-[0_8px_16px_-6px_rgba(var(--accent-rgb),0.3)]"
          : "bg-[var(--card)]/30 backdrop-blur-md border-white/5 hover:border-[var(--accent)]/20"
        }`}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className={`text-[8px] font-bold uppercase tracking-widest
            ${isActive ? "text-black/40" : "text-[var(--muted)]/60"}
          `}>
            {tab.label}
          </span>
          <h3 className={`text-base font-black uppercase italic tracking-tighter leading-none
            ${isActive ? "text-black" : "text-[var(--foreground)]"}
          `}>
            {tab.value}
          </h3>
        </div>

        <div className={`p-2 rounded-lg transition-all duration-300
          ${isActive
            ? "bg-black/10 text-black"
            : "bg-[var(--background)] text-[var(--muted)] group-hover:text-[var(--accent)] border border-[var(--border)]"
          }`}
        >
          <Icon size={16} />
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-white/20"
        />
      )}
    </motion.div>
  );
}
