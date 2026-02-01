"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaHeadset,
  FaPaperPlane,
} from "react-icons/fa";
import { FiChevronDown, FiZap, FiTarget } from "react-icons/fi";

const SUPPORT_CONFIG = {
  header: {
    title: "Support",
    highlight: "Center",
    subtitle: "We are here to help you with any issues or queries.",
  },
  contacts: {
    title: "Contact Methods",
    items: [
      { id: "phone", title: "Phone", value: "+91 6372305866", href: "tel:+916372305866", icon: <FaPhoneAlt /> },
      { id: "instagram", title: "Instagram", value: "@mlbbtopup.in", href: "https://www.instagram.com/mlbbtopup.in", icon: <FaInstagram /> },
      { id: "youtube", title: "YouTube", value: "Subscribe Now", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaYoutube /> },
      { id: "whatsapp", title: "WhatsApp", value: "Chat with us", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaWhatsapp /> },
    ],
  },
  queryTypes: ["Order Issue", "Payment Failure", "Wallet Issue", "General Query"],
};

export default function QueryTab() {
  const [queryType, setQueryType] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [querySuccess, setQuerySuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!queryType || !queryMessage.trim()) return;
    setIsSubmitting(true);
    const storedEmail = sessionStorage.getItem("email");
    const storedPhone = sessionStorage.getItem("phone");
    try {
      const res = await fetch("/api/support/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail, phone: storedPhone, type: queryType, message: queryMessage }),
      });
      const data = await res.json();
      if (data.success) setQuerySuccess("Your query has been submitted.");
      else setQuerySuccess(data.message || "Failed to submit. Please try again.");
      setQueryType(""); setQueryMessage("");
    } catch {
      setQuerySuccess("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setQuerySuccess(""), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-1">
            <FiZap className="text-[var(--accent)] animate-pulse" size={12} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Support Protocol</span>
          </div>
          <h2 className="text-4xl font-[900] uppercase italic tracking-tighter leading-none text-[var(--foreground)]">
            {SUPPORT_CONFIG.header.title} <span className="text-[var(--accent)]">{SUPPORT_CONFIG.header.highlight}</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] opacity-70 max-w-lg leading-relaxed">
            {SUPPORT_CONFIG.header.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* DIRECT ACCESS NODES */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted)] flex items-center gap-2">
            <FiTarget className="text-[var(--accent)]" /> {SUPPORT_CONFIG.contacts.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUPPORT_CONFIG.contacts.items.map((item, idx) => (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative h-full flex items-center gap-3.5 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 overflow-hidden shadow-sm"
              >
                <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1 text-[var(--foreground)]">{item.title}</p>
                  <p className="text-[9px] font-medium text-[var(--muted)] truncate">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="p-5 rounded-[2rem] bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex items-center justify-between border-dashed">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-[9px] font-bold tracking-widest text-[#22c55e] uppercase">Status: Online</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-[var(--muted)] uppercase">Response Time: ~15m</span>
          </div>
        </div>

        {/* QUERY FORM */}
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[var(--background)] border border-[var(--border)] space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-8 text-[var(--foreground)]/5 rotate-12">
            <FaHeadset size={80} />
          </div>

          <h3 className="text-xl font-[900] uppercase italic tracking-tighter relative z-10 text-[var(--foreground)]">Submit a Query</h3>

          <AnimatePresence mode="wait">
            {querySuccess && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                <FiZap size={14} /> {querySuccess}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 relative z-10">
            <div className="relative">
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[var(--accent)] appearance-none cursor-pointer text-[var(--foreground)]"
              >
                <option value="" className="bg-[var(--background)] text-[var(--foreground)]">Select Issue Type</option>
                {SUPPORT_CONFIG.queryTypes.map((type) => (
                  <option key={type} value={type} className="bg-[var(--background)] text-[var(--foreground)]">{type.toUpperCase()}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]" />
            </div>

            <textarea
              className="w-full p-5 rounded-[2rem] h-28 bg-[var(--card)] border border-[var(--border)] text-[12px] font-bold tracking-widest outline-none focus:border-[var(--accent)] resize-none transition-all placeholder:text-[var(--muted)] text-[var(--foreground)]"
              placeholder="Describe your issue..."
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
            />

            <button
              disabled={!queryType || !queryMessage || isSubmitting}
              onClick={handleSubmit}
              className="w-full p-4 rounded-[2rem] bg-[var(--accent)] text-black font-black uppercase tracking-[0.2em] italic text-xs shadow-lg hover:shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {isSubmitting ? <FiZap className="animate-spin" size={18} /> : <>Submit Query PO</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
