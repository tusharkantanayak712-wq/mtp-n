"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ChevronDown, Check, Zap, Layers, Cpu } from "lucide-react";

interface ThemeItem {
  id: string;
  icon: string;
  label: string;
  color?: string; // Optional color preview
}

const themes: ThemeItem[] = [
  { id: "light", icon: "☀️", label: "Light" },
  { id: "dark", icon: "🌙", label: "Dark" },
  { id: "cyber", icon: "💠", label: "Cyber" },
  { id: "neon-night", icon: "🟣", label: "Neon" },
  { id: "sakura", icon: "🌸", label: "Sakura" },
  { id: "ocean", icon: "🌊", label: "Ocean" },
  { id: "forest", icon: "🍃", label: "Forest" },
  { id: "tropical", icon: "🌺", label: "Tropical" },
  { id: "ice", icon: "❄️", label: "Ice" },
  { id: "steel", icon: "🔩", label: "Steel" },
  { id: "gunmetal", icon: "🛠️", label: "Gunmetal" },
  { id: "midnightblack", icon: "🖤", label: "Midnight" },
  { id: "royalblue", icon: "👑", label: "Royal" },
  { id: "bloodiron", icon: "🩸", label: "Blood" },
  { id: "warzone", icon: "⚔️", label: "Warzone" },
  { id: "carbon", icon: "🏴", label: "Carbon" },
  { id: "rose", icon: "🌹", label: "Rose" },
  { id: "lavender", icon: "💜", label: "Lavender" },
  { id: "peach", icon: "🍑", label: "Peach" },
  { id: "cotton", icon: "🍬", label: "Cotton" },
  { id: "bubblegum", icon: "🎀", label: "Bubblegum" },
  { id: "cherry", icon: "🍒", label: "Cherry" },
  { id: "vanilla", icon: "🍦", label: "Vanilla" },
  { id: "violet", icon: "💜", label: "Violet" },
  { id: "midnight", icon: "🌪️", label: "Midnight" },
  { id: "galaxy", icon: "🌌", label: "Galaxy" },
  { id: "plasma", icon: "🧬", label: "Plasma" },
  { id: "crimson", icon: "🩸", label: "Crimson" },
  { id: "ember", icon: "🔥", label: "Ember" },
  { id: "sunset", icon: "🌅", label: "Sunset" },
  { id: "solar", icon: "🟡", label: "Solar" },
  { id: "retro", icon: "👾", label: "Retro" },
  { id: "arctic", icon: "🧊", label: "Arctic" },
  { id: "monochrome", icon: "🎭", label: "Classic" },
  { id: "aurora", icon: "🔵", label: "Aurora" },
  { id: "coffee", icon: "☕", label: "Coffee" },
  { id: "obsidian", icon: "🖤", label: "Obsidian" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load stored theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  // Change theme handler
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const currentTheme = themes.find((t) => t.id === theme) || themes[1];

  return (
    <div ref={containerRef} className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`relative flex items-center gap-2 px-1.5 py-1.5 rounded-full transition-all duration-300 group border ${open
          ? "bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
          : "bg-[var(--background)]/50 border-[var(--border)]/30 hover:border-[var(--border)] hover:bg-[var(--background)]/80"
          } backdrop-blur-md`}
        title="Change Interface Theme"
      >
        {/* ICON CONTAINER */}
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden transition-all duration-300 ${open ? "bg-[var(--accent)] text-white" : "bg-[var(--foreground)]/5 text-[var(--foreground)]"}`}>
          <motion.div
            key={theme}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-sm"
          >
            {currentTheme.icon}
          </motion.div>

          {/* SPINNING RING */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 rounded-full border border-dashed ${open ? "border-white/30" : "border-[var(--foreground)]/20"}`}
          />
        </div>

        {/* EXPANDABLE LABEL (Only on Desktop/Large) */}
        <AnimatePresence>
          <div className="hidden md:block overflow-hidden">
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`text-[10px] font-black uppercase tracking-widest italic pr-3 whitespace-nowrap ${open ? "text-[var(--accent)]" : "text-[var(--foreground)]/60"}`}
            >
              {currentTheme.label}
            </motion.span>
          </div>
        </AnimatePresence>

        {/* INDICATOR */}
        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[var(--background)] transition-colors duration-300 ${open ? "bg-[var(--accent)] animate-pulse" : "bg-emerald-500"}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* MOBILE BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[340px] md:absolute md:top-full md:left-auto md:right-0 md:translate-x-0 md:mt-3 md:w-80 bg-[var(--card)]/95 backdrop-blur-xl rounded-[24px] border border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
            >
              {/* DECORATIVE ELEMENTS */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

              {/* HEADER */}
              <div className="relative p-5 pb-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <Layers size={14} className="text-[var(--accent)]" />
                    <span className="text-xs font-[800] tracking-[0.2em] uppercase opacity-80">System Theme</span>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 uppercase tracking-widest">
                    Select
                  </div>
                </div>
              </div>

              {/* SCROLLABLE GRID */}
              <div className="px-3 pb-3 max-h-[320px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id)}
                      className={`relative group overflow-hidden flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 border ${theme === t.id
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_4px_12px_rgba(var(--accent-rgb),0.3)]"
                        : "bg-[var(--foreground)]/5 text-[var(--foreground)] border-transparent hover:bg-[var(--foreground)]/10 hover:border-[var(--border)]"
                        }`}
                    >
                      {/* HOVER GLOW */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--foreground)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="text-base relative z-10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{t.icon}</span>
                      <div className="flex flex-col items-start relative z-10 flex-1 min-w-0">
                        <span className={`text-[10px] font-[800] uppercase tracking-wide leading-none ${theme === t.id ? "text-white" : "text-[var(--foreground)]/90"}`}>
                          {t.label}
                        </span>
                        {theme === t.id && (
                          <span className="text-[8px] font-medium opacity-80 mt-0.5 flex items-center gap-1">
                            Active
                          </span>
                        )}
                      </div>

                      {theme === t.id && (
                        <div
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
      `}</style>
    </div>
  );
}
