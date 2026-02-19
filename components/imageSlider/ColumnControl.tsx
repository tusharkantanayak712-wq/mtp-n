// src/components/ColumnControl.tsx
"use client";

import { useStore } from "@/store/useStore";
import { Grid3X3 } from "lucide-react";

export default function ColumnControl() {
  const columns = useStore((s) => s.columns);
  const setColumns = useStore((s) => s.setColumns);

  return (
    <div
      className="
        bg-white/[0.03]
        border border-white/5
        rounded-2xl
        p-4
        space-y-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <Grid3X3 size={14} className="text-[var(--accent)]/60" />
          Grid Columns
        </div>

        <div
          className="
            px-3 py-1
            rounded-lg
            bg-[var(--accent)]/10
            text-[11px]
            font-bold
            text-[var(--accent)]
            border border-[var(--accent)]/20
          "
        >
          {columns}
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={1}
          max={15}
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          className="
            w-full h-1.5
            bg-white/5
            rounded-lg
            appearance-none
            cursor-pointer
            accent-[var(--accent)]
            hover:accent-[var(--accent)]/80
            transition-all
          "
        />
      </div>
    </div>
  );
}
