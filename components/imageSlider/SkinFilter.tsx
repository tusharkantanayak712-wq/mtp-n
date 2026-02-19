"use client";

import { SKIN_CATEGORIES } from "@/data/skins";
import { useStore } from "@/store/useStore";
import {
  Layers,
  Crown,
  Sparkles,
  Star,
  Flame,
  BadgeCheck,
  Circle,
} from "lucide-react";

/* Icon mapping per category */
const CATEGORY_ICONS: Record<string, any> = {
  all: Layers,
  legend: Crown,
  grand: Sparkles,
  exquisite: Star,
  deluxe: Flame,
  exceptional: BadgeCheck,
  common: Circle,
};

export default function SkinFilter() {
  const active = useStore((s) => s.activeCategory);
  const setCategory = useStore((s) => s.setCategory);

  return (
    <div
      className="
        flex gap-2 overflow-x-auto
        pb-2 -mx-1 px-1
        scrollbar-hide
      "
    >
      {/* ALL */}
      <FilterChip
        label="All"
        active={active === "all"}
        icon={CATEGORY_ICONS.all}
        onClick={() => setCategory("all")}
      />

      {/* CATEGORIES */}
      {SKIN_CATEGORIES.map((cat) => (
        <FilterChip
          key={cat}
          label={cat}
          active={active === cat}
          icon={CATEGORY_ICONS[cat]}
          onClick={() => setCategory(cat)}
        />
      ))}
    </div>
  );
}

/* ---------------- CHIP COMPONENT ---------------- */

function FilterChip({
  label,
  active,
  icon: Icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-[11px] font-bold uppercase tracking-wider whitespace-nowrap
        border transition-all duration-300
        ${active
          ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] scale-[1.05]"
          : "bg-white/[0.03] text-white/40 border-white/5 hover:border-white/20 hover:bg-white/5 hover:text-white/60"
        }
      `}
    >
      <Icon size={14} className={active ? "text-black" : "text-[var(--accent)]/60"} />
      {label}
    </button>
  );
}
