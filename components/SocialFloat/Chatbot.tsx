"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiSend,
  FiX,
  FiCpu,
  FiUser,
  FiTrendingUp,
  FiPackage,
  FiLifeBuoy,
  FiZap,
} from "react-icons/fi";
import { usePathname } from "next/navigation";

/* ================= CONFIG ================= */

const SUPPORT_PHONE = "9178521537";
const SUPPORT_EMAIL = "tusharkantanayak713@gmail.com";

const QUICK_REPLIES = [
  { label: "Support", icon: FiLifeBuoy, action: "support" },
  { label: "Delivery Time", icon: FiZap, action: "delivery" },
];

/* ================= TYPES ================= */

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

type Context = {
  topic?: "pricing" | "support" | "tracking";
  userName?: string;
  unknownCount: number;
};

/* ================= UTILS ================= */

const random = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/* ================= COMPONENT ================= */

export default function ChatBot() {
  const pathname = usePathname();

  /* ---------- STATE ---------- */
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      text: "System Online. 👋 I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  /* ---------- REFS ---------- */
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<Context>({ unknownCount: 0 });

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler, { passive: true });
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ================= ESC KEY CLOSE ================= */

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* ================= SCROLL HIDE / SHOW ================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 60 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  /* ================= BOT BRAIN ================= */

  const getBotResponse = (input: string): string => {
    const msg = input.toLowerCase();
    const ctx = contextRef.current;

    if (msg === "prices") {
      ctx.topic = "pricing";
      return "I can certainly help with that! 💰 MLBB Diamonds start from ₹99. Which game package are you looking for?";
    }

    if (msg === "track") {
      ctx.topic = "tracking";
      return "To track your order, please provide your Order ID. 📦 Most orders are delivered within 5-15 minutes.";
    }

    if (msg === "support") {
      ctx.topic = "support";
      return `Our support team is available 24/7. \n📞 WhatsApp: ${SUPPORT_PHONE}\n📧 Email: ${SUPPORT_EMAIL}`;
    }

    if (msg === "delivery") {
      return "Delivery is near-instant! ⚡ Once your payment is confirmed, diamonds are typically credited within 2 to 10 minutes.";
    }

    const nameMatch = msg.match(/my name is (\w+)/);
    if (nameMatch) {
      ctx.userName = nameMatch[1];
      ctx.unknownCount = 0;
      return `Target identified: ${ctx.userName}. 🎯 Command acknowledged. How can I assist you?`;
    }

    if (/^(hi|hello|hey)/.test(msg)) {
      ctx.unknownCount = 0;
      return random([
        "Greetings. 👋 Looking for top-ups or tactical support?",
        "System ready. 😊 How can I help you today?",
        "Connection established. Hello! How can I assist?",
      ]);
    }

    if (msg.includes("price") || msg.includes("cost") || msg.includes("diamond")) {
      ctx.topic = "pricing";
      ctx.unknownCount = 0;
      return "We offer the most competitive prices! 💎 Standard MLBB pack (284 Diamonds) is currently our best seller. Want to see all prices?";
    }

    if (msg.includes("mlbb"))
      return "MLBB Top-ups are processed instantly. ⚡ Just select your package and provide your Zone ID.";

    if (msg.includes("support") || msg.includes("issue") || msg.includes("help")) {
      ctx.topic = "support";
      ctx.unknownCount = 0;
      return "Understood. 🔧 If you're facing an issue, please contact us on WhatsApp for the fastest resolution.";
    }

    ctx.unknownCount++;
    if (ctx.unknownCount >= 2) {
      return (
        "Tactical analysis inconclusive. 😅\n\n" +
        `Direct uplink for support:\n📞 ${SUPPORT_PHONE}\n📧 ${SUPPORT_EMAIL}`
      );
    }

    return random([
      "Scanning message... Could you provide more details? 🤔",
      "Acknowledged. Please elaborate for more accurate assistance. 🤖",
    ]);
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((p) => [...p, userMsg]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString() + "-res",
          text: getBotResponse(userMsg.text),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  /* ================= UI ================= */

  if (pathname?.startsWith("/login")) return null;

  return (
    <motion.div
      ref={chatRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
      }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 left-4 z-[60]"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
            className="mb-3 w-[340px] sm:w-[380px] h-[520px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_color-mix(in_srgb,var(--accent)_30%,transparent)] flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {/* Scanline Effect */}
            <motion.div
              animate={{ y: ["0%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--accent) 3%, transparent), transparent)",
                height: "10%",
              }}
            />

            {/* Header */}
            <div className="relative z-10 bg-gradient-to-r from-[var(--accent)]/20 to-transparent p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                    <FiCpu className="text-white text-lg" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">TACTICAL AI</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">System Core v2.0</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/5"
              >
                <FiX />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto relative z-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${m.sender === "user" ? "bg-white/10" : "bg-[var(--accent)]/20 border border-[var(--accent)]/30"}`}>
                      {m.sender === "user" ? <FiUser className="text-white/60" /> : <FiCpu className="text-[var(--accent)]" />}
                    </div>
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl max-w-[80%] text-[13px] leading-relaxed shadow-sm ${m.sender === "user"
                        ? "bg-[var(--accent)] text-white font-medium rounded-tr-none"
                        : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"
                        }`}
                    >
                      {m.text}
                      <span className={`block mt-1 text-[9px] ${m.sender === "user" ? "text-white/60" : "text-white/30"}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                    <FiCpu className="text-[var(--accent)] text-xs animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-white/5">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.action}
                  onClick={() => handleSendMessage(reply.action)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] whitespace-nowrap hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/40 hover:text-white transition-all"
                >
                  <reply.icon className="text-[var(--accent)]" />
                  {reply.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(message); }}
              className="p-4 bg-gradient-to-t from-black/40 to-transparent relative z-10"
            >
              <div className="relative group">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Initiate command..."
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 outline-none text-[13px] text-white placeholder:text-white/20 focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent)]/40 disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                >
                  <FiSend className="text-sm" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full" />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-[0_4px_20px_color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center border border-white/20 ring-1 ring-white/10 group-hover:shadow-[0_4px_25px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-all overflow-hidden">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <FiX className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <FiMessageSquare className="text-2xl drop-shadow-md" />
                {/* Tactical Dot */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a1a1a]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  );
}
