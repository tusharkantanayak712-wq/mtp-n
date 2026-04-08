"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FiChevronDown, FiZap, FiTarget, FiMail } from "react-icons/fi";

const SUPPORT_CONFIG = {
  header: {
    title: "Support",
    highlight: "Help",
    subtitle: "How can we help you today?",
  },
  contacts: {
    title: "Quick Contact",
    items: [
      { id: "phone", title: "Phone", value: "+91 9178521537", href: "tel:+919178521537", icon: <FaPhoneAlt /> },
      { id: "instagram", title: "Instagram", value: "@mlbbtopup.in", href: "https://www.instagram.com/mlbbtopup.in", icon: <FaInstagram /> },
      { id: "youtube", title: "YouTube", value: "Subscribe", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaYoutube /> },
      { id: "whatsapp", title: "WhatsApp", value: "Chat now", href: "https://whatsapp.com/channel/0029Vb87jgR17En1n5PKy129", icon: <FaWhatsapp /> },
    ],
  },
  queryTypes: ["Order Issue", "Payment Failure", "Wallet Issue", "General"],
};

export default function QueryTab() {
  const [queryType, setQueryType] = useState("");
  const [queryMessage, setQueryMessage] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [orderId, setOrderId] = useState("");
  const [querySuccess, setQuerySuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (data.success) setQuerySuccess("Message sent successfully!");
      else setQuerySuccess(data.message || "Failed to send. Try again.");
      setQueryType(""); setQueryMessage(""); setOrderId("");
    } catch {
      setQuerySuccess("Connection error. Try again.");
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
          <span className="text-[8px] font-black uppercase tracking-widest text-[var(--accent)]">Help Desk</span>
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
              <span className="text-[8px] font-black tracking-widest text-[#22c55e] uppercase">Online Now</span>
            </div>
            <span className="text-[8px] font-black tracking-widest text-[var(--muted)] uppercase opacity-40">Response: ~15m</span>
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
                <option value="" className="bg-[var(--card)]">Select Category</option>
                {SUPPORT_CONFIG.queryTypes.map((type) => (
                  <option key={type} value={type} className="bg-[var(--card)]">{type.toUpperCase()}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]" size={14} />
            </div>

            <textarea
              className="w-full p-4 rounded-2xl h-24 bg-[var(--background)]/50 border border-white/5 text-[11px] font-bold tracking-wider outline-none focus:border-[var(--accent)] resize-none transition-all placeholder:text-[var(--muted)]/40 text-[var(--foreground)]"
              placeholder="Tell us what's happening..."
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
            />

            <input
              type="tel"
              className="w-full p-3.5 rounded-xl bg-[var(--background)]/50 border border-white/5 text-[10px] font-black tracking-widest outline-none focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)]/40"
              placeholder="Phone No *"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />

            <input
              type="text"
              className="w-full p-3.5 rounded-xl bg-[var(--background)]/50 border border-white/5 text-[10px] font-black tracking-widest outline-none focus:border-[var(--accent)] text-[var(--foreground)] placeholder:text-[var(--muted)]/40"
              placeholder="Order ID (optional)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            <button
              disabled={!queryType || !queryMessage || !phoneNo.trim() || isSubmitting}
              onClick={handleSubmit}
              className="w-full p-3.5 rounded-2xl bg-[var(--accent)] text-black font-black uppercase tracking-widest italic text-[10px] shadow-lg hover:shadow-[0_8px_16px_-4px_rgba(var(--accent-rgb),0.3)] hover:scale-[1.01] active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <FiZap className="animate-spin" size={14} /> : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
