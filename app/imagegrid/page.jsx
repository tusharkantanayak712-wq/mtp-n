"use client";

import { useRef, useState } from "react";
import ColumnControl from "@/components/imageSlider/ColumnControl";
import SkinPicker from "@/components/imageSlider/SkinPicker";
import ExportCanvas from "@/components/imageSlider/ExportCanvas";
import UploadSidebar from "@/components/imageSlider/UploadSidebar";
import SkinFilter from "@/components/imageSlider/SkinFilter";
import Templates from "@/components/imageSlider/Templates";
import SelectedSkinsModal from "@/components/imageSlider/SelectedSkinsModal";
import { downloadGrid } from "@/utils/download";
import { saveTemplate } from "@/utils/templates";
import { useStore } from "@/store/useStore";
import {
  ImagePlus,
  Download,
  Save,
  Settings2,
  SlidersHorizontal,
  LayoutGrid,
  ListFilter
} from "lucide-react";

export default function Page() {
  const exportRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const { searchQuery, setSearchQuery, selectedSkins } = useStore();

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5] p-4 sm:p-8 lg:p-12 space-y-8 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[var(--accent)]">
            <Settings2 size={20} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Creative Studio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Skin Grid <span className="text-[var(--accent)]">Generator</span>
          </h1>
          <p className="text-white/40 max-w-lg text-sm md:text-base">
            Customize and export high-fidelity skin grids with precision. Adjust columns, filter by rarity, and manage your templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReorderOpen(true)}
            className="
              flex items-center gap-2.5 px-6 py-3
              bg-white/5 hover:bg-white/10 border border-white/10
              text-white rounded-2xl transition-all duration-300
              hover:scale-[1.02] active:scale-[0.98] group
            "
          >
            <ListFilter size={18} className="text-[var(--accent)]" />
            <span className="font-semibold text-sm">Sort & Reorder ({selectedSkins.length})</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="
              flex items-center gap-2.5 px-6 py-3
              bg-white/5 hover:bg-white/10 border border-white/10
              text-white rounded-2xl transition-all duration-300
              hover:scale-[1.02] active:scale-[0.98] group
            "
          >
            <ImagePlus size={18} className="text-[var(--accent)] group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Upload Assets</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROLS (Moved to bottom on mobile) */}
        <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
          {/* SEARCH & FILTERS CARD */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white/60 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Catalogue Filter</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.1em]">
                <SlidersHorizontal size={12} />
                Configuration
              </div>
              <ColumnControl />
              <SkinFilter />
            </div>
          </div>

          {/* SKIN PICKER */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Asset Library</span>
              <span className="text-[10px] bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-md font-bold uppercase">Ready</span>
            </div>
            <SkinPicker />
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & EXPORT (Moved to top on mobile) */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {/* EXPORT TARGET WINDOW */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4 sm:p-8 shadow-inner overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div ref={exportRef} className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <ExportCanvas />
            </div>
          </div>

          {/* MAIN ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                try {
                  saveTemplate();
                  alert("Template saved successfully!");
                } catch (e) {
                  alert(e.message);
                }
              }}
              className="
                flex-1 flex items-center justify-center gap-3
                px-8 py-5 rounded-2xl
                bg-white/5 hover:bg-white/10
                border border-white/10 transition-all duration-300
                font-bold text-white/80 hover:text-white
              "
            >
              <Save size={20} />
              Save As Template
            </button>

            <button
              onClick={() =>
                exportRef.current &&
                downloadGrid(exportRef.current)
              }
              className="
                flex-[1.5] flex items-center justify-center gap-3
                px-8 py-5 rounded-2xl
                bg-[var(--accent)] hover:brightness-110
                text-black font-black text-lg
                transition-all duration-300 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]
                hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.5)]
                active:scale-[0.98]
              "
            >
              <Download size={22} />
              Download Grid
            </button>
          </div>
        </div>
      </div>

      {/* SAVED TEMPLATES SECTION */}
      <div className="relative z-10 pt-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">Your Templates</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <Templates />
      </div>

      <UploadSidebar open={open} onClose={() => setOpen(false)} />
      <SelectedSkinsModal open={reorderOpen} onClose={() => setReorderOpen(false)} />
    </main>
  );
}
