"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiAward, FiChevronRight, FiInfo, FiLoader, FiSearch, 
  FiZap, FiClock, FiUsers, FiStar, FiGrid, FiShield, FiMessageCircle 
} from "react-icons/fi";
import { GiTrophy, GiSwordsEmblem } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { TournamentSkeleton, SkeletonGrid } from "@/components/Skeleton/Skeleton";

// ── Types ──────────────────────────────────────────────────────────────
interface Tournament {
  _id: string;
  game: string;
  title: string;
  subtitle?: string;
  format: string;
  prize: string;
  slots: number;
  slotsFilled: number;
  entryCoins: number;
  status: "open" | "upcoming" | "ongoing" | "closed" | "ended";
  startsAt?: string;
  endsAt?: string;
}

// Known games with logos
const GAME_META: Record<string, { name: string; tag: string; logo: string; href: string }> = {
  mlbb: { name: "Mobile Legends", tag: "Bang Bang", logo: "/logoBB.png", href: "/tournament/mlbb" },
  freefire: { name: "Free Fire", tag: "Garena", logo: "/logoBB.png", href: "/tournament/freefire" },
  codm: { name: "COD Mobile", tag: "Activision", logo: "/logoBB.png", href: "/tournament/codm" },
};

const STATUS_STYLE: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ongoing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  upcoming: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
  ended: "bg-[var(--border)]/20 text-[var(--muted)] border-[var(--border)]",
};

// ── Components ─────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, icon: Icon, color = "var(--accent)" }: any) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-lg" style={{ color }}>
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] italic leading-none mb-1">{title}</h2>
        <p className="text-[10px] text-[var(--muted)] italic">{subtitle}</p>
      </div>
    </div>
  </div>
);

const TournamentCard = ({ t }: { t: Tournament }) => {
  const meta = GAME_META[t.game] || { logo: "/logoBB.png", href: `/tournament/${t.game}` };
  const isFree = t.entryCoins === 0;

  return (
    <Link href={`${meta.href}?id=${t._id}`} className="block group">
      <motion.div 
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 p-4 space-y-4 hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all duration-300"
      >
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--accent)]/5 blur-3xl rounded-full group-hover:bg-[var(--accent)]/10 transition-colors" />

        <div className="flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
              <Image src={meta.logo} alt={t.game} width={40} height={40} className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase italic tracking-tight truncate">{t.title}</p>
              <p className="text-[7px] text-[var(--muted)] uppercase tracking-widest">{t.game} • {t.format}</p>
            </div>
          </div>
          <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLE[t.status]}`}>
            {t.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-[var(--muted)] relative">
          <div className="flex items-center gap-1.5">
            <GiTrophy size={11} className="text-yellow-400" />
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">
              <span className="text-[var(--foreground)]">{t.prize}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[8px] font-bold">
            <FiUsers size={10} />
            <span>{t.slotsFilled}/{t.slots}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 relative">
          <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isFree ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]'}`}>
            {isFree ? <FiStar size={10} /> : <FiZap size={10} />}
            {isFree ? "Free Entry" : `${t.entryCoins} BBC`}
          </div>
          <div className="w-8 h-8 rounded-xl bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-all duration-300">
            <FiChevronRight size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────

