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
    <div ref={containerRef} className="relative inline-block text-left">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 group ${open ? "bg-[var(--accent)]/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" : "bg-[var(--foreground)]/5"
          }`}
        title="Change Interface Theme"
      >
        {/* INNER GLOW */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"} bg-gradient-to-tr from-[var(--accent)]/20 to-transparent blur-[4px]`}></div>

        {/* ICON */}
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10"
        >
          <Palette size={18} className={`${open ? "text-[var(--accent)]" : "text-[var(--foreground)]/60"} transition-colors duration-300`} />
        </motion.div>

        {/* STATUS DOT */}
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--accent)] border-2 border-[var(--background)] shadow-[0_0_8px_var(--accent)] scale-75"></div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.95, rotateX: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-4 w-72 bg-[var(--card)]/80 backdrop-blur-2xl rounded-3xl border border-[var(--border)] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[1001] origin-top-right overflow-hidden perspective-1000"
          >
            {/* HUD OVERLAYS */}
            <div className="absolute inset-0 pointer-events-none">
              {/* SCANLINES */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_3px] opacity-30"></div>
              {/* CORNER BRACKETS */}
              <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-[var(--accent)]/30"></div>
              <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-[var(--accent)]/30"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-[var(--accent)]/30"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-[var(--accent)]/30"></div>
            </div>

            {/* HEADER */}
            <div className="relative p-4 border-b border-[var(--border)] bg-[var(--accent)]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-[var(--accent)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] italic text-[var(--accent)]">
                    Theme Selector
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/20"></div>
                </div>
              </div>
            </div>

            {/* GRID CONTAINER */}
            <div className="relative max-h-[400px] overflow-y-auto custom-scrollbar p-3 pt-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.02 } }
                }}
                className="grid grid-cols-2 gap-2"
              >
                {themes.map((t) => (
                  <motion.button
                    key={t.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => changeTheme(t.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[10px] transition-all duration-300 border group ${theme === t.id
                        ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] shadow-[inset_0_0_15px_rgba(var(--accent-rgb),0.1)]"
                        : "bg-[var(--foreground)]/5 border-transparent hover:border-[var(--border)] text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                      }`}
                  >
                    <div className={`flex items-center justify-center p-1 rounded-lg transition-colors ${theme === t.id ? "bg-[var(--accent)]/20" : "bg-[var(--background)]/40"
                      }`}>
                      <span className="text-sm group-hover:scale-125 transition-transform duration-500">
                        {t.icon}
                      </span>
                    </div>
                    <span className="flex-1 text-left font-black uppercase tracking-widest italic truncate transition-all group-hover:tracking-[0.1em]">
                      {t.label}
                    </span>
                    {theme === t.id && (
                      <motion.div
                        layoutId="active-check"
                        className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* FOOTER */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--foreground)]/5 flex justify-center">
              <p className="text-[7px] font-medium text-[var(--muted)] uppercase tracking-[0.3em] opacity-40">
                Interface Uplink Active
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 20px;
          opacity: 0.3;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
      `}</style>
    </div>
  );
}
