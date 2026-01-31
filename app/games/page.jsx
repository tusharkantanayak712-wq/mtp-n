"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from "react-icons/fi";

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
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= CONFIG ================= */
  const SPECIAL_MLBB_GAME = "MLBB SMALL";
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

        console.log("Fetched Games:", fetchedGames);

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
                image:
                  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536006/WhatsApp_Image_2026-01-16_at_08.50.36_tviv2b.jpg",
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

  /* ================= GLOBAL GAME PROCESSING ================= */
  const processedGames = useMemo(() => {
    let list = [...games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) =>
        g.gameName.toLowerCase().includes(q)
      );
    }

    if (hideOOS) {
      list = list.filter((g) => !isOutOfStock(g.gameName));
    }

    if (sort === "az") {
      list.sort((a, b) =>
        a.gameName.localeCompare(b.gameName)
      );
    } else if (sort === "za") {
      list.sort((a, b) =>
        b.gameName.localeCompare(a.gameName)
      );
    }

    return list;
  }, [games, searchQuery, hideOOS, sort, isOutOfStock]);

  /* ================= CATEGORY PROCESSING ================= */
  const processedFeaturedGames = useMemo(() => {
    let list = [...featuredGames];

    if (hideOOS) {
      list = list.filter((g) => !isOutOfStock(g.gameName));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) =>
        g.gameName.toLowerCase().includes(q)
      );
    }

    if (sort === "az") {
      list.sort((a, b) => a.gameName.localeCompare(b.gameName));
    } else if (sort === "za") {
      list.sort((a, b) => b.gameName.localeCompare(a.gameName));
    }

    return list;
  }, [featuredGames, hideOOS, sort, isOutOfStock, searchQuery]);

  const processedMlbbGames = useMemo(() => {
    let list = [...mlbbVeriant];

    if (hideOOS) {
      list = list.filter((g) => !isOutOfStock(g.gameName));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) =>
        g.gameName.toLowerCase().includes(q)
      );
    }

    if (sort === "az") {
      list.sort((a, b) => a.gameName.localeCompare(b.gameName));
    } else if (sort === "za") {
      list.sort((a, b) => b.gameName.localeCompare(a.gameName));
    }

    return list;
  }, [mlbbVeriant, hideOOS, sort, isOutOfStock, searchQuery]);

  /* ================= HANDLERS ================= */
  const clearFilters = () => {
    setSort("az");
    setHideOOS(false);
  };

  /* ================= RENDER ================= */
  return (
    <section className="min-h-screen px-4 py-7 bg-[var(--background)] text-[var(--foreground)]">
      {/* ================= TOP BAR ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 px-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* ================= SEARCH (65%) ================= */}
          <div className="relative w-full sm:w-[65%]">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2
              text-[var(--muted)] text-sm"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="
                w-full
                pl-10 pr-4 py-2.5
                rounded-xl
                bg-[var(--card)]
                border border-[var(--border)]
                text-sm
                transition
                focus:outline-none
                focus:border-[var(--accent)]
                focus:ring-2 focus:ring-[var(--accent)]/20
              "
            />
          </div>

          {/* ================= CONTROLS (35%) ================= */}
          <div className="flex w-full sm:w-[35%] justify-end gap-2">
            {/* GRID / LIST TOGGLE */}
            <div
              className="flex p-1 rounded-xl
              bg-[var(--card)]
              border border-[var(--border)]"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition
                  ${viewMode === "grid"
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <FiGrid size={16} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition
                  ${viewMode === "list"
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                <FiList size={16} />
              </motion.button>
            </div>

            {/* CLEAR FILTER */}
            {activeFilterCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="
                  p-2 rounded-xl
                  border border-red-500/40
                  text-red-400
                  hover:bg-red-500/10
                  transition
                "
                title="Clear filters"
              >
                <FiX size={16} />
              </motion.button>
            )}

            {/* FILTER BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(true)}
              className="
                relative p-2.5 rounded-xl
                border border-[var(--border)]
                bg-[var(--card)]
                hover:border-[var(--accent)]
                transition
              "
              title="Filters"
            >
              <FiFilter size={16} />

              {activeFilterCount > 0 && (
                <span
                  className="
                    absolute -top-1.5 -right-1.5
                    min-w-[18px] h-[18px]
                    flex items-center justify-center
                    text-[10px]
                    bg-[var(--accent)]
                    text-white
                    rounded-full
                    px-1
                  "
                >
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ================= FEATURED GAMES ================= */}
      {processedFeaturedGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto mb-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Featured Games</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
            <span className="text-sm text-[var(--muted)]">
              {processedFeaturedGames.length}
            </span>
          </div>

          {viewMode === "grid" ? (
            <GameGrid
              games={processedFeaturedGames}
              isOutOfStock={isOutOfStock}
            />
          ) : (
            <GameList
              games={processedFeaturedGames}
              isOutOfStock={isOutOfStock}
            />
          )}
        </motion.div>
      )}

      {/* ================= MLBB VARIANT ================= */}
      {processedMlbbGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto mb-14"
        >
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">MLBB Variant</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
            <span className="text-sm text-[var(--muted)]">
              {processedMlbbGames.length}
            </span>
          </div>

          {viewMode === "grid" ? (
            <GameGrid
              games={processedMlbbGames}
              isOutOfStock={isOutOfStock}
            />
          ) : (
            <GameList
              games={processedMlbbGames}
              isOutOfStock={isOutOfStock}
            />
          )}
        </motion.div>
      )}

      {/* ================= ALL GAMES ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto mb-14"
      >
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">All Games</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
          <span className="text-sm text-[var(--muted)]">
            {processedGames.length}
          </span>
        </div>

        {viewMode === "grid" ? (
          <GameGrid
            games={processedGames}
            isOutOfStock={isOutOfStock}
          />
        ) : (
          <GameList
            games={processedGames}
            isOutOfStock={isOutOfStock}
          />
        )}
      </motion.div>

      {/* ================= OTT SECTION ================= */}
      {otts?.items?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto mb-16 px-4"
        >
          <ServiceGridSection
            title={otts.title}
            total={otts.total}
            items={otts.items}
            hrefPrefix="/games/ott"
          />
        </motion.section>
      )}

      {/* ================= MEMBERSHIP SECTION ================= */}
      {memberships?.items?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-7xl mx-auto mb-16 px-4"
        >
          <ServiceGridSection
            title={memberships.title}
            total={memberships.total}
            items={memberships.items}
            hrefPrefix="/games/membership"
            showCategory={false}
            ctaText="View Details →"
          />
        </motion.section>
      )}

      {/* ================= FILTER MODAL ================= */}
      {showFilter && (
        <FilterModal
          open={showFilter}
          onClose={() => setShowFilter(false)}
          sort={sort}
          setSort={setSort}
          hideOOS={hideOOS}
          setHideOOS={setHideOOS}
        />
      )}
    </section>
  );
}
