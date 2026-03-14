"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiChevronRight, FiLogOut, FiCheckCircle, FiShield, FiZap, FiMenu, FiX, FiLayers, FiCompass, FiGrid, FiShoppingBag, FiMessageSquare, FiUser, FiBell, FiUsers, FiKey, FiGift } from "react-icons/fi";

/* ================= CONFIG ================= */
const HEADER_CONFIG = {
  logo: {
    src: "/logoBB.png",
    alt: "Blue Buff",
    width: 140,
    height: 40,
  },

  nav: [
    { label: "Region Check", href: "/region", icon: <FiCompass size={14} /> },
    { label: "Services", href: "/services", icon: <FiGrid size={14} /> },
  ],

  userMenu: {
    common: [
      { label: "My Orders", href: "/dashboard/orders", icon: <FiShoppingBag size={14} />, desc: "Track your top-ups" },
      { label: "My Wallet", href: "/dashboard/wallet", icon: <FiLayers size={14} />, desc: "Balance & Recharge" },
      { label: "Redeem Code", href: "/dashboard/redeem", icon: <FiGift size={14} />, desc: "Claim gift credits" },
      { label: "Refer & Earn", href: "/dashboard/referral", icon: <FiUsers size={14} />, desc: "Earn rewards" },
      { label: "API Setup", href: "/dashboard/api-keys", icon: <FiKey size={14} />, desc: "Developer API Access" },
      { label: "Membership", href: "/admin-panal", icon: <FiShield size={14} />, desc: "Elite Tier" },
      { label: "Support", href: "/dashboard/support", icon: <FiMessageSquare size={14} />, desc: "Get help 24/7" },
    ],
    roles: {
      owner: { label: "Admin Console", href: "/owner-panal", icon: <FiZap size={14} /> },
    },
  },
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("/");
  const [walletBalance, setWalletBalance] = useState(0);

  const dropdownRef = useRef(null);

  /* ================= PUSH NOTIFICATIONS ================= */
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeToast, setShowSubscribeToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      // @ts-ignore
      window.OneSignalDeferred.push(async (OneSignal) => {
        setIsSubscribed(OneSignal.Notifications.permission === "granted");
        OneSignal.Notifications.addEventListener("permissionChange", (permission) => {
          const granted = permission === "granted";
          setIsSubscribed(granted);
          if (granted) {
            setShowSubscribeToast(true);
            setTimeout(() => setShowSubscribeToast(false), 3000);
          }
        });
      });
    }
  }, []);

  const handlePushToggle = () => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const OneSignal = window.OneSignal;
      if (OneSignal) {
        OneSignal.Notifications.requestPermission();
      } else {
        // @ts-ignore
        const OneSignalDeferred = window.OneSignalDeferred || [];
        // @ts-ignore
        OneSignalDeferred.push(async (OneSignal) => {
          await OneSignal.Notifications.requestPermission();
        });
      }
    }
  };

  /* ================= AUTH ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const savedUser = {
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      avatar: localStorage.getItem("avatar"),
    };
    if (savedUser.name) setUser(savedUser);

    const savedBalance = localStorage.getItem("walletBalance");
    if (savedBalance) setWalletBalance(Number(savedBalance));

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUser(d.user);
          localStorage.setItem("userName", d.user.name);
          localStorage.setItem("email", d.user.email);
          localStorage.setItem("userId", d.user.id || d.user.userId);
          localStorage.setItem("avatar", d.user.avatar || "");
          localStorage.setItem("userType", d.user.userType || "user");
          if (d.user.phone) localStorage.setItem("phone", d.user.phone);

          if (d.user.wallet !== undefined) {
            setWalletBalance(d.user.wallet);
            localStorage.setItem("walletBalance", String(d.user.wallet));
          }
        } else {
          ["token", "userName", "email", "userId", "phone", "avatar", "walletBalance"].forEach(key => localStorage.removeItem(key));
          setUser(null);
          setWalletBalance(0);
        }
      })
      .finally(() => setLoading(false));

    const handleWalletSync = () => {
      const balance = localStorage.getItem("walletBalance");
      if (balance !== null) setWalletBalance(Number(balance));
    };

    window.addEventListener("walletUpdated", handleWalletSync);
    window.addEventListener("storage", handleWalletSync);
    return () => {
      window.removeEventListener("walletUpdated", handleWalletSync);
      window.removeEventListener("storage", handleWalletSync);
    };
  }, []);

  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = () => {
    ["token", "userName", "email", "userId", "phone", "userType", "pending_topup_order", "walletBalance", "mlbb_verified_players"].forEach(key => localStorage.removeItem(key));
    setUser(null);
    setWalletBalance(0);
    setShowLogoutToast(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  /* ================= SCROLL ================= */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (userMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [userMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full transition-all duration-500 ${scrolled
        ? "backdrop-blur-3xl bg-[var(--background)]/80 shadow-2xl border-b border-[var(--border)] active-header"
        : "bg-transparent"
        }`}
      style={{ zIndex: userMenuOpen ? 2147483647 : 1000 }}
    >
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          <Link href="/" className="relative z-10 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src={HEADER_CONFIG.logo.src}
                alt={HEADER_CONFIG.logo.alt}
                width={HEADER_CONFIG.logo.width}
                height={HEADER_CONFIG.logo.height}
                priority
                className="h-9 w-auto transition-all duration-300"
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {HEADER_CONFIG.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveNav(item.href)}
                className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] italic text-[var(--muted)] hover:text-[var(--accent)] transition-all group flex items-center gap-2"
              >
                <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-all">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
                <motion.span
                  initial={false}
                  animate={{ width: activeNav === item.href ? "100%" : "0%" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-colors duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
            {user && (
              <Link href="/dashboard/wallet">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-auto h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 group bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10"
                >
                  <span className="text-xs font-black text-[var(--accent)]">₹{walletBalance}</span>
                  <span className="text-lg text-[var(--accent)] group-hover:scale-110 transition-transform">+</span>
                </motion.button>
              </Link>
            )}

            <ThemeToggle />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePushToggle}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group ${isSubscribed ? "text-[var(--accent)]" : "text-[var(--foreground)]/60"}`}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[var(--foreground)]/5 group-hover:bg-[var(--foreground)]/10 transition-colors">
                <motion.div animate={{ rotate: [0, -15, 15, -15, 15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <FiBell className="text-lg" />
                </motion.div>
              </div>
              {isSubscribed && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--background)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => user ? setUserMenuOpen((p) => !p) : window.location.href = "/login"}
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[var(--foreground)]/5 group-hover:bg-[var(--foreground)]/10 transition-colors">
                {user?.avatar ? (
                  <Image src={user.avatar} alt="Avatar" width={36} height={36} className="object-cover" />
                ) : (
                  <FiUser className="text-[var(--foreground)]/60 text-lg" />
                )}
              </div>
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setUserMenuOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2147483646] !pointer-events-auto"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                  />

                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-[100dvh] w-[85%] max-w-[380px] bg-[var(--background)] dark:bg-[#050505] light:bg-white border-l border-[var(--border)] z-[2147483647] shadow-[-20px_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    style={{ background: 'var(--background)', opacity: 1 }}
                  >
                    <div className="absolute inset-0 bg-[var(--background)] pointer-events-none" style={{ background: 'var(--background)', opacity: 1 }} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05], rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle,var(--accent)_0%,transparent_60%)] blur-[100px] pointer-events-none"
                    />
                    {/* Dark overlay for extra depth */}
                    <div className="absolute inset-0 bg-[var(--foreground)]/[0.02] pointer-events-none" />

                    {/* Compact Profile Header */}
                    <div className="relative z-10 p-5 flex items-center justify-between border-b border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        {user ? (
                          <>
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                              {user?.avatar ? (
                                <Image src={user.avatar} alt="Avatar" width={40} height={40} className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-lg font-black">{user.name?.charAt(0)}</div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-[var(--foreground)] truncate max-w-[140px] leading-tight">{user.name}</span>
                              <span className="text-[10px] text-[var(--muted)] truncate max-w-[140px] italic">{user.email}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><FiUser size={16} /></div>
                            <span className="text-sm font-bold">Guest Account</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {user && (
                          <button onClick={handleLogout} className="w-9 h-9 rounded-full hover:bg-red-500/10 flex items-center justify-center text-red-500 transition-colors" title="Logout"><FiLogOut size={18} /></button>
                        )}
                        <button onClick={() => setUserMenuOpen(false)} className="w-9 h-9 rounded-full hover:bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] transition-colors"><FiX size={22} /></button>
                      </div>
                    </div>

                    <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

                      {!user ? (
                        <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                          <div className="w-16 h-16 rounded-[2rem] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><FiZap size={32} /></div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-[var(--foreground)]">Sign in required</h3>
                            <p className="text-xs text-[var(--muted)]">Login to access your personalized squad dashboard</p>
                          </div>
                          <Link href="/login" onClick={() => setUserMenuOpen(false)} className="w-full py-3.5 rounded-2xl bg-[var(--accent)] text-white text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all">Authenticate Now</Link>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-2.5 mb-6">
                            {HEADER_CONFIG.nav.map((item) => (
                              <Link key={item.label} href={item.href} onClick={() => setUserMenuOpen(false)} className="flex flex-col items-center justify-center p-2.5 rounded-[1.2rem] bg-[var(--foreground)]/[0.03] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all group">
                                <span className="text-[var(--accent)] group-hover:text-white mb-1">{item.icon}</span>
                                <span className="text-[10px] font-bold">{item.label}</span>
                              </Link>
                            ))}
                          </div>

                          <div className="space-y-1.5">
                            {HEADER_CONFIG.userMenu.common.map((item) => (
                              <Link key={item.label} href={item.href} onClick={() => setUserMenuOpen(false)} className="flex items-center justify-between p-3 rounded-xl bg-[var(--foreground)]/[0.02] border border-transparent hover:border-[var(--accent)]/10 hover:bg-[var(--accent)]/5 transition-all group">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/5 flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] transition-all">{item.icon}</div>
                                  <div className="flex flex-col">
                                    <p className="text-xs font-bold text-[var(--foreground)] leading-tight">{item.label}</p>
                                    <p className="text-[9px] text-[var(--muted)]">{item.desc}</p>
                                  </div>
                                </div>
                                <FiChevronRight className="text-[var(--muted)] opacity-20 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                              </Link>
                            ))}
                          </div>

                          {user?.userType === "owner" && (
                            <div className="relative mt-8 group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-[1.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
                              <Link
                                href="/owner-panal"
                                onClick={() => setUserMenuOpen(false)}
                                className="relative flex items-center justify-between p-4 bg-[var(--background)] border border-[var(--border)] rounded-[1.5rem] overflow-hidden transition-all duration-300"
                              >
                                <motion.div
                                  animate={{ x: ["-100%", "200%"] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--foreground)]/5 to-transparent -skew-x-12"
                                />
                                <div className="flex items-center gap-3 relative z-10 w-full">
                                  <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-lg">
                                      <FiZap size={18} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[var(--background)]"></span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col min-w-0 flex-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--foreground)] mb-1">Admin Console</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-md border border-[var(--accent)]/20 uppercase">Elite Access</span>
                                      <span className="text-[9px] font-bold text-[#22c55e] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#22c55e]"></span>Active</span>
                                    </div>
                                  </div>

                                  <div className="w-8 h-8 rounded-full bg-[var(--foreground)]/5 group-hover:bg-[var(--accent)]/10 flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)] transition-all flex-shrink-0">
                                    <FiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                    </div>


                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogoutToast && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000]">
            <div className="px-6 py-3 rounded-full bg-[var(--card)] border border-green-500/20 flex items-center gap-3 shadow-xl backdrop-blur-xl">
              <FiCheckCircle className="text-green-500" size={18} />
              <span className="text-xs font-bold text-[var(--foreground)]">Logout Successful</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
