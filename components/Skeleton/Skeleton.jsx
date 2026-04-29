"use client";

import React from "react";

/**
 * CORE SKELETON PRIMITIVES
 */
export const SkeletonBase = ({ className = "" }) => (
  <div className={`animate-pulse bg-[var(--border)] rounded-md ${className}`} />
);

export const SkeletonCircle = ({ size = "w-10 h-10", className = "" }) => (
  <SkeletonBase className={`${size} rounded-full ${className}`} />
);

export const SkeletonBox = ({ height = "h-24", className = "" }) => (
  <SkeletonBase className={`w-full ${height} ${className}`} />
);

export const SkeletonText = ({ width = "w-3/4", height = "h-3", className = "" }) => (
  <SkeletonBase className={`${width} ${height} ${className}`} />
);

/**
 * COMPOSITE SKELETONS (Specific Use Cases)
 */

// 1. TOURNAMENT CARD SKELETON
export const TournamentSkeleton = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/30 p-5 space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <SkeletonText width="w-3/4" height="h-4" />
        <SkeletonText width="w-1/2" height="h-2" className="opacity-50" />
        <SkeletonText width="w-1/4" height="h-2" className="opacity-30" />
      </div>
      <SkeletonBase className="h-5 w-14 rounded-full shrink-0" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <SkeletonText width="w-32" height="h-3" className="opacity-40" />
      <SkeletonText width="w-16" height="h-2" className="opacity-30" />
    </div>
    <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden opacity-50">
      <div className="h-full w-1/3 bg-[var(--border)] brightness-125" />
    </div>
    <SkeletonBase className="h-6 w-24 rounded-lg opacity-40" />
    <SkeletonBase className="h-11 w-full rounded-xl opacity-50" />
  </div>
);

// 2. PRODUCT/GAME CARD SKELETON
export const ProductSkeleton = () => (
  <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-3xl p-3 space-y-3 animate-pulse">
    <SkeletonBox height="aspect-square" className="rounded-2xl" />
    <div className="space-y-2 px-1">
      <SkeletonText width="w-2/3" height="h-4" />
      <SkeletonText width="w-1/3" height="h-3" className="opacity-50" />
    </div>
    <div className="flex justify-between items-center px-1">
      <SkeletonText width="w-12" height="h-4" />
      <SkeletonCircle size="w-8 h-8" />
    </div>
  </div>
);

// 3. BLOG POST SKELETON
export const BlogSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <SkeletonBox height="aspect-video" className="rounded-3xl" />
    <div className="space-y-2">
      <SkeletonText width="w-full" height="h-5" />
      <SkeletonText width="w-3/4" height="h-5" />
      <div className="flex gap-4 pt-2">
        <SkeletonCircle size="w-6 h-6" />
        <SkeletonText width="w-20" height="h-3" className="mt-1.5" />
      </div>
    </div>
  </div>
);

// 4. TABLE ROW SKELETON
export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <SkeletonText width="w-full" height="h-2.5" className="opacity-40" />
      </td>
    ))}
  </tr>
);

// 5. ORDER SKELETON (for Dashboard Orders)
export const OrderSkeleton = () => (
  <div className="rounded-2xl border border-white/5 bg-[var(--card)]/40 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded bg-[var(--border)]" />
        <SkeletonText width="w-24" height="h-3" />
      </div>
      <SkeletonText width="w-32" height="h-2" className="opacity-30" />
    </div>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonText width="w-40" height="h-4" />
        <div className="flex gap-2">
          <SkeletonText width="w-20" height="h-2" className="opacity-40" />
          <SkeletonText width="w-16" height="h-2" className="opacity-40" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <SkeletonText width="w-16" height="h-5" />
        <SkeletonText width="w-12" height="h-2" className="opacity-30" />
      </div>
    </div>
  </div>
);

