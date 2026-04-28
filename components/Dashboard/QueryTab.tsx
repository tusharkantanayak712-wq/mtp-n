"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiZap, FiTarget, FiMail, FiRefreshCw, FiClock, FiCheckCircle, FiAlertCircle, FiList } from "react-icons/fi";

const SUPPORT_CONFIG = {
  header: {
    title: "Support",
    highlight: "Help",
    subtitle: "How can we help you today?",
  },
  contacts: {
    title: "Contact Us",
    items: [
      { id: "phone", title: "Phone", value: "+91 9178521537", href: "tel:+919178521537", icon: <FaPhoneAlt /> },
      { id: "instagram", title: "Instagram", value: "@mlbbtopup.in", href: "https://www.instagram.com/mlbbtopup.in", icon: <FaInstagram /> },
      { id: "youtube", title: "YouTube", value: "Subscribe", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaYoutube /> },
      { id: "whatsapp", title: "WhatsApp", value: "Chat now", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaWhatsapp /> },
    ],
  },
  queryTypes: ["Order Issue", "Payment Failure", "Wallet Issue", "General"],
};

type Query = {
  _id: string;
  type: string;
  message: string;
  status: string;
  orderId?: string;
  adminReply?: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: "Pending",     color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: <FiClock size={10} /> },
  open:        { label: "Open",        color: "text-blue-400 bg-blue-400/10 border-blue-400/20",       icon: <FiAlertCircle size={10} /> },
  in_progress: { label: "In Progress", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: <FiClock size={10} /> },
  resolved:    { label: "Resolved",    color: "text-green-400 bg-green-400/10 border-green-400/20",    icon: <FiCheckCircle size={10} /> },
  closed:      { label: "Closed",      color: "text-[var(--muted)] bg-white/5 border-white/10",        icon: <FiCheckCircle size={10} /> },
};

