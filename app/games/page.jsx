"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FiFilter, FiX, FiSearch, FiGrid, FiList, FiTrendingUp, FiZap, FiPackage, FiTv } from "react-icons/fi";

import GameGrid from "@/components/Games/GameGrid";
import GameList from "@/components/Games/GameList";
import FilterModal from "@/components/Games/FilterModal";
import ServiceGridSection from "@/components/Games/ServiceGridSection";
import { ProductCardSkeleton } from "@/components/Skeleton/Skeleton";

export default function GamesPage() {
  /* ================= STATE ================= */
  const [category, setCategory] = useState([]);
  const [games, setGames] = useState([]);

  const [mlbbVeriant, setMlbbVeriant] = useState([]);

  const [otts, setOtts] = useState(null);
  const [memberships, setMemberships] = useState(null);
  const [vouchers, setVouchers] = useState(null);
  const [services, setServices] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState("az");
  const [hideOOS, setHideOOS] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

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
        setMlbbVeriant(fetchedMlbbVariant);

        setOtts(json?.data?.otts || null);
        setMemberships(json?.data?.memberships || null);
        setVouchers(json?.data?.vouchers || null);
        setServices(json?.data?.services || null);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    };

    loadGames().finally(() => setLoading(false));
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
      result = result.filter((g) => {
        const name = (g.gameName || g.name || "").toLowerCase();
        return name.includes(q);
      });
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
  const processedMlbbGames = useMemo(() => processList(mlbbVeriant), [mlbbVeriant, processList]);

  const processedOtts = useMemo(() => otts?.items ? processList(otts.items) : [], [otts, processList]);
  const processedMemberships = useMemo(() => memberships?.items ? processList(memberships.items) : [], [memberships, processList]);
  const processedVouchers = useMemo(() => vouchers?.items ? processList(vouchers.items) : [], [vouchers, processList]);
  const processedServices = useMemo(() => services?.items ? processList(services.items) : [], [services, processList]);

  const isEmpty = 
    processedGames.length === 0 && 
    processedMlbbGames.length === 0 &&
    processedOtts.length === 0 &&
    processedMemberships.length === 0 &&
    processedVouchers.length === 0 &&
    processedServices.length === 0;

  /* ================= HANDLERS ================= */
  const clearFilters = () => {
    setSort("az");
    setHideOOS(false);
    setSearchQuery("");
  };

  const isMlbbGame = (game) => {
    const slug = game.gameSlug?.toLowerCase() || "";
    const name = game.gameName?.toLowerCase() || "";
    return slug.includes("mlbb") || name.includes("mlbb") || slug.includes("legends988") || slug.includes("weeklymonthly-bundle");
  };

  /* ================= RENDER COMPONENTS ================= */
  const SectionHeader = ({ title, icon: Icon, count, gradient }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-11 h-11 rounded-[0.9rem] bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xl shrink-0`}>
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic text-[var(--foreground)] leading-none mb-1.5">
          {title}
        </h2>
        <div className="flex items-center gap-2.5">
          <div className="h-1 w-8 bg-[var(--accent)] rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
          <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.15em]">
            {count} Items Found
          </span>
        </div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent ml-2" />
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-1.5 px-1.5 py-2 rounded-lg font-black uppercase tracking-tight text-[8px] sm:text-[9px] italic border
        ${activeTab === id
          ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/40 shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)]"
          : "bg-[var(--foreground)]/5 text-[var(--muted)] border-[var(--border)] hover:bg-[var(--foreground)]/10"
        }`}
    >
      <Icon size={12} className={`shrink-0 ${activeTab === id ? "fill-current" : ""}`} />
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-4 sm:py-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================= COMPACT SEARCH & CONTROLS ================= */}
        <div className="space-y-4 mb-16">
          <div className="bg-[var(--card)]/90 backdrop-blur-3xl border border-[var(--border)] rounded-[1.8rem] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-2">
            {/* SEARCH */}
            <div className="relative flex-1 group/search">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within/search:text-[var(--accent)]" size={15} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-11 pr-10 py-3 rounded-[1.2rem] bg-[var(--background)] border border-[var(--border)] focus:bg-[var(--card)] focus:border-[var(--accent)]/30 outline-none text-[10px] sm:text-xs font-black tracking-widest placeholder:text-[var(--muted)]/50 uppercase italic text-[var(--foreground)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-red-500/10 text-red-500/60 hover:text-red-500"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* ACTION GRID - COMPACT */}
            <div className="flex items-center gap-2">
              {/* VIEW TOGGLE */}
              <div className="flex p-1 rounded-xl bg-[var(--border)]/30 border border-[var(--border)]">
                {[
                  { id: "grid", icon: FiGrid },
                  { id: "list", icon: FiList },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-2 rounded-lg ${viewMode === mode.id
                      ? "bg-[var(--accent)] text-[var(--background)] shadow-lg"
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
                className={`relative flex items-center gap-2 px-3 py-3 rounded-xl font-black uppercase tracking-tight text-[9px] italic border ${activeFilterCount > 0
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--accent)]"
                  }`}
              >
                <FiFilter size={13} />
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-black rounded-md text-[8px] font-black">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* CATEGORY TABS - ULTRA COMPACT SINGLE ROW */}
          <div className="flex items-center gap-1.5 w-full">
            <TabButton id="all" label="All" icon={FiGrid} />
            <TabButton id="mlbb" label="MLBB" icon={FiZap} />
            <TabButton id="others" label="Others" icon={FiPackage} />
            <TabButton id="vouchers" label="Vouchers" icon={FiPackage} />
            <TabButton id="services" label="Services" icon={FiZap} />
          </div>
        </div>

        {/* ================= GAME CONTENT ================= */}
        <div className="space-y-20">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : isEmpty ? (
            <div key="empty" className="py-20 text-center">
              <div className="w-24 h-24 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center mx-auto mb-6">
                <FiX size={40} className="text-[var(--muted)]/30" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">No Games Found</h3>
              <p className="text-[var(--muted)] text-sm mb-8">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={clearFilters}
                className="px-8 py-4 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-widest text-xs italic"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              {/* 2. MLBB VARIANT */}
              {(activeTab === "all" || activeTab === "mlbb") && processedMlbbGames.length > 0 && (
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
              {(activeTab === "all" || activeTab === "others") && (processedGames.filter(g => activeTab !== "others" || !isMlbbGame(g)).length > 0) && (
                <div className="mb-20">
                  <SectionHeader
                    title="Full Armory"
                    icon={FiPackage}
                    count={processedGames.filter(g => activeTab !== "others" || !isMlbbGame(g)).length}
                    gradient="from-[var(--accent)] to-cyan-600"
                  />
                  {viewMode === "grid"
                    ? <GameGrid games={processedGames.filter(g => activeTab !== "others" || !isMlbbGame(g))} isOutOfStock={isOutOfStock} />
                    : <GameList games={processedGames.filter(g => activeTab !== "others" || !isMlbbGame(g))} isOutOfStock={isOutOfStock} />
                  }
                </div>
              )}

              {/* 6. VOUCHERS SECTION */}
              {(activeTab === "all" || activeTab === "vouchers") && processedVouchers.length > 0 && (
                <div className="mb-10 border-t border-[var(--border)] pt-10">
                  <SectionHeader
                    title="Premium Vouchers"
                    icon={FiPackage}
                    count={processedVouchers.length}
                    gradient="from-amber-400 to-orange-600"
                  />
                  <ServiceGridSection
                    title={null}
                    total={processedVouchers.length}
                    items={processedVouchers}
                    hrefPrefix="/games"
                  />
                </div>
              )}

              {/* 7. SERVICES SECTION */}
              {(activeTab === "all" || activeTab === "services") && processedServices.length > 0 && (
                <div className="mb-10 border-t border-[var(--border)] pt-10">
                  <SectionHeader
                    title="Premium Services"
                    icon={FiZap}
                    count={processedServices.length}
                    gradient="from-blue-400 to-indigo-600"
                  />
                  <ServiceGridSection
                    title={null}
                    total={processedServices.length}
                    items={processedServices}
                    hrefPrefix="/games"
                  />
                </div>
              )}
            </div>
          )}
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