// 6. TRANSACTION SKELETON (for Wallet/Coin History)
export const TransactionSkeleton = () => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--border)]/30 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--border)]" />
      <div className="space-y-1.5">
        <SkeletonText width="w-32" height="h-2.5" />
        <SkeletonText width="w-20" height="h-1.5" className="opacity-40" />
      </div>
    </div>
    <SkeletonText width="w-12" height="h-3" />
  </div>
);

// 7. TASK SKELETON (for Coins Tasks)
export const TaskSkeleton = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-[var(--border)]" />
    <div className="flex-1 space-y-2">
      <SkeletonText width="w-3/4" height="h-3" />
      <SkeletonText width="w-24" height="h-2" className="opacity-40" />
    </div>
    <div className="w-16 h-8 rounded-xl bg-[var(--border)] opacity-60" />
  </div>
);

// 8. API KEY SKELETON (for Dashboard API Keys)
export const ApiKeySkeleton = () => (
  <div className="p-1 rounded-3xl bg-white/5 border border-white/5 animate-pulse">
    <div className="p-6 rounded-[1.4rem] bg-[var(--card-bg)]/80">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--border)] opacity-40" />
              <div className="space-y-2">
                <SkeletonText width="w-32" height="h-4" />
                <SkeletonText width="w-48" height="h-2" className="opacity-30" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[var(--border)] opacity-40" />
          </div>
          <div className="space-y-3">
            <SkeletonText width="w-full" height="h-2" className="opacity-20" />
            <div className="h-1.5 w-full bg-[var(--border)]/20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-2xl bg-[var(--border)]/10" />
            <div className="h-12 rounded-2xl bg-[var(--border)]/10" />
          </div>
        </div>
        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 space-y-3">
          <div className="h-10 rounded-2xl bg-[var(--border)]/20" />
          <div className="h-10 rounded-2xl bg-[var(--border)]/20" />
        </div>
      </div>
    </div>
  </div>
);

// 9. QUERY SKELETON (for Support Queries)
export const QuerySkeleton = () => (
  <div className="p-4 rounded-2xl bg-[var(--background)]/50 border border-white/5 space-y-3 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <SkeletonText width="w-16" height="h-2" className="opacity-40" />
        <SkeletonText width="w-3/4" height="h-3" />
        <SkeletonText width="w-1/2" height="h-2" className="opacity-20" />
      </div>
      <div className="w-16 h-5 rounded-full bg-[var(--border)] opacity-30" />
    </div>
  </div>
);

// 10. GAME SELECT SKELETON (for Tournament Game Selection)
export const GameSelectSkeleton = () => (
  <div className="flex flex-col items-center gap-3 p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-[var(--border)] opacity-30" />
    <div className="text-center space-y-2">
      <SkeletonText width="w-20" height="h-3" />
      <SkeletonText width="w-12" height="h-1.5" className="opacity-20 mx-auto" />
    </div>
    <div className="w-6 h-6 rounded-full bg-[var(--border)] opacity-20" />
  </div>
);

// 11. PRODUCT CARD SKELETON (for Game Grids & Flash Sales)
export const ProductCardSkeleton = () => (
  <div className="p-1.5 rounded-[1.2rem] bg-[var(--card)]/40 border border-[var(--border)] space-y-3 animate-pulse">
    <div className="aspect-square rounded-[0.8rem] bg-[var(--border)] opacity-20" />
    <div className="space-y-2 px-1">
      <SkeletonText width="w-16" height="h-2" className="opacity-40" />
      <SkeletonText width="w-3/4" height="h-3" />
      <div className="flex justify-between items-center">
        <SkeletonText width="w-12" height="h-4" />
        <SkeletonText width="w-8" height="h-2" className="opacity-20" />
      </div>
    </div>
  </div>
);

// 12. STORY SKELETON (for Story Slider)
export const StorySkeleton = () => (
  <div className="flex flex-col items-center gap-4 min-w-[72px] md:min-w-[82px] animate-pulse">
    <div className="p-[2px] rounded-full bg-[var(--border)] opacity-20">
      <div className="p-0.5 rounded-full bg-[var(--background)]">
        <div className="w-[58px] h-[58px] md:w-[70px] md:h-[70px] rounded-full bg-[var(--border)] opacity-30" />
      </div>
    </div>
    <SkeletonText width="w-12" height="h-2" className="opacity-20" />
  </div>
);

