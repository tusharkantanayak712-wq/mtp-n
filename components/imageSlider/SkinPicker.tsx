"use client";

import { skins } from "@/data/skins";
import { useStore } from "@/store/useStore";
import { Check, Search } from "lucide-react";

export default function SkinPicker() {
  const {
    selectedSkins,
    toggleSkin,
    activeCategory,
    selectedHero,
    setSelectedHero,
    searchQuery,
    setSearchQuery,
    batchSelect
  } = useStore();

  const query = searchQuery.toLowerCase();

  // 1. Get all potential skins for the current category/search to find available heroes
  const categorySkins = skins.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch =
      s.id.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.subCategory.toLowerCase().includes(query) ||
      s.hero.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const availableHeroes = Array.from(new Set(categorySkins.map((s) => s.hero))).sort();

  // 2. Filter final visible list by selected hero
  const visibleSkins = categorySkins.filter((s) => {
    return selectedHero === "all" || s.hero === selectedHero;
  });

  return (
    <div className="space-y-4">
      {/* Inline Search for better visibility */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" size={14} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-9 pr-3
            text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/50
            transition-all duration-300 placeholder:text-white/10
          "
        />
      </div>

      {/* HERO FILTER BAR */}
      {availableHeroes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar no-scrollbar">
          <button
            onClick={() => setSelectedHero("all")}
            className={`
              px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all
              ${selectedHero === "all"
                ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
              }
            `}
          >
            All Heroes
          </button>
          {availableHeroes.map((hero) => (
            <button
              key={hero}
              onClick={() => setSelectedHero(hero)}
              className={`
                px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all
                ${selectedHero === hero
                  ? "bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]"
                  : "bg-white/5 text-white/20 border-white/5 hover:border-white/20 hover:text-white/40"
                }
              `}
            >
              {hero}
            </button>
          ))}
        </div>
      )}

      {/* SELECT ALL & COUNT */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 mx-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">
          Showing {visibleSkins.length} items
        </span>

        <button
          onClick={() => {
            const visibleIds = visibleSkins.map((s) => s.id);
            const allSelected = visibleIds.every((id) => selectedSkins.includes(id));
            batchSelect(visibleIds, !allSelected);
          }}
          className={`
            text-[9px] font-black uppercase px-2.5 py-1 rounded-md border transition-all
            ${visibleSkins.length > 0 && visibleSkins.every((s) => selectedSkins.includes(s.id))
              ? "bg-[var(--accent)] text-black border-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
              : "bg-white/5 text-[var(--accent)] border-white/5 hover:border-[var(--accent)]/40 hover:bg-white/10"
            }
          `}
        >
          {visibleSkins.length > 0 && visibleSkins.every((s) => selectedSkins.includes(s.id)) ? "Deselect All" : "Select All Items"}
        </button>
      </div>

      {/* SCROLL CONTAINER */}
      <div
        className="
          max-h-[50vh]
          overflow-y-auto
          pr-2
          custom-scrollbar
        "
      >
        <div className="space-y-6">
          {Object.entries(
            visibleSkins.reduce((acc, skin) => {
              const sub = skin.subCategory || "Other";
              if (!acc[sub]) acc[sub] = [];
              acc[sub].push(skin);
              return acc;
            }, {} as Record<string, typeof skins>)
          ).map(([subCategory, items]) => {
            const allInSubSelected = items.every((s) => selectedSkins.includes(s.id));

            return (
              <div key={subCategory} className="space-y-3">
                {/* SUBCATEGORY HEADER */}
                <div className="flex items-center justify-between sticky top-0 z-10 bg-[#0f1118]/80 backdrop-blur-md py-1 px-1 rounded-lg">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">
                    {subCategory}
                  </h3>

                  <button
                    onClick={() => {
                      const itemIds = items.map((s) => s.id);
                      batchSelect(itemIds, !allInSubSelected);
                    }}
                    className={`
                      flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-300
                      ${allInSubSelected
                        ? "bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]"
                        : "bg-white/5 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40"
                      }
                    `}
                  >
                    <div className={`
                      w-3 h-3 rounded flex items-center justify-center border transition-colors
                      ${allInSubSelected ? "bg-[var(--accent)] border-[var(--accent)]" : "border-white/10"}
                    `}>
                      {allInSubSelected && <Check size={8} className="text-black" strokeWidth={4} />}
                    </div>
                    <span className="text-[9px] font-bold uppercase">Select All</span>
                  </button>
                </div>

                {/* ITEMS GRID */}
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 px-0.5">
                  {items.map((skin) => {
                    const active = selectedSkins.includes(skin.id);

                    return (
                      <button
                        key={skin.id}
                        onClick={() => toggleSkin(skin.id)}
                        className={`
                          relative group aspect-square
                          rounded-lg overflow-hidden
                          bg-[#1a1f2e] border transition-all duration-300
                          ${active
                            ? "border-[var(--accent)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)]"
                            : "border-white/5 hover:border-white/20"
                          }
                        `}
                      >
                        <img
                          src={skin.image}
                          alt={skin.name}
                          className={`
                            w-full h-full object-cover object-center transition-transform duration-500
                            group-hover:scale-110
                            ${active ? "brightness-110" : "opacity-60 grayscale-[40%] group-hover:grayscale-0 group-hover:opacity-100"}
                          `}
                        />

                        {/* HOVER TITLE */}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[7px] font-bold text-white truncate leading-none uppercase tracking-tighter">{skin.hero}</p>
                        </div>

                        {/* SELECTED INDICATOR */}
                        {active && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg transform scale-100">
                            <Check size={8} className="text-black" strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
