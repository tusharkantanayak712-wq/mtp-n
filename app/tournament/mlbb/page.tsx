"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight, FiChevronLeft, FiZap, FiLock, FiClock, FiSearch,
  FiStar, FiMessageCircle, FiAward, FiInfo, FiLoader, FiX, FiCheck, FiUser, FiUsers, FiPhone, FiMail
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
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

const STATUS_STYLE: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ongoing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  upcoming: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
  ended: "bg-[var(--border)]/20 text-[var(--muted)] border-[var(--border)]",
};

// ── Page ────────────────────────────────────────────────────────────────
export default function MLBBTournamentPage() {
  const [formats, setFormats] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<Tournament | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [gameIds, setGameIds] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const searchParams = useSearchParams();
  const directId = searchParams.get("id");

  useEffect(() => {
    fetch("/api/tournaments?game=mlbb")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setFormats(d.data);
          // Auto-open if direct ID provided
          if (directId) {
            const match = d.data.find((t: any) => t._id === directId);
            if (match && match.status !== "ended") {
              openRegister(match);
            }
          }
        }
      })
      .finally(() => setLoading(false));

    // Auto-fill from localStorage
    setContactInfo({
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || ""
    });
  }, [directId]);

  const active = formats.filter((t) => t.status !== "ended");
  const ended = formats.filter((t) => t.status === "ended");

  const openRegister = (t: Tournament) => {
    setRegistering(t);
    setMsg({ text: "", type: "" });
    // Determine player count from format (e.g. "5v5" -> 5)
    let count = 1;
    if (t.format.toLowerCase().includes("5v5")) count = 5;
    else if (t.format.toLowerCase().includes("4v4")) count = 4;
    else if (t.format.toLowerCase().includes("2v2")) count = 2;
    setGameIds(new Array(count).fill(""));
    setTeamName("");
  };

  const handleRegister = async () => {
    if (gameIds.length > 1 && !teamName.trim()) {
      setMsg({ text: "Please enter a Team Name", type: "error" });
      return;
    }
    if (gameIds.some(id => !id.trim())) {
      setMsg({ text: "Please fill all Game IDs", type: "error" });
      return;
    }
    setFormLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          tournamentId: registering?._id,
          contactEmail: contactInfo.email,
          contactPhone: contactInfo.phone,
          gameIds: gameIds,
          teamName: gameIds.length > 1 ? teamName : ""
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: "Joined Successfully!", type: "success" });
        if (data.newCoinBalance !== undefined) {
          localStorage.setItem("coins", data.newCoinBalance);
          window.dispatchEvent(new Event("walletUpdated"));
        }
        setTimeout(() => {
          setRegistering(null);
          // Refresh data
          fetch("/api/tournaments?game=mlbb")
            .then((r) => r.json())
            .then((d) => { if (d.success) setFormats(d.data); });
        }, 2000);
      } else {
        setMsg({ text: data.message || "Registration failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Server error. Try again.", type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10 md:pt-16 space-y-6">

        {/* Breadcrumb */}
        <Link href="/tournament" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
          <FiChevronLeft size={14} /> All Games
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
            <Image src="/logoBB.png" alt="MLBB" width={36} height={36} className="object-cover" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Mobile Legends: Bang Bang</p>
            <h1 className="text-2xl md:text-3xl font-[900] italic uppercase tracking-tighter">
              Pick a <span className="text-[var(--accent)]">Format</span>
            </h1>
          </div>
        </div>

        {/* Loading / Skeletons */}
        {loading && (
          <SkeletonGrid count={3} cols="grid-cols-1" gap="gap-6">
            <TournamentSkeleton />
          </SkeletonGrid>
        )}

        {/* No tournaments */}
        {!loading && active.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-[2rem] bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] opacity-20">
              <FiSearch size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-widest">No Games Found</p>
              <p className="text-[10px] text-[var(--muted)] italic">We don't have any active tournaments right now. Please check back later!</p>
            </div>
          </div>
        )}

        {/* ── Active Tournaments ── */}
        {!loading && active.map((fmt, i) => {
          const isExpired = fmt.endsAt && new Date() > new Date(fmt.endsAt);
          const displayStatus = isExpired ? "ended" : fmt.status;

          return (
          <motion.div
            key={fmt._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-[900] italic uppercase tracking-tight">{fmt.title}</p>
                {fmt.subtitle && <p className="text-[10px] text-[var(--muted)] mt-0.5">{fmt.subtitle}</p>}
                <p className="text-[9px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{fmt.format}</p>
                {fmt.startsAt && (
                  <div className="flex items-center gap-1.5 mt-2 text-[var(--accent)] font-bold">
                     <FiClock size={10} />
                     <span className="text-[8px] uppercase tracking-widest">Starts: {new Date(fmt.startsAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLE[displayStatus]}`}>
                {displayStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GiTrophy size={13} className="text-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">
                  Prize: <span className="text-[var(--foreground)]">{fmt.prize}</span>
                </span>
              </div>
              <span className="text-[9px] text-[var(--muted)]">{fmt.slotsFilled}/{fmt.slots} slots</span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[var(--border)]">
              <motion.div
                className="h-full rounded-full bg-[var(--accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.round((fmt.slotsFilled / fmt.slots) * 100))}%` }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                <FiZap size={10} className="text-[var(--accent)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">
                  {fmt.entryCoins === 0 ? "Free Entry" : `${fmt.entryCoins} BBC Coins`}
                </span>
              </div>
            </div>

            <button
              onClick={() => openRegister(fmt)}
              disabled={displayStatus !== "open" && displayStatus !== "upcoming" && displayStatus !== "ongoing"}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                displayStatus === "upcoming"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white"
                  : displayStatus === "ongoing"
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white"
                  : "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              }`}
            >
              {displayStatus === "ended" ? (
                <><FiLock size={13} /> Tournament Ended</>
              ) : displayStatus === "upcoming" ? (
                <><FiClock size={13} /> Pre-Register<FiChevronRight size={11} /></>
              ) : displayStatus === "ongoing" ? (
                <><FiZap size={13} /> Tournament Live<FiChevronRight size={11} /></>
              ) : (
                <><FiZap size={13} /> Join Tournament Now<FiChevronRight size={11} /></>
              )}
            </button>
          </motion.div>
          );
        })}

        {/* ── Membership ── */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--card)]/40 p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] shrink-0">
              <FiStar size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-0.5">Membership</p>
              <p className="text-sm font-[900] italic uppercase leading-tight">Unlimited Entries</p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">Free = 1 entry/day · Members = unlimited</p>
            </div>
            <Link href="/contact" className="shrink-0 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
              Join
            </Link>
          </motion.div>
        )}

        {/* ── Ended Tournaments ── */}
        {!loading && ended.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-50">Ended</p>
            {ended.map((t) => (
              <div key={t._id} className="rounded-xl border border-[var(--border)]/40 bg-[var(--card)]/20 px-4 py-3 flex items-center justify-between opacity-50">
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)]">{t.title}</p>
                  <p className="text-[9px] text-[var(--muted)]">{t.format}</p>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]">Ended</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[8px] text-[var(--muted)] italic opacity-40 uppercase tracking-widest">
          Register 1 hr before match · Results on Instagram
        </p>
      </div>

      {/* ── Registration Modal ── */}
      <AnimatePresence>
        {registering && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRegistering(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--background)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl p-6 md:p-8"
            >
              <button onClick={() => setRegistering(null)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                <FiX size={18} />
              </button>

              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-1">Registration</p>
                  <h3 className="text-xl font-[900] italic uppercase tracking-tighter">{registering.title}</h3>
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-1">{registering.format} · {registering.entryCoins} Coins</p>
                </div>

                {msg.text && (
                  <div className={`p-3 rounded-xl text-[10px] font-bold text-center border ${msg.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    {msg.text}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={12} />
                        <input disabled value={contactInfo.email} className="w-full bg-[var(--card)]/50 border border-[var(--border)] rounded-xl py-2.5 pl-9 pr-3 text-[10px] opacity-60" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={12} />
                        <input disabled value={contactInfo.phone} className="w-full bg-[var(--card)]/50 border border-[var(--border)] rounded-xl py-2.5 pl-9 pr-3 text-[10px] opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Team Name (if > 1 player) */}
                  {gameIds.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Team Name</label>
                      <div className="relative">
                        <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={12} />
                        <input 
                          placeholder="e.g. Team Legends"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl py-2.5 pl-9 pr-3 text-[10px] focus:border-[var(--accent)]/50 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Game IDs */}
                  <div className="space-y-3">
                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] ml-1">Enter Game IDs (All Players)</p>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {gameIds.map((id, idx) => (
                        <div key={idx} className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={12} />
                          <input
                            placeholder={`Player ${idx + 1} Game ID (e.g. 12345678)`}
                            value={id}
                            onChange={(e) => {
                              const newIds = [...gameIds];
                              newIds[idx] = e.target.value;
                              setGameIds(newIds);
                            }}
                            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl py-2.5 pl-9 pr-3 text-[10px] focus:border-[var(--accent)]/50 outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={formLoading || msg.type === "success"}
                  className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white text-[11px] font-[900] italic uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? <FiLoader className="animate-spin" size={16} /> : (msg.type === "success" ? <FiCheck size={16} /> : "Confirm Registration")}
                </button>

                <p className="text-[8px] text-center text-[var(--muted)] italic">
                  By joining, {registering.entryCoins} BBC will be deducted from your wallet.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