// 13. BANNER SKELETON (for Game Banner Carousel)
export const BannerSkeleton = () => (
  <div className="relative h-[200px] sm:h-[240px] md:h-[300px] lg:h-[340px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/5 bg-[var(--card)]/40 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
        <SkeletonText width="w-12" height="h-2" className="opacity-20" />
      </div>
      <SkeletonText width="w-3/4" height="h-10" />
    </div>
  </div>
);

// 14. GAME DETAIL (SLUG) SKELETON
export const GameSlugSkeleton = () => (
  <div className="min-h-screen bg-[var(--background)] px-4 pb-10 pt-2 space-y-6">
    {/* 1. GameSwitcher Skeleton */}
    <div className="max-w-6xl mx-auto flex items-center gap-4 py-4 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <SkeletonCircle size="w-14 h-14 md:w-16 md:h-16" className="opacity-20" />
          <div className="space-y-1">
            <SkeletonText width="w-10" height="h-1.5" className="opacity-10" />
            <SkeletonText width="w-8" height="h-1.5" className="opacity-10 mx-auto" />
          </div>
        </div>
      ))}
    </div>

    {/* 2. GameHeader Skeleton */}
    <div className="max-w-6xl mx-auto">
      <div className="relative px-3 py-2 md:px-5 md:py-2 bg-[var(--card)]/40 border border-white/5 rounded-2xl md:rounded-3xl flex items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-3 md:gap-4">
          <SkeletonBox height="w-10 h-10 md:w-13 md:h-13" className="rounded-xl md:rounded-2xl opacity-30" />
          <div className="space-y-1.5">
            <SkeletonText width="w-32 md:w-48" height="h-3.5" />
            <SkeletonText width="w-20 md:w-32" height="h-3.5" className="opacity-20" />
            <SkeletonText width="w-16 md:w-24" height="h-2" className="opacity-10 mt-1" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-8 rounded-xl bg-[var(--border)] opacity-20 hidden sm:block" />
          <div className="w-16 h-8 rounded-xl bg-[var(--border)] opacity-20 hidden sm:block" />
        </div>
      </div>
    </div>

    {/* 3. PackageSelector Skeleton */}
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex justify-between items-center px-2">
        <SkeletonText width="w-24" height="h-4" />
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--border)] opacity-20" />
          <div className="w-8 h-8 rounded-lg bg-[var(--border)] opacity-20" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="p-3 rounded-2xl bg-[var(--card)]/40 border border-white/5 space-y-3 animate-pulse">
            <div className="w-full aspect-square rounded-xl bg-[var(--border)] opacity-20" />
            <SkeletonText width="w-full" height="h-3" />
            <SkeletonText width="w-1/2" height="h-4" />
          </div>
        ))}
      </div>
    </div>

    {/* 4. BuyPanel Skeleton (Sticky-like bottom or fixed) */}
    <div className="max-w-4xl mx-auto">
      <div className="p-4 rounded-2xl bg-[var(--card)]/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[var(--border)] opacity-30" />
          <div className="space-y-2">
            <SkeletonText width="w-16" height="h-2" className="opacity-30" />
            <SkeletonText width="w-32" height="h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
          <div className="space-y-2">
            <SkeletonText width="w-24" height="h-6" />
            <SkeletonText width="w-16" height="h-2" className="opacity-20" />
          </div>
          <div className="w-32 h-11 md:h-12 rounded-xl bg-[var(--border)] opacity-40" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * GRID WRAPPERS
 */
export const SkeletonGrid = ({ children, count = 3, cols = "grid-cols-1 md:grid-cols-3", gap = "gap-6" }) => (
  <div className={`grid ${cols} ${gap}`}>
    {Array.from({ length: count }).map((_, i) => (
      <React.Fragment key={i}>{children}</React.Fragment>
    ))}
  </div>
);
