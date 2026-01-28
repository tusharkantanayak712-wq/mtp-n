"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://game-off-ten.vercel.app/api/v1";

export default function PricingTab({
  pricingType,
  setPricingType,
  slabs,
  setSlabs,
  overrides,
  setOverrides,
  savingPricing,
  onSave,
}) {
  /* ================= LOCAL STATE ================= */

  const [pricingMode, setPricingMode] = useState("percent");
  const [games, setGames] = useState([]);
  const [itemsByGame, setItemsByGame] = useState({});
  const [fixedGameFilter, setFixedGameFilter] = useState("");
  const [fixedItemFilter, setFixedItemFilter] = useState("");
  const [loadingFixedPrices, setLoadingFixedPrices] = useState(false);
  const [bulkPercent, setBulkPercent] = useState("");

  /* ================= FETCH GAMES ================= */

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

  /* ================= FETCH ITEMS ================= */

  const fetchItemsForGame = async (gameSlug) => {
    if (!gameSlug) return [];
    if (itemsByGame[gameSlug]) return itemsByGame[gameSlug];

    try {
      const res = await fetch(`${API_BASE}/games/${gameSlug}/items`);
      const json = await res.json();

      if (json.success) {
        const items = json.data.items || [];
        setItemsByGame((p) => ({ ...p, [gameSlug]: items }));
        return items;
      }
    } catch (e) {
      console.error("Item fetch failed", e);
    }

    return [];
  };

  /* ================= HYDRATE FIXED PRICING ================= */

  const hydrateFixedPricing = async (gameSlug) => {
    if (!gameSlug) return;

    setLoadingFixedPrices(true);

    try {
      const items = await fetchItemsForGame(gameSlug);

      const hydrated = items.map((item) => {
        const existing = overrides.find(
          (o) =>
            o.gameSlug === gameSlug &&
            o.itemSlug === item.itemSlug
        );

        return {
          gameSlug,
          itemSlug: item.itemSlug,
          itemName: item.itemName,
          fixedPrice:
            existing?.fixedPrice ??
            Number(item.sellingPrice) ??
            0,
        };
      });

      setOverrides(hydrated);
      setFixedItemFilter("");
    } finally {
      setLoadingFixedPrices(false);
    }
  };

  /* ================= TRIGGERS ================= */

  useEffect(() => {
    if (pricingMode !== "fixed") return;
    if (!fixedGameFilter) return;

    hydrateFixedPricing(fixedGameFilter);
  }, [pricingMode, pricingType, fixedGameFilter]);

  /* ================= FILTERED VIEW ================= */

  const visibleOverrides = useMemo(() => {
    return overrides.filter((o) => {
      if (fixedGameFilter && o.gameSlug !== fixedGameFilter) return false;
      if (fixedItemFilter && o.itemSlug !== fixedItemFilter) return false;
      return true;
    });
  }, [overrides, fixedGameFilter, fixedItemFilter]);

  /* ================= UPDATE SINGLE PRICE ================= */

  const updateOverridePrice = (i, value) => {
    const next = [...overrides];
    next[i].fixedPrice = Math.max(0, Number(value) || 0);
    setOverrides(next);
  };

  /* ================= BULK % APPLY ================= */

  const applyBulkPercentage = () => {
    const percent = Number(bulkPercent);
    if (!Number.isFinite(percent) || percent === 0) return;

    const multiplier = 1 + percent / 100;

    const next = overrides.map((o) => {
      if (
        (fixedGameFilter && o.gameSlug !== fixedGameFilter) ||
        (fixedItemFilter && o.itemSlug !== fixedItemFilter)
      ) {
        return o;
      }

      return {
        ...o,
        fixedPrice: Math.round(o.fixedPrice * multiplier),
      };
    });

    setOverrides(next);
    setBulkPercent("");
  };

  /* ================= MARKUP SLABS ================= */

  const updateSlab = (i, key, value) => {
    const next = [...slabs];
    next[i][key] = Math.max(0, Number(value) || 0);
    setSlabs(next);
  };

  const addSlab = () =>
    setSlabs([...slabs, { min: 0, max: 0, percent: 0 }]);

  const deleteSlab = (i) =>
    setSlabs(slabs.filter((_, idx) => idx !== i));

  /* ================= VALIDATION ================= */

  const canSave =
    !savingPricing &&
    ((pricingMode === "percent" && slabs.length) ||
      (pricingMode === "fixed" && overrides.length));

  /* ================= RENDER ================= */

  return (
    <div className="max-w-6xl space-y-8">
      {/* MODE */}
      <div className="flex gap-2">
        {["percent", "fixed"].map((m) => (
          <button
            key={m}
            onClick={() => setPricingMode(m)}
            className={`px-4 h-9 rounded-full font-semibold ${
              pricingMode === m
                ? "bg-[var(--accent)] text-black"
                : "bg-black/30 text-gray/70"
            }`}
          >
            {m === "percent" ? "% Markup" : "Fixed Price"}
          </button>
        ))}
      </div>

      {/* USER TYPE */}
      <select
        value={pricingType}
        onChange={(e) => setPricingType(e.target.value)}
        className="h-10 px-4 rounded-full bg-black/30"
      >
        <option value="user">Users</option>
        <option value="member">Members</option>
        <option value="admin">Admins</option>
      </select>

      {/* ================= MARKUP (REFERENCE IN FIXED) ================= */}
       {pricingMode === "percent" && (
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Price Range Markup</h3>
          {pricingMode === "fixed" && (
            <span className="text-xs text-yellow-400">
              Reference only
            </span>
          )}
        </div>

        {slabs.map((s, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 mb-2">
            <input
              type="number"
              value={s.min}
              disabled={pricingMode === "fixed"}
              onChange={(e) => updateSlab(i, "min", e.target.value)}
            />
            <input
              type="number"
              value={s.max}
              disabled={pricingMode === "fixed"}
              onChange={(e) => updateSlab(i, "max", e.target.value)}
            />
            <input
              type="number"
              value={s.percent}
              disabled={pricingMode === "fixed"}
              onChange={(e) =>
                updateSlab(i, "percent", e.target.value)
              }
            />
            {pricingMode === "percent" && (
              <button
                onClick={() => deleteSlab(i)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {pricingMode === "percent" && (
          <button
            onClick={addSlab}
            className="text-sm text-[var(--accent)] font-semibold"
          >
            + Add Range
          </button>
        )}
      </section>
         )}

      {/* ================= FIXED MODE ================= */}
      {pricingMode === "fixed" && (
        <section className="space-y-4">
          {/* FILTERS */}
        
            <select
              value={fixedGameFilter}
              onChange={(e) => setFixedGameFilter(e.target.value)}
              className="h-10 px-4 rounded-lg bg-black/30"
            >
              <option value="">Select Game</option>
              {games.map((g) => (
                <option key={g.gameSlug} value={g.gameSlug}>
                  {g.gameName}
                </option>
              ))}
            </select>
<br />
            {/* {fixedGameFilter && (
              <select
                value={fixedItemFilter}
                onChange={(e) => setFixedItemFilter(e.target.value)}
                className="h-10 px-4 rounded-lg bg-black/30 w-full" 
              >
                <option value="">All Items</option>
                {overrides.map((o) => (
                  <option key={o.itemSlug} value={o.itemSlug}>
                    {o.itemName || o.itemSlug}
                  </option>
                ))}
              </select>
            )} */}
         

          {/* BULK % APPLY */}
          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
            <span className="text-sm font-semibold text-gray/70">
              Adjust Price %
            </span>
            <input
              type="number"
              placeholder="+10 or -5"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              className="w-24 h-9 px-3 rounded-md bg-black/40 border border-white/10"
            />
            <button
              onClick={applyBulkPercentage}
              disabled={!bulkPercent}
              className="h-9 px-4 rounded-md bg-[var(--accent)] text-black font-semibold disabled:opacity-40"
            >
              Apply
            </button>
          </div>

          {/* TABLE */}
          {loadingFixedPrices ? (
            <p className="text-sm text-gray/60">Loading prices…</p>
          ) : (
            visibleOverrides.map((o) => (
              <div
                key={o.itemSlug}
                className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/20"
              >
                <input value={o.gameSlug} disabled />
                <input value={o.itemName || o.itemSlug} disabled />
                <input
                  type="number"
                  value={o.fixedPrice}
                  onChange={(e) =>
                    updateOverridePrice(
                      overrides.findIndex(
                        (x) => x.itemSlug === o.itemSlug
                      ),
                      e.target.value
                    )
                  }
                />
              </div>
            ))
          )}
        </section>
      )}

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={!canSave}
          className="px-6 h-10 rounded-lg bg-[var(--accent)] text-black font-semibold"
        >
          {savingPricing ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
