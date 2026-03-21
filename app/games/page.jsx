"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiSearch, FiGrid, FiList, FiTrendingUp, FiZap, FiPackage } from "react-icons/fi";

import GameGrid from "@/components/Games/GameGrid";
import GameList from "@/components/Games/GameList";
import FilterModal from "@/components/Games/FilterModal";
import ServiceGridSection from "@/components/Games/ServiceGridSection";

export default function GamesPage() {
  /* ================= STATE ================= */
  const [category, setCategory] = useState([]);
  const [games, setGames] = useState([]);

  const [featuredGames, setFeaturedGames] = useState([]);
  const [mlbbVeriant, setMlbbVeriant] = useState([]);

  const [otts, setOtts] = useState(null);
  const [memberships, setMemberships] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState("az");
  const [hideOOS, setHideOOS] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= CONFIG ================= */
  const WEEKLY_PASS_SLUG = "mobile-legends988";

  const outOfStockGames = [
    "mobile-legends-backup826"
  ];

  const outOfStockSet = useMemo(() => new Set(outOfStockGames), []);

  const isOutOfStock = useCallback(
    (name) => outOfStockSet.has(name),
    [outOfStockSet]
  );

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;

    const loadGames = async () => {
      try {
        const res = await fetch("/api/games");
        const json = await res.json();
        if (!mounted) return;

        let fetchedGames = json?.data?.games || [];
        let fetchedFeatured = json?.data?.featuredGames || [];
        let fetchedMlbbVariant = json?.data?.mlbbVariants || [];

        // Duplicate Weekly Pass (same slug)
        const weeklyPassSource = fetchedGames.find(
          (g) => g.gameSlug === WEEKLY_PASS_SLUG
        );

        if (weeklyPassSource) {
          const alreadyExists = fetchedGames.some(
            (g) =>
              g.gameSlug === WEEKLY_PASS_SLUG &&
              g.gameName === "Weekly Pass",
          );

          if (!alreadyExists) {
            fetchedGames.push({
              ...weeklyPassSource,
              gameName: "Weekly Pass",
              _variant: "weekly-pass",
              gameImageId: {
                image: "/game-assets/weeklypass.jpg",
              },
            });
          }
        }

        setCategory(json?.data?.category || []);
        setGames(fetchedGames);
        setFeaturedGames(fetchedFeatured);
        setMlbbVeriant(fetchedMlbbVariant);

        setOtts(json?.data?.otts || null);
        setMemberships(json?.data?.memberships || null);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    };

    loadGames();
    return () => (mounted = false);
  }, []);

  /* ================= FILTER COUNT ================= */
  const activeFilterCount =
    (sort !== "az" ? 1 : 0) + (hideOOS ? 1 : 0);

  /* ================= PROCESSING ================= */
  const processList = useCallback((list) => {
    let result = [...list];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((g) => g.gameName.toLowerCase().includes(q));
    }
    if (hideOOS) {
      result = result.filter((g) => !isOutOfStock(g.gameName));
    }
    if (sort === "az") {
      result.sort((a, b) => a.gameName.localeCompare(b.gameName));
    } else if (sort === "za") {
      result.sort((a, b) => b.gameName.localeCompare(a.gameName));
    }
    return result;
  }, [searchQuery, hideOOS, sort, isOutOfStock]);

  const processedGames = useMemo(() => processList(games), [games, processList]);
  const processedFeaturedGames = useMemo(() => processList(featuredGames), [featuredGames, processList]);
  const processedMlbbGames = useMemo(() => processList(mlbbVeriant), [mlbbVeriant, processList]);

  const isEmpty = processedGames.length === 0 && processedFeaturedGames.length === 0 && processedMlbbGames.length === 0;

  /* ================= HANDLERS ================= */
  const clearFilters = () => {
    setSort("az");
    setHideOOS(false);
    setSearchQuery("");
  };

  /* ================= RENDER COMPONENTS ================= */
  const SectionHeader = ({ title, icon: Icon, count, gradient }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
            {count} Items Found
          </span>
        </div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================= COMPACT SEARCH & CONTROLS ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-4 z-50 mb-10 group"
        >
          <div className="bg-[var(--card)]/60 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] p-2 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col md:flex-row gap-2 transition-all group-hover:border-[var(--accent)]/20">
            {/* SEARCH */}
            <div className="relative flex-1 group/search">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within/search:text-[var(--accent)] transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Armory..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[var(--background)]/40 border border-transparent focus:bg-[var(--background)]/80 focus:border-[var(--accent)]/30 outline-none text-xs font-bold tracking-wide transition-all placeholder:text-[var(--muted)]/40"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5 text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    <FiX size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION GRID */}
            <div className="flex items-center gap-2">
              {/* VIEW TOGGLE */}
              <div className="flex p-1 rounded-xl bg-[var(--background)]/40 border border-white/5">
                {[
                  { id: "grid", icon: FiGrid },
                  { id: "list", icon: FiList },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-2 rounded-lg transition-all ${viewMode === mode.id
                      ? "bg-[var(--accent)] text-black shadow-lg"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                  >
                    <mode.icon size={14} />
                  </button>
                ))}
              </div>

              {/* FILTER BUTTON */}
              <button
                onClick={() => setShowFilter(true)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] italic border transition-all ${activeFilterCount > 0
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]"
                  : "border-white/5 bg-[var(--background)]/40 text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
                  }`}
              >
                <FiFilter size={12} className={activeFilterCount > 0 ? "animate-pulse" : ""} />
                <span className="hidden sm:inline">Advanced</span> Filter
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-black rounded-full text-[8px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= GAME CONTENT ================= */}
        <div className="space-y-20">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <div className="w-24 h-24 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiX size={40} className="text-[var(--muted)]/30" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">No Games Found</h3>
                <p className="text-[var(--muted)] text-sm mb-8">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-widest text-xs italic hover:scale-105 transition-transform"
                >
                  Reset All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* 1. FEATURED */}
                {processedFeaturedGames.length > 0 && (
                  <div className="mb-20">
                    <SectionHeader
                      title="Elite Picks"
                      icon={FiTrendingUp}
                      count={processedFeaturedGames.length}
                      gradient="from-yellow-400 to-orange-600"
                    />
                    {viewMode === "grid"
                      ? <GameGrid games={processedFeaturedGames} isOutOfStock={isOutOfStock} />
                      : <GameList games={processedFeaturedGames} isOutOfStock={isOutOfStock} />
                    }
                  </div>
                )}

                {/* 2. MLBB VARIANT */}
                {processedMlbbGames.length > 0 && (
                  <div className="mb-20">
                    <SectionHeader
                      title="MLBB Special"
                      icon={FiZap}
                      count={processedMlbbGames.length}
                      gradient="from-blue-500 to-indigo-600"
                    />
                    {viewMode === "grid"
                      ? <GameGrid games={processedMlbbGames} isOutOfStock={isOutOfStock} />
                      : <GameList games={processedMlbbGames} isOutOfStock={isOutOfStock} />
                    }
                  </div>
                )}

                {/* 3. ALL GAMES */}
                {processedGames.length > 0 && (
                  <div className="mb-20">
                    <SectionHeader
                      title="Full Armory"
                      icon={FiPackage}
                      count={processedGames.length}
                      gradient="from-[var(--accent)] to-purple-600"
                    />
                    {viewMode === "grid"
                      ? <GameGrid games={processedGames} isOutOfStock={isOutOfStock} />
                      : <GameList games={processedGames} isOutOfStock={isOutOfStock} />
                    }
                  </div>
                )}

                {/* 4. OTT SECTION */}
                {otts?.items?.length > 0 && !searchQuery && (
                  <div className="mb-10 border-t border-[var(--border)] pt-10">
                    <ServiceGridSection
                      title={otts.title}
                      total={otts.total}
                      items={otts.items}
                      hrefPrefix="/games/ott"
                    />
                  </div>
                )}

                {/* 5. MEMBERSHIP SECTION */}
                {memberships?.items?.length > 0 && !searchQuery && (
                  <div className="mb-10 border-t border-[var(--border)] pt-10">
                    <ServiceGridSection
                      title={memberships.title}
                      total={memberships.total}
                      items={memberships.items}
                      hrefPrefix="/games/membership"
                      showCategory={false}
                      ctaText="Join the Elite →"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FILTER MODAL */}
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        sort={sort}
        setSort={setSort}
        hideOOS={hideOOS}
        setHideOOS={setHideOOS}
      />
    </main>
  );
}