export default function TournamentHub() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => { if (d.success) setTournaments(d.data); })
      .finally(() => setLoading(false));
  }, []);

  // Filter Logic
  const active = useMemo(() => tournaments.filter(t => t.status !== "ended"), [tournaments]);
  const featured = useMemo(() => active.slice(0, 5), [active]);
  const freeTourneys = useMemo(() => active.filter(t => t.entryCoins === 0).slice(0, 5), [active]);
  const gameGroups = useMemo(() => {
    const groups: Record<string, Tournament[]> = {};
    active.forEach(t => {
      if (!groups[t.game]) groups[t.game] = [];
      groups[t.game].push(t);
    });
    return groups;
  }, [active]);

  const uniqueGameIds = useMemo(() => Object.keys(gameGroups), [gameGroups]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 md:pt-16 space-y-12">
        
        {/* Notice for Hosts/Sponsors */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-2 px-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10"
        >
          <div className="flex items-center gap-2">
            <FiMessageCircle className="text-[var(--accent)]" size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]">
              Want to <span className="text-[var(--accent)]">Host</span> or <span className="text-[var(--accent)]">Sponsor</span>?
            </span>
          </div>
          <Link href="/support" className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/30 transition-colors">
            Contact Support
          </Link>
        </motion.div>

        {/* Header Hero Section */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-[1.5px] bg-[var(--accent)]" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent)] italic">Blue Buff Esports</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-[900] italic tracking-tighter uppercase leading-[0.85]">
              ESPORTS<br />
              <span className="text-[var(--accent)]">ZONE</span>
            </h1>
            <p className="max-w-xs text-[10px] text-[var(--muted)] italic leading-relaxed">
              Join tournaments, win prizes, and climb the ranks. Pick your game to start.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2].map(i => (
              <div key={i} className="space-y-4">
                <div className="w-48 h-6 bg-[var(--card)] rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(j => <TournamentSkeleton key={j} />)}
                </div>
              </div>
            ))}
          </div>
        ) : active.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-[2.5rem] bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] opacity-20">
              <FiSearch size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase italic italic tracking-tighter">No Active Tournaments</h3>
              <p className="text-xs text-[var(--muted)] italic">New events are added daily. Check back in a few hours!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* 1. Featured Section */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <SectionHeader 
                title="Featured Events" 
                subtitle="The most popular tournaments happening now" 
                icon={FiStar} 
                color="#f59e0b"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featured.map((t, i) => (
                  <motion.div key={t._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <TournamentCard t={t} />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 2. Free Tournaments Section */}
            {freeTourneys.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <SectionHeader 
                  title="Free Entry Tournaments" 
                  subtitle="No coins needed. Join and win Weekly Passes!" 
                  icon={FiZap} 
                  color="#10b981"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {freeTourneys.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <TournamentCard t={t} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* 3. Browse by Game Section */}
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <SectionHeader 
                title="Browse by Game" 
                subtitle="Select your favorite title to find dedicated rooms" 
                icon={FiGrid} 
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uniqueGameIds.map((gameId, i) => {
                  const meta = GAME_META[gameId] ?? { name: gameId.toUpperCase(), tag: "Active Rooms", logo: "/logoBB.png", href: `/tournament/${gameId}` };
                  const count = gameGroups[gameId].length;
                  return (
                    <motion.div key={gameId} whileHover={{ scale: 1.02 }} className="relative">
                      <Link href={meta.href} className="group block p-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)]/40 hover:border-[var(--accent)] transition-all">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-colors">
                            <Image src={meta.logo} alt={meta.name} width={48} height={48} className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase italic leading-none truncate mb-1">{meta.name}</p>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent)]">{count} Rooms</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* 4. Trust Banner */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)]/10 to-transparent border border-[var(--accent)]/20 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-xl shadow-[var(--accent)]/20">
                <FiShield size={32} />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-lg font-black uppercase italic tracking-tighter">Verified & Fair Play</h4>
                <p className="text-[10px] text-[var(--muted)] leading-relaxed italic max-w-md">
                  All tournaments are moderated by Blue Buff India. Anti-cheat measures are active for every room. Results are verified manually within 24 hours.
                </p>
              </div>
            </div>

          </div>
        )}

        <div className="flex flex-col items-center gap-4 pt-12 border-t border-[var(--border)]/30">
          <div className="flex items-center gap-4">
             {[FiStar, FiZap, FiAward].map((I, i) => (
               <div key={i} className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] opacity-50">
                 <I size={14} />
               </div>
             ))}
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--muted)] opacity-30 italic">
            Powered by Blue Buff India Esports
          </p>
        </div>
      </div>
    </main>
  );
}
