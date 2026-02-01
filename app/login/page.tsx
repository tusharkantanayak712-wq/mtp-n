"use client";

import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiZap,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiTerminal
} from "react-icons/fi";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userName, setUserName] = useState("");
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleGoogleLogin = async (credential: string) => {
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Authentication Protocol Failed");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("userId", data.user.userId);
      sessionStorage.setItem("phone", data.user.phone || "");
      sessionStorage.setItem("avatar", data.user.avatar || "");

      setUserName(data.user.name);
      setSuccess("done");

      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 1500);
    } catch {
      setError("Nexus Connection Interrupted");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#020202]">
      {/* TACTICAL BACKGROUND ASSETS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(var(--accent-rgb),0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[2.5rem] bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/5 shadow-2xl overflow-hidden relative group">
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

          <div className="px-8 pt-12 pb-10">
            {/* TERMINAL HEADER */}
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-[var(--accent)]/10 border border-[var(--accent)]/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)] mb-6 relative group"
              >
                <Image
                  src="/logoBB.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="z-10 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[var(--accent)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-[0.2em] text-[8px] font-black text-[var(--accent)] italic">
                  <FiTerminal className="animate-pulse" />
                  Identity Verification
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                  SECURE <span className="text-[var(--accent)]">LOGIN</span>
                </h1>

              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STATUS MESSAGES */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  className="mb-8 p-5 rounded-3xl bg-green-500/10 border border-green-500/20 flex flex-col items-center gap-3 text-center overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-green-500 mb-0.5">Access Granted</h3>
                    <p className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest leading-none">Redirecting to Operative Dashboard</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  className="mb-8 p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center gap-3 text-center overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(239,44,44,0.3)]">
                    <FiAlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-red-500 mb-0.5">Critical Error</h3>
                    <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-none">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION AREA */}
            {!success && (
              <div className="space-y-10">
                <div className={`flex justify-center transition-all duration-500 hover:scale-[1.02] active:scale-95 ${loading ? "opacity-40 grayscale pointer-events-none" : ""
                  }`}>
                  <div className="p-[2px] rounded-full bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]">
                    <div className="bg-[#050505] rounded-full p-1 border border-white/5">
                      <GoogleLogin
                        onSuccess={(res) => res.credential && handleGoogleLogin(res.credential)}
                        onError={() => setError("Handshake Terminated by User")}
                        theme="filled_black"
                        size="large"
                        shape="pill"
                        text="continue_with"
                      />
                    </div>
                  </div>
                </div>

                {/* TACTICAL DIVIDER */}
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-30 italic">Nexus Link</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* FEATURES - TACTICAL GRID */}
                <div className="grid grid-cols-3 gap-4">
                  <Feature icon={FiShield} label="Encrypted" />
                  <Feature icon={FiZap} label="Instant" />
                  <Feature icon={FiActivity} label="Dynamic" />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          {!success && (
            <div className="px-8 py-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
              <p className="text-[9px] text-center text-[var(--muted)] font-bold uppercase tracking-[0.15em] leading-relaxed opacity-40">
                Authorized Use Only. By proceeding you sync with our{" "}
                <a href="/terms" className="text-[var(--accent)] hover:text-white transition-colors underline decoration-[var(--accent)]/40 underline-offset-4">Terms</a>
                {" • "}
                <a href="/privacy" className="text-[var(--accent)] hover:text-white transition-colors underline decoration-[var(--accent)]/40 underline-offset-4">Privacy</a>
              </p>
            </div>
          )}
        </div>

        {/* SECURITY STATUS */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 select-none">
              <FiLock className="text-green-500" size={12} />
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[var(--muted)]/60">
                Hardware Secured • <span className="text-green-500">Google OAuth 2.0</span>
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function Feature({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]/20 transition-all duration-300">
      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-all">
        <Icon size={16} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}
