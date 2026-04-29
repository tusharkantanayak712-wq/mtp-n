"use client";

import { useEffect, useState } from "react";
import { FiAward, FiCalendar, FiUsers, FiLoader, FiChevronRight, FiClock, FiChevronLeft, FiLock, FiInfo, FiX, FiCheckCircle, FiCopy } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 5;

export default function JoinedTournaments() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/tournaments/register", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setEntries(data.data || []);
        } else {
          console.error("Tournament fetch failed:", data.message);
          setEntries([]);
        }
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Simple feedback could be added here
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3 border border-dashed border-[var(--border)] rounded-3xl">
        <FiLoader size={24} className="animate-spin text-[var(--accent)]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Syncing Scrims...</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)]/10">
        <div className="w-16 h-16 rounded-[2rem] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mx-auto opacity-30">
          <FiAward size={32} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[var(--foreground)] opacity-60">No Active Registrations</p>
          <p className="text-[10px] text-[var(--muted)] italic">You haven't joined any tournaments yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reminder Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-start gap-3"
      >
        <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
          <FiInfo size={12} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">HOW TO JOIN</p>
          <p className="text-[9px] text-[var(--muted)] italic leading-relaxed">Room ID will come here 15-30 mins before game. Please <span className="text-[var(--accent)] font-bold uppercase">join 5 mins before</span> start time.</p>
        </div>
      </motion.div>

      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">My Entries ({entries.length})</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/30">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-[var(--foreground)]/[0.03] border-b border-[var(--border)]">
              <th className="w-[35%] px-2 py-2 text-[7px] font-black uppercase tracking-wider text-[var(--muted)]">Tournament</th>
              <th className="w-[15%] px-1 py-2 text-[7px] font-black uppercase tracking-wider text-[var(--muted)] text-center">Format</th>
              <th className="w-[25%] px-1 py-2 text-[7px] font-black uppercase tracking-wider text-[var(--muted)] text-center">Time</th>
              <th className="w-[25%] px-2 py-2 text-[7px] font-black uppercase tracking-wider text-[var(--muted)] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            <AnimatePresence mode="wait">
              {currentItems.map((entry, idx) => (
                <motion.tr
                  key={entry._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedEntry(entry)}
                  className="hover:bg-[var(--foreground)]/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                        <FiAward size={10} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-[var(--foreground)] uppercase truncate">{entry.tournamentId?.title || "Scrim"}</p>
                        <p className="text-[6px] text-[var(--muted)] uppercase tracking-tighter truncate">{entry.tournamentId?.game || "MLBB"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-3 text-center">
                    <span className="text-[8px] font-bold text-[var(--muted)] uppercase">{entry.tournamentId?.format?.split(' ')[0] || "1v1"}</span>
                  </td>
                  <td className="px-1 py-3 text-center">
                    <div className="flex flex-col items-center leading-none gap-0.5">
                      <div className="text-[8px] font-black text-[var(--foreground)] uppercase">
                        {entry.tournamentId?.startsAt ? new Date(entry.tournamentId.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBA"}
                      </div>
                      <div className="text-[6px] text-[var(--muted)] uppercase tracking-tighter opacity-60">
                        {entry.tournamentId?.startsAt ? new Date(entry.tournamentId.startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "DATE TBA"}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter border ${
                      entry.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      entry.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <p className="text-[8px] text-[var(--muted)] uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[280px] rounded-[1.5rem] bg-[var(--background)] border border-[var(--border)] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 pb-0 flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-[1px] bg-[var(--accent)]" />
                    <span className="text-[7px] font-black uppercase tracking-[0.3em] text-[var(--accent)] italic">Details</span>
                  </div>
                  <h3 className="text-base font-[900] italic tracking-tighter uppercase leading-none text-[var(--foreground)]">
                    {selectedEntry.tournamentId?.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="p-1.5 rounded-lg bg-[var(--foreground)]/5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  <FiX size={14} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Status & Info Row */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--foreground)]/[0.02] border border-[var(--border)]">
                   <div className="flex flex-col">
                     <span className="text-[6px] font-black uppercase tracking-widest text-[var(--muted)]">Status</span>
                     <span className={`text-[8px] font-black uppercase ${selectedEntry.status === "confirmed" ? "text-emerald-400" : "text-yellow-400"}`}>
                       {selectedEntry.status}
                     </span>
                   </div>
                   <div className="flex flex-col text-right">
                     <span className="text-[6px] font-black uppercase tracking-widest text-[var(--muted)]">Format</span>
                     <span className="text-[8px] font-black uppercase text-[var(--foreground)]">{selectedEntry.tournamentId?.format || "1v1"}</span>
                   </div>
                </div>

                {/* Time & Game IDs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.01]">
                    <p className="text-[6px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Game Time</p>
                    <p className="text-[9px] font-bold text-[var(--foreground)]">
                      {selectedEntry.tournamentId?.startsAt ? new Date(selectedEntry.tournamentId.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBA"}
                    </p>
                    <p className="text-[7px] text-[var(--muted)]">
                      {selectedEntry.tournamentId?.startsAt ? new Date(selectedEntry.tournamentId.startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "Date TBA"}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.01]">
                    <p className="text-[6px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">My ID</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntry.gameIds.slice(0, 2).map((id, i) => (
                        <span key={i} className="text-[8px] font-mono text-[var(--foreground)]">{id}</span>
                      ))}
                      {selectedEntry.gameIds.length > 2 && <span className="text-[7px] text-[var(--muted)]">+{selectedEntry.gameIds.length - 2}</span>}
                    </div>
                  </div>
                </div>

                {/* Room Info Section */}
                <div className="p-3 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <FiLock size={10} className="text-[var(--accent)]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]">Room Details</span>
                  </div>

                  {selectedEntry.tournamentId?.roomId ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
                        <span className="text-[7px] font-black uppercase text-[var(--muted)]">ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--accent)]">{selectedEntry.tournamentId.roomId}</span>
                          <button onClick={() => copyToClipboard(selectedEntry.tournamentId.roomId)} className="text-[var(--muted)] hover:text-[var(--accent)]"><FiCopy size={10}/></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
                        <span className="text-[7px] font-black uppercase text-[var(--muted)]">Pass:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[var(--foreground)]">{selectedEntry.tournamentId.roomPassword || "None"}</span>
                          {selectedEntry.tournamentId.roomPassword && <button onClick={() => copyToClipboard(selectedEntry.tournamentId.roomPassword)} className="text-[var(--muted)] hover:text-[var(--accent)]"><FiCopy size={10}/></button>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[8px] text-[var(--muted)] italic text-center py-2 border border-dashed border-[var(--accent)]/20 rounded-xl">
                      ID will appear 15-30 mins before game.
                    </p>
                  )}
                </div>

                {/* Join Reminder */}
                <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-2">
                  <FiClock size={12} className="text-amber-500" />
                  <p className="text-[7px] text-amber-500 font-black uppercase">Join 5 mins before start!</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
