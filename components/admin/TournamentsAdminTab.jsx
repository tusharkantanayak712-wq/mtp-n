"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiLoader, FiUsers, FiAward } from "react-icons/fi";

const GAMES = ["mlbb", "freefire", "codm", "honorkings", "other"];
const STATUSES = ["upcoming", "open", "closed", "ended"];

const emptyForm = {
  game: "mlbb",
  title: "",
  subtitle: "",
  format: "",
  prize: "Weekly Pass",
  slots: 16,
  entryCoins: 0,
  status: "upcoming",
  startsAt: "",
  endsAt: "",
  roomId: "",
  roomPassword: "",
};

const STATUS_COLOR = {
  open: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  upcoming: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  closed: "text-red-400 bg-red-500/10 border-red-500/20",
  ended: "text-[var(--muted)] bg-[var(--border)]/20 border-[var(--border)]",
};

export default function TournamentsAdminTab() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  // Inline confirm state — { id, type: "end" | "delete" }
  const [confirmAction, setConfirmAction] = useState(null);

  const token = () => localStorage.getItem("token");

  /* ── Fetch ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      setTournaments(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  /* ── Create / Update ── */
  const handleSubmit = async () => {
    if (!form.title || !form.format || !form.slots) {
      flash("Title, format and slots are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slots: Number(form.slots), entryCoins: Number(form.entryCoins), startsAt: form.startsAt || null, endsAt: form.endsAt || null, roomId: form.roomId, roomPassword: form.roomPassword };

      const res = await fetch(
        editId ? `/api/tournaments/${editId}` : "/api/tournaments",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        flash(editId ? "Updated!" : "Created!");
        setShowForm(false);
        setEditId(null);
        setForm(emptyForm);
        fetchAll();
      } else {
        flash(data.message || "Error");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── End Tournament (quick status change) ── */
  const endTournament = (id) => setConfirmAction({ id, type: "end" });

  /* ── Delete ── */
  const deleteTournament = (id) => setConfirmAction({ id, type: "delete" });

  /* ── Execute confirmed action ── */
  const executeConfirm = async () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;
    setConfirmAction(null);
    if (type === "end") {
      await fetch(`/api/tournaments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ status: "ended" }),
      });
    } else {
      await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
    }
    fetchAll();
  };

  /* ── Open Edit ── */
  const openEdit = (t) => {
    setForm({
      game: t.game,
      title: t.title,
      subtitle: t.subtitle || "",
      format: t.format,
      prize: t.prize || "Weekly Pass",
      slots: t.slots,
      entryCoins: t.entryCoins || 0,
      status: t.status,
      startsAt: t.startsAt ? t.startsAt.slice(0, 16) : "",
      endsAt: t.endsAt ? t.endsAt.slice(0, 16) : "",
      roomId: t.roomId || "",
      roomPassword: t.roomPassword || "",
    });
    setEditId(t._id);
    setShowForm(true);
  };

  const [viewEntries, setViewEntries] = useState(null); // stores tournament object
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const fetchEntries = async (tournamentId) => {
    setEntriesLoading(true);
    try {
      const res = await fetch(`/api/admin/tournaments/entries?tournamentId=${tournamentId}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) setEntries(data.data);
    } finally {
      setEntriesLoading(false);
    }
  };

  const openEntries = (t) => {
    setViewEntries(t);
    setEntries([]);
    fetchEntries(t._id);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">Tournaments</h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">Create, edit and end tournaments</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)]/20 transition-colors"
        >
          <FiPlus size={14} /> New Tournament
        </button>
      </div>

      {msg && (
        <div className="px-4 py-2 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--accent)] font-semibold">
          {msg}
        </div>
      )}

      {/* ── Create / Edit Form ── */}
      {showForm && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[var(--foreground)]">{editId ? "Edit Tournament" : "New Tournament"}</p>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="text-[var(--muted)] hover:text-[var(--foreground)]"><FiX size={16} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Game */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Game</label>
              <select value={form.game} onChange={e => setForm(f => ({ ...f, game: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50">
                {GAMES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50">
                {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="5v5 Squad Scrims"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Subtitle */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="Short tagline..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Format */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Format *</label>
              <input value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
                placeholder="5v5 · Best of 3"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Prize */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Prize</label>
              <input value={form.prize} onChange={e => setForm(f => ({ ...f, prize: e.target.value }))}
                placeholder="Weekly Pass"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Slots */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Total Slots *</label>
              <input type="number" min={2} value={form.slots} onChange={e => setForm(f => ({ ...f, slots: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Entry Coins */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Entry Coins (0 = Free)</label>
              <input type="number" min={0} value={form.entryCoins} onChange={e => setForm(f => ({ ...f, entryCoins: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Starts At */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Starts At (optional)</label>
              <input type="datetime-local" value={form.startsAt} onChange={e => setForm(f => ({ ...f, startsAt: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>

            {/* Room Info */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">Room ID</label>
                <input value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}
                  placeholder="e.g. 123456"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">Room Password</label>
                <input value={form.roomPassword} onChange={e => setForm(f => ({ ...f, roomPassword: e.target.value }))}
                  placeholder="e.g. 7890"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Ends At (optional)</label>
              <input type="datetime-local" value={form.endsAt} onChange={e => setForm(f => ({ ...f, endsAt: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]/50" />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? <FiLoader size={13} className="animate-spin" /> : <FiCheck size={13} />}
              {editId ? "Save Changes" : "Create Tournament"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Tournament List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <FiLoader size={20} className="animate-spin text-[var(--muted)]" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="py-12 text-center text-[var(--muted)] text-xs">No tournaments yet. Create one above.</div>
      ) : (
        <div className="space-y-3">
          {tournaments.map((t) => {
            const isPending = confirmAction?.id === t._id;
            return (
              <div key={t._id} className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        {t.game}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_COLOR[t.status] || STATUS_COLOR.ended}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[var(--foreground)] truncate">{t.title}</p>
                    <p className="text-[10px] text-[var(--muted)]">{t.format} · Prize: {t.prize}</p>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-[var(--muted)]">
                      <span className="flex items-center gap-1"><FiUsers size={10} /> {t.slotsFilled}/{t.slots} slots</span>
                      <span className="flex items-center gap-1"><FiAward size={10} /> {t.entryCoins === 0 ? "Free" : `${t.entryCoins} coins`}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEntries(t)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[10px] font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      View Entries
                    </button>
                    <button
                      onClick={() => openEdit(t)}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    {t.status !== "ended" && (
                      <button
                        onClick={() => endTournament(t._id)}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[10px] font-bold text-[var(--muted)] hover:text-orange-400 hover:border-orange-400/30 transition-colors disabled:opacity-40"
                        title="End tournament"
                      >
                        End
                      </button>
                    )}
                    <button
                      onClick={() => deleteTournament(t._id)}
                      disabled={isPending}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Inline confirm strip */}
                {isPending && (
                  <div className={`px-4 py-3 border-t flex items-center justify-between gap-3 text-[11px] font-bold ${
                    confirmAction.type === "delete"
                      ? "bg-red-500/5 border-red-500/20 text-red-400"
                      : "bg-orange-500/5 border-orange-500/20 text-orange-400"
                  }`}>
                    <span className="uppercase tracking-wide">
                      {confirmAction.type === "delete"
                        ? "⚠️ Delete this tournament permanently?"
                        : "Mark this tournament as ENDED?"}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={executeConfirm}
                        className={`px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest ${
                          confirmAction.type === "delete" ? "bg-red-500 hover:bg-red-400" : "bg-orange-500 hover:bg-orange-400"
                        } transition-colors`}
                      >
                        Yes, {confirmAction.type === "delete" ? "Delete" : "End"}
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1 rounded-lg border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Entries Modal ── */}
      {viewEntries && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Entries: {viewEntries.title}</h3>
                <p className="text-xs text-[var(--muted)]">{viewEntries.format} · {viewEntries.slotsFilled} Joined</p>
              </div>
              <button onClick={() => setViewEntries(null)} className="w-8 h-8 rounded-full bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)]"><FiX size={18} /></button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {entriesLoading ? (
                <div className="flex items-center justify-center py-20"><FiLoader size={24} className="animate-spin text-[var(--muted)]" /></div>
              ) : entries.length === 0 ? (
                <div className="py-20 text-center text-[var(--muted)] text-sm italic">No entries yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                        <th className="px-4 py-3 font-bold uppercase tracking-widest">Player/User</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest">Contact</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest">Game IDs</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest">Status</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {entries.map((e) => (
                        <tr key={e._id} className="hover:bg-[var(--foreground)]/[0.02]">
                          <td className="px-4 py-3">
                            <div className="font-bold">{e.userId?.name || "N/A"}</div>
                            <div className="text-[10px] text-[var(--muted)] uppercase">ID: {e.userId?.userId || "N/A"}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div>{e.contactEmail}</div>
                            <div>{e.contactPhone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {e.gameIds.map((id, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-[var(--foreground)]/5 border border-[var(--border)] font-mono text-[10px]">{id}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest">{e.status}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-[10px] text-[var(--muted)]">
                            {new Date(e.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
