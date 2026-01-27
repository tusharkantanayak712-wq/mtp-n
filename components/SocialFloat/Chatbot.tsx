"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  FaComments,
  FaPaperPlane,
  FaRobot,
  FaXmark,
} from "react-icons/fa6";

/* ================= CONFIG ================= */

const SUPPORT_PHONE = "6372305866";
const SUPPORT_EMAIL = "tusharkantanayak713@gmail.com";

const ALLOWED_ROUTES = ["/", "/home"];

/* ================= TYPES ================= */

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

type Context = {
  topic?: "pricing" | "support";
  userName?: string;
  unknownCount: number;
};

/* ================= UTILS ================= */

const random = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

/* ================= COMPONENT ================= */

export default function ChatBot() {
  /* ---------- ROUTE GUARD ---------- */
  // const pathname = usePathname();
  // if (!ALLOWED_ROUTES.includes(pathname)) return null;

  /* ---------- STATE ---------- */
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      text: "Hi 👋 I’m your assistant. How can I help you today?",
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

    document.addEventListener("mousedown", handler);
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

    const nameMatch = msg.match(/my name is (\w+)/);
    if (nameMatch) {
      ctx.userName = nameMatch[1];
      ctx.unknownCount = 0;
      return `Nice to meet you, ${ctx.userName} 😊 How can I help?`;
    }

    if (/^(hi|hello|hey)/.test(msg)) {
      ctx.unknownCount = 0;
      return random([
        "Hey! 👋 What are you looking for today?",
        "Hi there 😊 Need prices, top-ups, or support?",
        "Hello! How can I assist you today?",
      ]);
    }

    if (msg.includes("price") || msg.includes("cost")) {
      ctx.topic = "pricing";
      ctx.unknownCount = 0;
      return "Sure 💰 Which game are you checking prices for? (MLBB / PUBG)";
    }

    if (ctx.topic === "pricing") {
      if (msg.includes("mlbb"))
        return "MLBB diamonds start from ₹99 ⚡ Instant delivery.";
      if (msg.includes("pubg"))
        return "PUBG UC prices depend on pack size 🎮 Small or large packs?";
    }

    if (msg.includes("support") || msg.includes("issue")) {
      ctx.topic = "support";
      ctx.unknownCount = 0;
      return "I’m sorry about that 😕 Is it a payment issue or delivery issue?";
    }

    ctx.unknownCount++;

    if (ctx.unknownCount >= 2) {
      return (
        "I might be missing something 😅\n\n" +
        `📞 Customer Support: ${SUPPORT_PHONE}\n` +
        `📧 Email: ${SUPPORT_EMAIL}`
      );
    }

    return random([
      "Hmm 🤔 Can you explain a bit more?",
      "Got it 👍 Could you give me more details?",
    ]);
  };

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
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
          id: Date.now().toString(),
          text: getBotResponse(userMsg.text),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 700 + Math.random() * 600);
  };

  /* ================= UI ================= */

  return (
    <div
      ref={chatRef}
      className={`
        fixed bottom-6 left-6 z-50
        transition-all duration-300
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }
      `}
    >
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>

            {/* ❌ Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              aria-label="Close chat"
            >
              <FaXmark />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${
                  m.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <FaRobot />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-indigo-500 text-white rounded-tr-sm"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-xs opacity-60">typing…</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200 dark:border-zinc-700 flex gap-2"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 outline-none text-sm"
            />
            <button
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center disabled:opacity-50"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl flex items-center justify-center"
      >
        <FaComments />
      </button>
    </div>
  );
}
