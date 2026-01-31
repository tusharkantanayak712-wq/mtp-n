"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Loader from "@/components/Loader/Loader";
import MLBBPurchaseGuide from "@/components/HelpImage/MLBBPurchaseGuide";

import GameHeader from "@/components/GameDetail/GameHeader";
import PackageSelector from "@/components/GameDetail/PackageSelector";
import BuyPanel from "@/components/GameDetail/BuyPanel";

import PackageSelectorBgmi from "@/components/GameDetail/PackageSelectorBgmi";
import BuyPanelBgmi from "@/components/GameDetail/BuyPanelBgmi";

export default function GameDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const buyPanelRef = useRef<HTMLDivElement | null>(null);

  const [game, setGame] = useState<any>(null);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ✅ detect weekly pass */
  const isWeeklyPass = searchParams.get("type") === "weekly-pass";
  const isBGMI =
    game?.gameName?.toLowerCase() === "pubg mobile" ||
    game?.gameName?.toLowerCase() === "bgmi" ||
    slug?.toString().startsWith("bgmi") ||
    slug?.toString().startsWith("pubg");

  const isGenshin =
    game?.gameName?.toLowerCase().includes("genshin") ||
    slug?.toString().startsWith("genshin-impact");
  const isHOK =
    game?.gameName?.toLowerCase().includes("honor") ||
    slug?.toString().startsWith("honor-of-kings");

  const isWuwa =
    slug?.toString().toLowerCase().startsWith("wuthering-of-waves");
  const isWWM =
    slug?.toString().toLowerCase().startsWith("where-winds-meet");

  /* ================= FETCH GAME ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    setError(null);

    fetch(`/api/games/${slug}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.data || !data.data.itemId || data.data.itemId.length === 0) {
          setError("No data found for this game");
          setLoading(false);
          return;
        }

        const sortedItems = [...data.data.itemId].sort(
          (a, b) => a.sellingPrice - b.sellingPrice
        );

        setGame({
          ...data.data,
          allItems: sortedItems,
        });

        /** ✅ default active item */
        setActiveItem(sortedItems[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching game:", err);
        setError("Failed to load game data");
        setLoading(false);
      });
  }, [slug]);

  /* ================= WEEKLY PASS AUTO-SELECT (NOT FILTER) ================= */
  useEffect(() => {
    if (!game?.allItems || !isWeeklyPass) return;

    const weeklyPass = game.allItems.find(
      (i: any) =>
        i.itemName === "Weekly Pass" &&
        i.itemSlug === "weekly-pass816"
    );

    if (weeklyPass) {
      setActiveItem(weeklyPass);
    }
  }, [game, isWeeklyPass]);

  if (loading) {
    return <Loader />;
  }

  if (error || !game || !activeItem) {
    return (
      <section className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <svg
                className="w-24 h-24 text-blue-400/60 relative"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            No items Found
          </h2>

          {/* Message */}
          <p className="text-gray-400 mb-8">
            {error || "We couldn't find any packages for this game. Please try again later or contact support."}
          </p>

          {/* Action Button */}
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  /* ================= ITEMS ================= */
  const items = game.allItems;

  /** ✅ SHOW ALL ITEMS ALWAYS */
  const visibleItems = items;

  /* ================= HELPERS ================= */
  const calculateDiscount = (selling: number, dummy: number) => {
    if (!dummy || dummy <= selling) return null;
    return Math.round(((dummy - selling) / dummy) * 100);
  };

  const scrollToItem = (item: any) => {
    setActiveItem(item);

    const index = visibleItems.findIndex(
      (i: any) => i.itemSlug === item.itemSlug
    );

    const el = sliderRef.current?.children[index] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });

    buyPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const goBuy = (item: any) => {
    if (redirecting) return;
    setRedirecting(true);

    const query = new URLSearchParams({
      name: item.itemName,
      price: item.sellingPrice.toString(),
      dummy: item.dummyPrice?.toString() || "",
      image: item.itemImageId?.image || "",
    });
    const basePath = isBGMI
      ? `/games/pubg/${slug}/buy`
      : isGenshin
        ? `/games/gensin/${slug}/buy`
        : isHOK
          ? `/games/hok/${slug}/buy`
          : isWuwa
            ? `/games/wwow/${slug}/buy`
            : isWWM
              ? `/games/wwm/${slug}/buy`
              : `/games/${slug}/buy`;



    router.push(
      `${basePath}/${item.itemSlug}?${query.toString()}`
    );
  };

  /* ================= RENDER ================= */
  return (
    <section className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-6">
      {/* ================= HEADER ================= */}
      <GameHeader game={game} />

      {/* ================= PACKAGE SELECTOR ================= */}
      {(isBGMI || isGenshin || isHOK) ? (
        <PackageSelectorBgmi
          items={visibleItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sliderRef={sliderRef}
          buyPanelRef={buyPanelRef}
          calculateDiscount={calculateDiscount}
          scrollToItem={scrollToItem}
        />
      ) : (
        <PackageSelector
          items={visibleItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sliderRef={sliderRef}
          buyPanelRef={buyPanelRef}
          calculateDiscount={calculateDiscount}
          scrollToItem={scrollToItem}
        />
      )}

      {/* ================= BUY PANEL ================= */}
      {(isBGMI || isGenshin || isHOK) ? (
        <BuyPanelBgmi
          activeItem={activeItem}
          redirecting={redirecting}
          goBuy={goBuy}
          calculateDiscount={calculateDiscount}
          buyPanelRef={buyPanelRef}
        />
      ) : (
        <BuyPanel
          activeItem={activeItem}
          redirecting={redirecting}
          goBuy={goBuy}
          calculateDiscount={calculateDiscount}
          buyPanelRef={buyPanelRef}
        />
      )}

      {/* ================= PURCHASE GUIDE ================= */}
      <div className="max-w-6xl mx-auto mt-6">
        {!isBGMI && <MLBBPurchaseGuide />}
      </div>
    </section>
  );
}
