"use client";

import React from "react";

/**
 * A reusable Shimmer Skeleton component that mimics the tournament cards.
 * Use this to improve perceived performance during data fetching.
 */
export const TournamentSkeleton = () => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/30 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          {/* Title */}
          <div className="h-4 w-3/4 bg-[var(--border)] rounded-md" />
          {/* Subtitle */}
          <div className="h-2 w-1/2 bg-[var(--border)] rounded-md opacity-50" />
          {/* Format */}
          <div className="h-2 w-1/4 bg-[var(--border)] rounded-md opacity-30" />
        </div>
        {/* Status Badge */}
        <div className="h-5 w-14 bg-[var(--border)] rounded-full shrink-0" />
      </div>

      {/* Prize & Slots Info */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 w-32 bg-[var(--border)] rounded-md opacity-40" />
        <div className="h-2 w-16 bg-[var(--border)] rounded-md opacity-30" />
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden opacity-50">
        <div className="h-full w-1/3 bg-[var(--border)] brightness-125" />
      </div>

      {/* Entry Fee Tag */}
      <div className="h-6 w-24 bg-[var(--border)] rounded-lg opacity-40" />

      {/* CTA Button */}
      <div className="h-11 w-full bg-[var(--border)] rounded-xl opacity-50" />
    </div>
  );
};

export const TournamentSkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <TournamentSkeleton key={i} />
      ))}
    </div>
  );
};
