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
  FiMail,
  FiShieldOff
} from "react-icons/fi";
import { useSearchParams } from "next/navigation";

import { Suspense, useRef } from "react";

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className="absolute w-1 h-1 bg-[var(--accent)] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function AuthContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpField, setShowOtpField] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus last filled or next input
      const nextIndex = Math.min(index + pastedData.length, 5);
      otpInputs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };
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
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      saveSession(data);
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Please enter your Gmail address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Check your Gmail for the code");
        setShowOtpField(true);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Could not send code. Try again.");
    }
    setLoading(false);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });
      const data = await res.json();
      if (data.success) {
        saveSession(data);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Authentication failed");
    }
    setLoading(false);
  };

  const saveSession = (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("userId", data.user.userId);
    localStorage.setItem("userType", data.user.userType);
    localStorage.setItem("phone", data.user.phone || "");
    localStorage.setItem("avatar", data.user.avatar || "");
    setUserName(data.user.name);
    setSuccess("done");
    setTimeout(() => window.location.replace(redirectPath), 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-8 sm:pt-20 px-4 overflow-hidden bg-[var(--background)]">
      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(var(--accent-rgb),0.15),transparent_70%)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-20" />
        <ParticleBackground />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="w-full relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="px-6 pb-4 sm:px-8 sm:pb-4"
          >
            {/* HEADER */}
            <div className="flex flex-col items-center text-center mb-4">
              <motion.div
                variants={itemVariants}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-[var(--accent)] blur-2xl opacity-20 animate-pulse" />
                <div className="relative p-1 rounded-full overflow-hidden">
                  <div className="absolute inset-0 animate-rotate-gradient bg-[conic-gradient(from_0deg,transparent,var(--accent),transparent)] opacity-40" />
                  <div className="relative bg-[var(--background)] p-2 rounded-full border border-[var(--border)] shadow-xl">
                    <Image
                      src="/logoBB.png"
                      alt="Logo"
                      width={64}
                      height={64}
                      className="relative z-10"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[var(--foreground)] to-[var(--foreground)]/60 drop-shadow-sm">
                  {showOtpField ? "Enter Your Code" : "Login"}
                </h1>
                <p className="text-xs font-medium text-[var(--muted)]/80 tracking-wide uppercase">
                  {showOtpField ? "Enter the code we sent to your email" : "Sign in to your account"}
                </p>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {success && success !== "done" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2 text-center"
                >
                  <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{success}</span>
                </motion.div>
              )}

              {success === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500 text-white flex items-center justify-center gap-2 text-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <FiCheckCircle size={20} />
                  <span className="text-sm font-black uppercase tracking-widest">You're In! Redirecting...</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2 text-center"
                >
                  <FiAlertCircle className="text-red-500 flex-shrink-0" size={14} />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION AREA */}
            {success !== "done" && (
              <motion.div variants={containerVariants} className="space-y-6">

                {/* GMAIL OTP SECTION */}
                <motion.form
                  variants={itemVariants}
                  onSubmit={showOtpField ? handleOtpVerify : handleSendOtp}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-[var(--muted)] pointer-events-none group-focus-within:text-[var(--accent)] transition-colors">
                        <FiMail size={18} />
                      </div>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={showOtpField}
                        className={`w-full bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/50 ${showOtpField ? "opacity-50" : ""}`}
                      />
                      {showOtpField && (
                        <button
                          type="button"
                          onClick={() => { setShowOtpField(false); setOtp(["", "", "", "", "", ""]); setSuccess(""); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-[var(--accent)] hover:underline"
                        >
                          Change
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {showOtpField && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="overflow-hidden space-y-4"
                        >
                          <div className="grid grid-cols-6 gap-2">
                            {otp.map((digit, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <input
                                  ref={(el) => {
                                    otpInputs.current[idx] = el;
                                  }}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(idx, e)}
                                  required
                                  autoFocus={idx === 0}
                                  className="w-full aspect-square text-center bg-[var(--foreground)]/[0.03] border border-[var(--border)] rounded-xl text-xl font-black focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 transition-all shadow-sm"
                                />
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center px-1">
                            <p className="text-[10px] text-[var(--muted)]/60 font-medium italic">Didn't get it?</p>
                            <button type="button" onClick={() => handleSendOtp()} className="text-[10px] font-black uppercase text-[var(--accent)] hover:text-[var(--foreground)] transition-colors">Resend Code</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative overflow-hidden group/btn bg-[var(--accent)] text-white font-black uppercase tracking-widest py-3.5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.3)]"
                    >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center gap-2">
                          {showOtpField ? (
                            <>Verify & Login <FiCheckCircle className="text-lg" /></>
                          ) : (
                            <>Send Code to Email <FiZap className="text-lg" /></>
                          )}
                        </span>
                      </>
                    )}
                  </button>
                </motion.form>

                {/* DIVIDER */}
                <div className="relative flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-[var(--border)]/30" />
                  <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">Or sign in with</span>
                  <div className="h-[1px] flex-1 bg-[var(--border)]/30" />
                </div>

                {/* GOOGLE SECTION (Always Available) */}
                 <motion.div variants={itemVariants} className={`relative flex justify-center w-full ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="w-full max-w-xs transition-transform hover:scale-[1.02] active:scale-[0.98] relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500" />
                    <div className="relative bg-[var(--background)] rounded-full border border-[var(--border)] overflow-hidden shadow-sm">
                      <GoogleLogin
                        onSuccess={(res) => res.credential && handleGoogleLogin(res.credential)}
                        onError={() => setError("Connection Failed")}
                        theme="filled_black"
                        size="large"
                        shape="pill"
                        width="300"
                        text="signin_with"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* TRUST FOOTER */}
                <motion.div variants={itemVariants} className="pt-8 space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <Feature icon={FiShield} label="Encrypted" />
                    <Feature icon={FiZap} label="Instant" />
                    <Feature icon={FiActivity} label="Monitoring" />
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-[9px] font-bold text-[var(--muted)]/50 uppercase tracking-widest leading-relaxed">
                      By continuing you agree to our <a href="/terms" className="text-[var(--accent)] hover:underline">Terms</a>
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--foreground)]/[0.02] border border-[var(--border)]/50">
                        <FiLock size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]/70">Your data is safe with us</span>
                      </div>
                      <a
                        href="tel:+919178521537"
                        className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest hover:brightness-125 transition-all"
                      >
                        Support: +91 9178521537
                      </a>
                      <p className="text-[7px] text-[var(--muted)]/30 uppercase tracking-[0.2em] animate-pulse">Need help? Call us anytime</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}

function Feature({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-[var(--foreground)]/[0.02] border border-[var(--border)] hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]/20 transition-all duration-300">
      <div className="w-7 h-7 rounded-lg bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-all">
        <Icon size={14} />
      </div>
      <span className="text-[7px] font-black uppercase tracking-widest text-[var(--muted)]/80 group-hover:text-[var(--foreground)] transition-colors">{label}</span>
    </div>
  );
}
