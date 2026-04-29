"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiChevronRight, FiInfo, FiLoader, FiSearch } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { GameSelectSkeleton } from "@/components/Skeleton/Skeleton";

// Known games with logos — extend as more games are added
const GAME_META: Record<string, { name: string; tag: string; logo: string; href: string }> = {
  mlbb: { name: "Mobile Legends", tag: "Bang Bang", logo: "/logoBB.png", href: "/tournament/mlbb" },
  freefire: { name: "Free Fire", tag: "Garena", logo: "/logoBB.png", href: "/tournament/freefire" },
  codm: { name: "COD Mobile", tag: "Activision", logo: "/logoBB.png", href: "/tournament/codm" },
};

export default function TournamentPage() {
  const [games, setGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          // Get unique games that have at least one non-ended tournament
          const active = [...new Set<string>(
            (d.data as any[])
              .filter((t) => t.status !== "ended")
              .map((t) => t.game as string)
          )];
          setGames(active);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10 md:pt-16 space-y-8">
        {/* Title */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[1px] bg-[var(--accent)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Blue Buff India</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-[900] italic tracking-tighter uppercase leading-none">
            TOURNAMENTS<br />
            <span className="text-[var(--accent)]">& SCRIMS</span>
          </h1>
          <p className="text-xs text-[var(--muted)] italic mt-2">Pick a game to view available formats and register.</p>
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Choose a Game</p>

        {/* Games Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <GameSelectSkeleton key={i} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-[2rem] bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] opacity-20">
              <FiSearch size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-widest">No Games Found</p>
              <p className="text-[10px] text-[var(--muted)] italic">We don't have any active tournaments right now. Please check back later!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {games.map((gameId, i) => {
              const meta = GAME_META[gameId] ?? { name: gameId.toUpperCase(), tag: "", logo: "/logoBB.png", href: `/tournament/${gameId}` };
              return (
                <motion.div key={gameId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href={meta.href}
                    className="group flex flex-col items-center gap-3 p-5 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[var(--border)] group-hover:scale-105 transition-transform duration-300">
                      <Image src={meta.logo} alt={meta.name} fill className="object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-[900] italic uppercase tracking-tight">{meta.name}</p>
                      {meta.tag && <p className="text-[8px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{meta.tag}</p>}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                      <FiChevronRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Coming soon placeholder */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: games.length * 0.08}}
              className="flex flex-col items-center gap-3 p-5 rounded-3xl border border-dashed border-[var(--border)]/40 opacity-30"
            >
              <div className="w-16 h-16 rounded-2xl border border-dashed border-[var(--border)] flex items-center justify-center">
                <FiAward size={20} className="text-[var(--muted)]" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] text-center">More<br />Coming Soon</p>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 opacity-20 pt-4">
          <FiInfo size={11} />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Powered by Blue Buff India</span>
        </div>
      </div>
    </main>
  );
}