export default function QueryTab() {
  const [queryType, setQueryType] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [orderId, setOrderId] = useState("");
  const [querySuccess, setQuerySuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myQueries, setMyQueries] = useState<Query[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [showMyQueries, setShowMyQueries] = useState(true);
  const [queryPage, setQueryPage] = useState(1);
  const [queryPagination, setQueryPagination] = useState({ total: 0, totalPages: 1 });
  const QUERY_LIMIT = 10;
  const hasNewReply = myQueries.some((q) => q.adminReply);

  const fetchMyQueries = useCallback(async (page = 1) => {
    const email = localStorage.getItem("email");
    if (!email) return;
    setLoadingQueries(true);
    try {
      const res = await fetch(
        `/api/support/query?email=${encodeURIComponent(email)}&page=${page}&limit=${QUERY_LIMIT}`
      );
      const data = await res.json();
      if (data.success) {
        setMyQueries(data.queries || []);
        setQueryPagination(data.pagination || { total: 0, totalPages: 1 });
      }
    } catch {
      // silently fail
    } finally {
      setLoadingQueries(false);
    }
  }, [QUERY_LIMIT]);

  // initial load + auto-refresh every 30s to pick up admin replies
  useEffect(() => {
    fetchMyQueries(queryPage);
    const interval = setInterval(() => fetchMyQueries(queryPage), 30000);
    return () => clearInterval(interval);
  }, [fetchMyQueries, queryPage]);

  const handleSubmit = async () => {
    if (!queryType || !queryMessage.trim() || !phoneNo.trim()) return;
    setIsSubmitting(true);
    const storedEmail = localStorage.getItem("email");
    try {
      const res = await fetch("/api/support/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail,
          phoneNo: phoneNo.trim(),
          orderId: orderId.trim() || null,
          type: queryType,
          message: queryMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuerySuccess("Message sent.");
        setQueryType(""); setQueryMessage(""); setOrderId("");
        setShowMyQueries(true);
        setQueryPage(1);
        await fetchMyQueries(1);
      } else {
        setQuerySuccess(data.message || "Could not send message. Try again.");
      }
    } catch {
      setQuerySuccess("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setQuerySuccess(""), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent)]/5 border border-[var(--accent)]/10 w-fit">
          <FiZap className="text-[var(--accent)] animate-pulse" size={10} />
          <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent)]">Support</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-[var(--foreground)]">
          {SUPPORT_CONFIG.header.title} <span className="text-[var(--accent)]">{SUPPORT_CONFIG.header.highlight}</span>
        </h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">
          {SUPPORT_CONFIG.header.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CONTACTS */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] flex items-center gap-2">
            <FiTarget className="text-[var(--accent)]" size={10} /> {SUPPORT_CONFIG.contacts.title}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORT_CONFIG.contacts.items.map((item, idx) => (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center gap-3 p-3 rounded-xl bg-[var(--card)]/30 border border-white/5 hover:border-[var(--accent)]/30 transition-all shadow-sm"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-tight text-[var(--foreground)] truncate">{item.title}</p>
                  <p className="text-[8px] font-medium text-[var(--muted)]/60 truncate">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-center justify-between border-dashed">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
              <span className="text-[8px] font-black tracking-widest text-[#22c55e] uppercase">We're Online</span>
            </div>
            <span className="text-[8px] font-black tracking-widest text-[var(--muted)] uppercase opacity-40">We reply in ~15 mins</span>
          </div>
        </div>

        {/* FORM */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--card)]/40 border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <FiMail className="text-[var(--accent)]" size={14} />
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-[var(--foreground)]">Send Message</h3>
          </div>

          <AnimatePresence mode="wait">
            {querySuccess && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-2.5 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <FiZap size={10} className="animate-pulse" /> {querySuccess}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <div className="relative">
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[var(--background)]/50 border border-white/5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[var(--accent)] appearance-none cursor-pointer text-[var(--foreground)]"
              >
                <option value="" className="bg-[var(--card)]">What's your issue?</option>
                {SUPPORT_CONFIG.queryTypes.map((type) => (
                  <option key={type} value={type} className="bg-[var(--card)]">{type.toUpperCase()}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]" size={14} />
            </div>

            <textarea
              className="w-full p-4 rounded-2xl h-24 bg-[var(--background)]/50 border border-white/5 text-[11px] font-bold tracking-wider outline-none focus:border-[var(--accent)] resize-none transition-all placeholder:text-[var(--muted)]/40 text-[var(--foreground)]"
              placeholder="Write your problem here..."
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
            />

            <input
              type="tel"
              className="w-full p-3.5 rounded-xl bg-[var(--background)]/50 border border-white/5 text-[10px] font-black tracking-widest outline-none focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)]/40"
              placeholder="Your phone number *"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />

            <input
              type="text"
              className="w-full p-3.5 rounded-xl bg-[var(--background)]/50 border border-white/5 text-[10px] font-black tracking-widest outline-none focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)]/40"
              placeholder="Order ID (if you have one)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            <button
              disabled={!queryType || !queryMessage || !phoneNo.trim() || isSubmitting}
              onClick={handleSubmit}
              className="w-full p-3.5 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-widest italic text-[10px] shadow-lg hover:shadow-[0_8px_16px_-4px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.01] active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <FiZap className="animate-spin" size={14} /> : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* MY QUERIES SECTION */}
      <div className="rounded-3xl bg-[var(--card)]/30 border border-white/5 overflow-hidden">
        <button
          onClick={() => setShowMyQueries((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <FiList className="text-[var(--accent)]" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">My Queries</span>
            {myQueries.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-[8px] font-black">
                {myQueries.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); fetchMyQueries(); }}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <FiRefreshCw size={12} className={loadingQueries ? "animate-spin" : ""} />
            </button>
            <FiChevronDown
              size={14}
              className={`text-[var(--muted)] transition-transform duration-200 ${showMyQueries ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {showMyQueries && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3">
                {loadingQueries ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-[var(--muted)]/40">
                    <FiRefreshCw size={14} className="animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Loading...</span>
                  </div>
                ) : myQueries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--muted)]/30">
                    <FiMail size={24} />
                    <span className="text-[9px] font-black uppercase tracking-widest">No queries submitted yet</span>
                  </div>
                ) : (
                  myQueries.map((q) => {
                    const statusKey = (q.status || "pending").toLowerCase();
                    const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                    const date = new Date(q.createdAt).toLocaleString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <motion.div
                        key={q._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-[var(--background)]/50 border border-white/5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[var(--accent)] text-[9px] font-black uppercase tracking-widest italic">{q.type}</span>
                            <p className="text-[11px] font-semibold text-[var(--foreground)] leading-snug">{q.message}</p>
                            {q.orderId && (
                              <span className="text-[8px] font-mono text-[var(--muted)]/50 truncate">Order: {q.orderId}</span>
                            )}
                          </div>
                          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusCfg.color}`}>
                            {statusCfg.icon}
                            {statusCfg.label}
                          </span>
                        </div>

                        {/* Admin Reply */}
                        {q.adminReply && (
                          <div className="mt-2 p-3 rounded-xl border space-y-1" style={{ background: "rgba(var(--accent-rgb, 0,200,200),0.08)", borderColor: "rgba(var(--accent-rgb, 0,200,200),0.25)" }}>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--accent)] flex items-center gap-1">
                              <FiCheckCircle size={8} /> Support Reply
                            </p>
                            <p className="text-[11px] text-[var(--foreground)] leading-snug font-medium">{q.adminReply}</p>
                          </div>
                        )}
                        <p className="text-[8px] text-[var(--muted)]/40 font-medium flex items-center gap-1">
                          <FiClock size={8} /> {date}
                        </p>
                      </motion.div>
                    );
                  })
                )}

                {/* Pagination */}
                {queryPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--muted)]/40">
                      {queryPagination.total} total &middot; page {queryPage}/{queryPagination.totalPages}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQueryPage((p) => Math.max(1, p - 1))}
                        disabled={queryPage === 1 || loadingQueries}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--background)]/50 border border-white/5 text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-[9px] font-black uppercase"
                      >
                        <FiChevronLeft size={12} /> Prev
                      </button>
                      <button
                        onClick={() => setQueryPage((p) => Math.min(queryPagination.totalPages, p + 1))}
                        disabled={queryPage === queryPagination.totalPages || loadingQueries}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--background)]/50 border border-white/5 text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-[9px] font-black uppercase"
                      >
                        Next <FiChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
