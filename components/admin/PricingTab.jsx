"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent,
  Coins,
  Settings2,
  Trash2,
  RefreshCcw,
  Gamepad2,
  Save,
  ChevronDown,
  Info,
  Shield,
  IndianRupee,
  Loader2,
  Package
} from "lucide-react";
import { FiSearch, FiRefreshCw, FiPlus, FiTrash2 } from "react-icons/fi";

const API_BASE = "https://game-off-ten.vercel.app/api/v1";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  overrides,
  setOverrides,
  gameConfigs,
  setGameConfigs,
  savingPricing,
  onSave,
}) {
  const [pricingMode, setPricingMode] = useState("percent");
  const [games, setGames] = useState([]);
  const [itemsByGame, setItemsByGame] = useState({});
  const [fixedGameFilter, setFixedGameFilter] = useState("");
  const [gameSearch, setGameSearch] = useState("");
  const [fixedItemFilter, setFixedItemFilter] = useState("");
  const [loadingFixedPrices, setLoadingFixedPrices] = useState(false);
  const [bulkPercent, setBulkPercent] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);



  const filteredGames = useMemo(() => {
    return games.filter(g => 
      g.gameName.toLowerCase().includes(gameSearch.toLowerCase()) || 
      g.gameSlug.toLowerCase().includes(gameSearch.toLowerCase())
    );
  }, [games, gameSearch]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/games/list`);
        const json = await res.json();
        if (json.success) setGames(json.data.games);
      } catch (e) {
        console.error("Game fetch failed", e);
      }
    })();
  }, []);

  const fetchItemsForGame = async (gameSlug) => {
    if (!gameSlug) return [];
    if (itemsByGame[gameSlug]) return itemsByGame[gameSlug];

    try {
      const res = await fetch(`${API_BASE}/games/${gameSlug}/items`);
      const json = await res.json();
      if (json.success) {
        let items = json.data.items || [];

        /* ================= INJECT COMBO OFFERS (ADMIN) ================= */
        const weeklyPass = items.find((i) => i.itemSlug === "weekly-pass816");
        if (weeklyPass) {
          const combos = [
            { multiplier: 2, label: "2x" },
            { multiplier: 3, label: "3x" },
          ];

          combos.forEach((combo) => {
            const comboSlug = `${weeklyPass.itemSlug}-${combo.multiplier}x`;
            if (!items.find((i) => i.itemSlug === comboSlug)) {
              items.push({
                ...weeklyPass,
                itemName: `${combo.label} ${weeklyPass.itemName}`,
                itemSlug: comboSlug,
                sellingPrice: Number(weeklyPass.sellingPrice) * combo.multiplier,
                index: weeklyPass.index + combo.multiplier * 0.1,
              });
            }
          });
          items.sort((a, b) => (Number(a.sellingPrice) || 0) - (Number(b.sellingPrice) || 0));
        }

        setItemsByGame((p) => ({ ...p, [gameSlug]: items }));
        return items;
      }
    } catch (e) {
      console.error("Item fetch failed", e);
    }
    return [];
  };

  const hydrateFixedPricing = async (gameSlug) => {
    if (!gameSlug) return;
    setLoadingFixedPrices(true);
    try {
      await fetchItemsForGame(gameSlug);
      setFixedItemFilter("");
    } finally {
      setLoadingFixedPrices(false);
    }
  };

  useEffect(() => {
    if (pricingMode !== "fixed") return;
    if (!fixedGameFilter) return;
    hydrateFixedPricing(fixedGameFilter);
  }, [pricingMode, pricingType, fixedGameFilter]);

  const visibleOverrides = useMemo(() => {
    if (!fixedGameFilter) return [];
    const items = itemsByGame[fixedGameFilter] || [];
    
    return items.map(item => {
      const override = overrides.find(o => o.gameSlug === fixedGameFilter && o.itemSlug === item.itemSlug);
      return {
        gameSlug: fixedGameFilter,
        itemSlug: item.itemSlug,
        itemName: item.itemName,
        fixedPrice: override?.fixedPrice ?? Number(item.sellingPrice) ?? 0,
        isEnabled: override?.isEnabled ?? false,
        isOutOfStock: override?.isOutOfStock ?? false,
      };
    }).filter(o => {
      if (fixedItemFilter && o.itemSlug !== fixedItemFilter) return false;
      return true;
    });
  }, [overrides, fixedGameFilter, fixedItemFilter, itemsByGame]);

  const updateOverrideState = (itemSlug, updates) => {
    setOverrides(prev => {
      const idx = prev.findIndex(o => o.gameSlug === fixedGameFilter && o.itemSlug === itemSlug);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...updates };
        // Optional: filter out if both are false/default? 
        // But let's keep it simple for now, the user wants to save what they edit.
        return next;
      } else {
        const item = itemsByGame[fixedGameFilter]?.find(i => i.itemSlug === itemSlug);
        return [...prev, {
          gameSlug: fixedGameFilter,
          itemSlug,
          itemName: item?.itemName || itemSlug,
          fixedPrice: updates.fixedPrice ?? Number(item?.sellingPrice) ?? 0,
          isEnabled: updates.isEnabled ?? false,
          isOutOfStock: updates.isOutOfStock ?? false,
        }];
      }
    });
  };

  const updateOverridePrice = (itemSlug, value) => {
    updateOverrideState(itemSlug, { fixedPrice: Math.max(0, Number(value) || 0) });
  };

  const toggleOverrideStatus = (itemSlug) => {
    const current = visibleOverrides.find(o => o.itemSlug === itemSlug);
    updateOverrideState(itemSlug, { isEnabled: !current?.isEnabled });
  };

  const toggleItemStock = (itemSlug) => {
    const current = visibleOverrides.find(o => o.itemSlug === itemSlug);
    updateOverrideState(itemSlug, { isOutOfStock: !current?.isOutOfStock });
  };

  const toggleGameStock = (gameSlug) => {
    setGameConfigs(prev => {
      const existing = prev.find(g => g.gameSlug === gameSlug);
      if (existing) {
        return prev.map(g => g.gameSlug === gameSlug ? { ...g, isOutOfStock: !g.isOutOfStock } : g);
      }
      return [...prev, { gameSlug, isOutOfStock: true }];
    });
  };

  const applyBulkPercentage = () => {
    const percent = Number(bulkPercent);
    if (!Number.isFinite(percent) || percent === 0) return;
    const multiplier = 1 + percent / 100;
    const next = overrides.map((o) => {
      if ((fixedGameFilter && o.gameSlug !== fixedGameFilter) || (fixedItemFilter && o.itemSlug !== fixedItemFilter)) {
        return o;
      }
      return { ...o, fixedPrice: Math.round(o.fixedPrice * multiplier) };
    });
    setOverrides(next);
    setBulkPercent("");
  };

  const updateSlab = (i, key, value) => {
    const next = [...slabs];
    next[i][key] = Math.max(0, Number(value) || 0);
    setSlabs(next);
  };

  const addSlab = () => setSlabs([...slabs, { min: 0, max: 0, percent: 0 }]);
  const deleteSlab = (i) => setSlabs(slabs.filter((_, idx) => idx !== i));
  const canSave = !savingPricing && ((pricingMode === "percent" && slabs.length) || (pricingMode === "fixed" && overrides.length));

  return (
    <div className="space-y-6 pb-20 max-w-full overflow-x-hidden">
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Pricing <span className="text-[var(--accent)]">Config</span></h2>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest opacity-50">Manage profit margins and fixed item prices</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)]">
            {[{ id: "percent", label: "Markup", icon: <Percent size={12} /> }, { id: "fixed", label: "Fixed", icon: <Coins size={12} /> }].map((m) => (
              <button
                key={m.id}
                onClick={() => setPricingMode(m.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${pricingMode === m.id
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/10"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-[var(--border)] opacity-30" />

          {/* Role Switcher */}
          <div className="flex bg-[var(--foreground)]/[0.03] p-1 rounded-xl border border-[var(--border)]">
            {["user", "member", "admin"].map((type) => (
              <button
                key={type}
                onClick={() => setPricingType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${pricingType === type
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={onSave}
            disabled={!canSave || savingPricing}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              canSave 
                ? "bg-[var(--accent)] text-white shadow-xl shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] hover:brightness-110" 
                : "bg-[var(--foreground)]/[0.05] text-[var(--muted)]/40 cursor-not-allowed"
            }`}
          >
            {savingPricing ? (
              <div className="flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                <span>Saving...</span>
              </div>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* ================= LEFT SIDEBAR (GAMES) ================= */}
        {pricingMode === "fixed" && (
          <div className="w-full lg:w-72 flex flex-col gap-4">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Games</h3>
                <Gamepad2 size={14} className="text-[var(--accent)]" />
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]/40 text-xs" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  className="w-full bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)]/40 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-none space-y-1 p-1 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 custom-scrollbar">
              {filteredGames.map((g) => (
                <button
                  key={g.gameSlug}
                  onClick={() => setFixedGameFilter(g.gameSlug)}
                  className={`w-full group relative flex items-center justify-between p-3 rounded-xl transition-all ${
                    fixedGameFilter === g.gameSlug
                      ? "bg-[var(--accent)]/10 border border-[var(--accent)]/20 shadow-lg shadow-[var(--accent)]/5"
                      : "hover:bg-[var(--foreground)]/[0.03] border border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-start min-w-0">
                    <span className={`text-xs font-black uppercase tracking-tight truncate ${fixedGameFilter === g.gameSlug ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                      {g.gameName}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]/40 truncate">{g.gameSlug}</span>
                  </div>

                  {/* GAME STOCK TOGGLE */}
                  <div className="flex flex-col items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGameStock(g.gameSlug);
                      }}
                      title="Stock Status"
                      className={`w-8 h-4 rounded-full transition-all flex items-center px-0.5 ${
                        gameConfigs.find(gc => gc.gameSlug === g.gameSlug)?.isOutOfStock 
                          ? "bg-rose-500 shadow-sm shadow-rose-500/20" 
                          : "bg-emerald-500/20 border border-emerald-500/30"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white transition-all ${
                        gameConfigs.find(gc => gc.gameSlug === g.gameSlug)?.isOutOfStock ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                    <span className={`text-[6px] font-black uppercase ${gameConfigs.find(gc => gc.gameSlug === g.gameSlug)?.isOutOfStock ? "text-rose-500" : "text-emerald-500/40"}`}>
                      {gameConfigs.find(gc => gc.gameSlug === g.gameSlug)?.isOutOfStock ? "OOS" : "Stock"}
                    </span>
                  </div>
                </button>
              ))}
              {filteredGames.length === 0 && (
                <div className="py-10 text-center opacity-30">
                  <p className="text-[10px] font-bold uppercase tracking-widest">No games found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {pricingMode === "percent" ? (
              <motion.div
                key="markup-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-inner">
                        <Percent size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">Profit <span className="text-[var(--accent)]">Markup</span></h3>
                        <p className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest opacity-50">Set percentage profit based on price ranges</p>
                      </div>
                    </div>
                    <button
                      onClick={addSlab}
                      className="px-4 py-2 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all"
                    >
                      + Add Range
                    </button>
                  </div>
                <div className="space-y-2">
                  <div className="hidden sm:grid grid-cols-12 gap-3 px-2 text-[10px] font-bold text-[var(--muted)]">
                    <div className="col-span-4">Minimum Price (₹)</div>
                    <div className="col-span-4">Maximum Price (₹)</div>
                    <div className="col-span-3">Add Profit (%)</div>
                    <div className="col-span-1"></div>
                  </div>

                  {slabs.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center p-3 sm:p-3.5 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.01] hover:bg-[var(--foreground)]/[0.03] transition-colors"
                    >
                      <div className="col-span-4 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Minimum Price (₹)</label>
                        <input
                          type="number"
                          value={s.min}
                          onChange={(e) => updateSlab(i, "min", e.target.value)}
                          className="w-full h-10 px-4 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--accent)]/50 transition-all font-mono"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-4 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Maximum Price (₹)</label>
                        <input
                          type="number"
                          value={s.max}
                          onChange={(e) => updateSlab(i, "max", e.target.value)}
                          className="w-full h-10 px-4 rounded-xl bg-[var(--foreground)]/[0.03] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--accent)]/50 transition-all font-mono"
                          placeholder="1000"
                        />
                      </div>
                      <div className="col-span-3 space-y-1 sm:space-y-0">
                        <label className="sm:hidden text-[10px] font-bold text-[var(--muted)] ml-1">Profit (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={s.percent}
                            onChange={(e) => updateSlab(i, "percent", e.target.value)}
                            className="w-full h-10 px-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] font-bold text-sm outline-none transition-all placeholder:text-[var(--accent)]/40"
                            placeholder="5"
                          />
                          <Percent size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent)]/50" />
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end sm:justify-center">
                        <button
                          onClick={() => deleteSlab(i)}
                          className="p-2 sm:p-0 text-[var(--muted)] hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {!slabs.length && (
                    <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-2xl">
                      <p className="text-xs font-medium text-[var(--muted)]">No markup ranges defined.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            ) : (
              <motion.div
                key="fixed"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="space-y-4"
              >
                {/* ITEMS GRID */}

                {/* ITEMS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <AnimatePresence>
                    {loadingFixedPrices ? (
                      <div className="col-span-full py-16 flex flex-col items-center justify-center opacity-40">
                        <Loader2 size={28} className="animate-spin text-[var(--accent)] mb-3" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Fetching Prices...</p>
                      </div>
                    ) : (
                      visibleOverrides.map((o, idx) => (
                        <motion.div
                          key={o.itemSlug}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.01 }}
                          className={`p-5 rounded-3xl border transition-all ${
                            o.isEnabled 
                              ? "border-[var(--accent)]/20 bg-[#1e293b]/40 shadow-xl" 
                              : "border-[var(--border)] bg-[#1e293b]/20 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="min-w-0">
                              <p className="text-[11px] font-[900] italic uppercase tracking-tighter text-white truncate">{o.itemName || o.itemSlug}</p>
                              <p className="text-[9px] font-mono text-[var(--muted)]/40 truncate">{o.itemSlug}</p>
                            </div>
                            
                            {/* STOCK TOGGLE */}
                            <div className="flex flex-col items-end gap-1.5 pr-2 border-r border-white/5">
                              <button
                                onClick={() => toggleItemStock(o.itemSlug)}
                                className={`relative w-11 h-6 rounded-full transition-colors outline-none ${
                                  o.isOutOfStock ? "bg-rose-500 shadow-lg shadow-rose-500/20" : "bg-emerald-500/20 border border-emerald-500/30"
                                }`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                                  o.isOutOfStock ? "left-6" : "left-1"
                                }`} />
                              </button>
                              <span className={`text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${o.isOutOfStock ? "text-rose-500" : "text-emerald-500/40"}`}>
                                {o.isOutOfStock ? "Out of Stock" : "In Stock"}
                              </span>
                            </div>

                            {/* TOGGLE SWITCH */}
                            <div className="flex flex-col items-end gap-1.5 pl-2">
                              <button
                                onClick={() => toggleOverrideStatus(o.itemSlug)}
                                className={`relative w-11 h-6 rounded-full transition-colors outline-none ${
                                  o.isEnabled ? "bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/20" : "bg-[#334155]"
                                }`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
                                  o.isEnabled ? "left-6" : "left-1"
                                }`} />
                              </button>
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]/40 whitespace-nowrap">Use override</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Selling Price (INR)</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={o.fixedPrice}
                                disabled={!o.isEnabled}
                                onChange={(e) => updateOverridePrice(o.itemSlug, e.target.value)}
                                className={`w-full h-11 px-4 rounded-xl border text-white font-black text-sm tabular-nums outline-none transition-all ${
                                  o.isEnabled 
                                    ? "bg-[#0f172a] border-white/5 focus:border-[var(--accent)]/40 shadow-inner" 
                                    : "bg-black/20 border-white/5 cursor-not-allowed"
                                }`}
                                placeholder="0"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            {o.isEnabled ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-500/80 uppercase tracking-tighter">Override Active</span>
                              </div>
                            ) : <div />}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
