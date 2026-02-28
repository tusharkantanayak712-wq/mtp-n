"use client";

import { useStore } from "@/store/useStore";
import { skins, SKIN_CATEGORIES } from "@/data/skins";
import { X, LayoutGrid, ListFilter } from "lucide-react";
import { Reorder, motion, AnimatePresence } from "framer-motion";

export default function SelectedSkinsModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { selectedSkins, reorderSkins, toggleSkin } = useStore();

    /* 💎 Auto Sequence Logic (By Rarity Priority) */
    const autoSequence = () => {
        const list = [...selectedSkins].map((id) => skins.find((s) => s.id === id)).filter(Boolean);

        // Sort by rarity (Legend -> Common)
        const sorted = list.sort((a, b) => {
            const pA = SKIN_CATEGORIES.indexOf(a!.category);
            const pB = SKIN_CATEGORIES.indexOf(b!.category);
            return pA - pB;
        });

        reorderSkins(sorted.map((s) => s!.id));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[2002] flex items-center justify-center p-4">
            {/* OVERLAY */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* MODAL (Replicating Screenshot Layout) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="
          relative w-full max-w-4xl h-[85vh] 
          bg-[#0f1118] border border-white/5 rounded-2xl 
          flex flex-col shadow-2xl overflow-hidden
        "
                onClick={(e) => e.stopPropagation()}
            >
                {/* TOP BAR (Header Section from Screenshot) */}
                <div className="p-6 bg-[#1a1f2e] border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#e5e5e5] tracking-tight">
                        Selected Skins ({selectedSkins.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#6366f1] hover:bg-[#5850ec] text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Close
                    </button>
                </div>

                {/* SUB-HEADER LABELS (From Screenshot) */}
                <div className="px-6 py-4 flex justify-between text-[11px] font-bold uppercase tracking-wider text-white/30">
                    <div>Drag inside box to reorder</div>
                    <div>Drag outside box to remove</div>
                </div>

                {/* CONTROLS (Auto Sequence) */}
                <div className="px-6 pb-4">
                    <button
                        onClick={autoSequence}
                        className="
              flex items-center gap-2.5 px-6 py-3
              bg-white/5 hover:bg-white/10 border border-white/10
              text-[var(--accent)] rounded-xl transition-all duration-300
              font-bold text-sm group
            "
                    >
                        <ListFilter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        Auto Sequence (By Priority/Rarity)
                    </button>
                </div>

                {/* GRID CONTENT (DRAG & DROP AREA) */}
                <div className="flex-1 overflow-y-auto px-6 pb-12 custom-scrollbar">
                    <div className="bg-[#161b2a]/50 border border-indigo-500/20 rounded-[2rem] p-8 min-h-full">
                        <Reorder.Group
                            axis="y"
                            values={selectedSkins}
                            onReorder={reorderSkins}
                            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"
                        >
                            <AnimatePresence>
                                {selectedSkins.map((id) => {
                                    const skin = skins.find((s) => s.id === id);
                                    if (!skin) return null;

                                    return (
                                        <Reorder.Item
                                            key={id}
                                            value={id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            whileDrag={{ scale: 1.1, zIndex: 50 }}
                                            className="
                        relative group aspect-[4/5] cursor-grab active:cursor-grabbing
                        rounded-xl overflow-hidden border border-white/10 bg-[#1e2536]
                        hover:border-[var(--accent)]/50 transition-colors
                      "
                                        >
                                            <img
                                                src={skin.image}
                                                alt={skin.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* RARITY INDICATOR */}
                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[7px] font-black uppercase tracking-widest text-white/90">
                                                {skin.category}
                                            </div>

                                            {/* QUICK REMOVE BUTTON */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSkin(id);
                                                }}
                                                className="
                          absolute top-2 right-2 p-1.5
                          bg-red-500/80 hover:bg-red-500 
                          text-white rounded-lg opacity-0 group-hover:opacity-100 
                          transition-all duration-300 scale-75 group-hover:scale-100
                        "
                                            >
                                                <X size={14} />
                                            </button>

                                            {/* ITEM LABEL */}
                                            <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 to-transparent">
                                                <p className="text-[10px] font-bold text-white truncate leading-tight">{skin.hero}</p>
                                                <p className="text-[8px] font-medium text-white/40 truncate tracking-tight">{skin.name}</p>
                                            </div>
                                        </Reorder.Item>
                                    );
                                })}
                            </AnimatePresence>
                        </Reorder.Group>

                        {/* NO SELECTION STATE */}
                        {selectedSkins.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-20 text-white/10">
                                <LayoutGrid size={48} className="mb-4" />
                                <p className="font-bold text-lg">Empty Grid</p>
                                <p className="text-sm">Select skins from the library to organize them here</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
