"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiChevronRight, FiLogOut, FiCheckCircle, FiShield, FiZap, FiMenu, FiX, FiLayers, FiCompass, FiGrid, FiShoppingBag, FiMessageSquare, FiUser, FiBell, FiUsers } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

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
      { label: "My Orders", href: "/dashboard/orders", icon: <FiShoppingBag size={14} /> },
      { label: "My Wallet", href: "/dashboard/wallet", icon: <FiShoppingBag size={14} /> },
      { label: "Refer & Earn", href: "/dashboard/referral", icon: <FiUsers size={14} /> },

      { label: "Customer Support", href: "/dashboard/support", icon: <FiMessageSquare size={14} /> },
      { label: "Membership", href: "/admin-panal", icon: <FiShield size={14} /> },
    ],
    roles: {
      owner: { label: "Admin Panel", href: "/owner-panal", icon: <FiZap size={14} /> },
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
  const logoRef = useRef(null);

  /* ================= PUSH NOTIFICATIONS ================= */
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeToast, setShowSubscribeToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      // @ts-ignore
      window.OneSignalDeferred.push(async (OneSignal) => {
        // Initial check
        setIsSubscribed(OneSignal.Notifications.permission === "granted");

        // Listen for permission changes
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

    // Load initial data from local storage for instant UI update
    const savedUser = {
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      avatar: localStorage.getItem("avatar"),
    };
    if (savedUser.name) setUser(savedUser);

    // Load wallet balance from localStorage
    const savedBalance = localStorage.getItem("walletBalance");
    if (savedBalance) setWalletBalance(Number(savedBalance));

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUser(d.user);
          // Keep local storage in sync
          localStorage.setItem("userName", d.user.name);
          localStorage.setItem("email", d.user.email);
          localStorage.setItem("userId", d.user.id || d.user.userId);
          localStorage.setItem("avatar", d.user.avatar || "");
          if (d.user.phone) localStorage.setItem("phone", d.user.phone);

          // Update wallet balance from API
          if (d.user.wallet !== undefined) {
            setWalletBalance(d.user.wallet);
            localStorage.setItem("walletBalance", String(d.user.wallet));
          }
        } else {
          const keysToRemove = ["token", "userName", "email", "userId", "phone", "avatar", "walletBalance"];
          keysToRemove.forEach(key => localStorage.removeItem(key));
          setUser(null);
          setWalletBalance(0);
        }
      })
      .finally(() => setLoading(false));

    // Listen for custom wallet update event and storage changes
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
    // Clear all auth and local related data
    const keysToRemove = ["token", "userName", "email", "userId", "phone", "pending_topup_order", "walletBalance"];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear form-related persistent data
    localStorage.removeItem("mlbb_verified_players");

    setUser(null);
    setWalletBalance(0);
    setShowLogoutToast(true);

    // Redirect after a short delay to show the message
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  /* ================= SCROLL ================= */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      if (logoRef.current) {
        logoRef.current.style.transform = `rotate(${y * 0.1}deg)`;
      }
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${scrolled
        ? "backdrop-blur-3xl bg-[var(--background)]/80 shadow-2xl border-b border-[var(--border)] active-header"
        : "bg-transparent"
        }`}
    >
      {/* TACTICAL TOP EDGE GLOW */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`} />

      {/* SCANLINE EFFECT ON SCROLL */}
      {scrolled && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px]" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ================= LOGO ================= */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                ref={logoRef}
                src={HEADER_CONFIG.logo.src}
                alt={HEADER_CONFIG.logo.alt}
                width={HEADER_CONFIG.logo.width}
                height={HEADER_CONFIG.logo.height}
                priority
                className="h-9 w-auto transition-all duration-300"
              />
            </motion.div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {HEADER_CONFIG.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveNav(item.href)}
                className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] italic text-[var(--muted)] hover:text-[var(--accent)] transition-all group overflow-hidden flex items-center gap-2"
              >
                <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-all">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
                <motion.span
                  initial={false}
                  animate={{
                    width: activeNav === item.href ? "100%" : "0%",
                  }}
                  className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-colors duration-300" />
              </Link>
            ))}
          </nav>

          {/* ================= ACTIONS ================= */}
          <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
            {/* WALLET BALANCE - Show for logged-in users */}
            {user && (
              <Link href="/dashboard/wallet">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-auto h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 group bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10"
                  title="Add Balance"
                >
                  <span className="text-xs font-black text-[var(--accent)]">
                    ₹{walletBalance}
                  </span>
                  <span className="text-lg text-[var(--accent)] group-hover:scale-110 transition-transform">
                    +
                  </span>
                </motion.button>
              </Link>
            )}

            <ThemeToggle />

            {/* PUSH NOTIFICATION TOGGLE */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePushToggle}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group ${isSubscribed ? "text-[var(--accent)]" : "text-[var(--foreground)]/60"}`}
              title={isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[var(--foreground)]/5 group-hover:bg-[var(--foreground)]/10 transition-colors">
                <motion.div
                  animate={{
                    rotate: [0, -15, 15, -15, 15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                >
                  <FiBell className={`text-lg transition-all duration-500 ${isSubscribed ? "scale-110" : ""}`} />
                </motion.div>
              </div>
              {isSubscribed && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--background)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
              )}
            </motion.button>

            {/* USER BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => user ? setUserMenuOpen((p) => !p) : window.location.href = "/login"}
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[var(--foreground)]/5 group-hover:bg-[var(--foreground)]/10 transition-colors">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FiUser className="text-[var(--foreground)]/60 text-lg" />
                )}
              </div>
            </motion.button>

            {/* USER DROPDOWN */}
            <AnimatePresence>
              {userMenuOpen && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 top-full mt-3 w-80 max-h-[80vh] overflow-y-auto bg-[var(--card)]/95 backdrop-blur-3xl border border-[var(--border)] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                  {!user ? (
                    <>
                      {/* Navigation for non-logged users on mobile */}
                      <div className="md:hidden p-4 border-b border-[var(--border)]">
                        <p className="px-3 py-2 text-[8px] font-black text-[var(--muted)] uppercase tracking-[0.3em] opacity-40 italic">
                          Quick Links
                        </p>
                        {HEADER_CONFIG.nav.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => {
                                setUserMenuOpen(false);
                                setActiveNav(item.href);
                              }}
                              className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all border border-transparent ${activeNav === item.href
                                ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]"
                                : "hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/60"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={activeNav === item.href ? "text-[var(--accent)]" : "opacity-40"}>{item.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
                              </div>
                              <FiChevronRight
                                className={
                                  activeNav === item.href ? "text-[var(--accent)]" : "opacity-40"
                                }
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="group relative block p-8 text-center overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/5 transition-colors duration-500" />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform duration-500">
                              <FiZap size={20} />
                            </div>
                            <div>
                              <h3 className="text-sm font-black uppercase italic tracking-wider text-[var(--foreground)]">Login / Register</h3>
                              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-widest mt-1">Access your account</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* User Info Header with Logout Icon */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-gradient-to-br from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent border-b border-[var(--border)]"
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/20 to-[var(--foreground)]/5 flex-shrink-0 border border-[var(--accent)]/20">
                            {user?.avatar ? (
                              <Image
                                src={user.avatar}
                                alt="Avatar"
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <FiUser className="text-[var(--accent)]/60 text-2xl" />
                            )}
                            {/* Active indicator */}
                            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--card)] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          </div>

                          {/* Name & Email */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="font-black text-base uppercase italic tracking-wide text-[var(--foreground)] truncate leading-tight">{user.name}</p>
                            <p className="text-[10px] font-medium text-[var(--muted)] tracking-wide truncate mt-1.5">
                              {user.email}
                            </p>
                          </div>

                          {/* Logout Icon */}
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 transition-all group flex-shrink-0 shadow-lg shadow-red-500/5"
                            title="Logout"
                          >
                            <FiLogOut size={16} className="group-hover:rotate-12 transition-transform" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Region Check & Services - Side by Side */}
                      <div className="p-4 border-b border-[var(--border)]">
                        <div className="grid grid-cols-2 gap-3">
                          {HEADER_CONFIG.nav.map((item, index) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setActiveNav(item.href);
                                }}
                                className={`relative flex flex-col items-center justify-center gap-2.5 px-4 py-5 rounded-2xl transition-all duration-300 border group overflow-hidden ${activeNav === item.href
                                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)]"
                                  : "border-[var(--border)] hover:bg-[var(--accent)]/5 text-[var(--foreground)]/60 hover:border-[var(--accent)]/30 hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]"
                                  }`}
                              >
                                {/* Background glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <span className={`relative text-xl transition-all duration-300 ${activeNav === item.href ? "text-[var(--accent)] scale-110" : "opacity-50 group-hover:opacity-100 group-hover:scale-110"}`}>
                                  {item.icon}
                                </span>
                                <span className="relative text-[9px] font-black uppercase tracking-wider italic text-center leading-tight">
                                  {item.label}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3 space-y-1">
                        {HEADER_CONFIG.userMenu.common.map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[var(--foreground)]/5 border border-transparent hover:border-[var(--border)] transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors text-sm">{item.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 group-hover:text-[var(--accent)] italic transition-colors">{item.label}</span>
                              </div>
                              <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all text-sm" />
                            </Link>
                          </motion.div>
                        ))}

                        {user?.userType &&
                          HEADER_CONFIG.userMenu.roles[user.userType] && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="pt-1"
                            >
                              <Link
                                href={
                                  HEADER_CONFIG.userMenu.roles[user.userType].href
                                }
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all group shadow-lg shadow-[var(--accent)]/5"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[var(--accent)] group-hover:scale-110 transition-transform text-sm">
                                    {HEADER_CONFIG.userMenu.roles[user.userType].icon}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] italic">
                                    {
                                      HEADER_CONFIG.userMenu.roles[user.userType]
                                        .label
                                    }
                                  </span>
                                </div>
                                <FiChevronRight className="text-[var(--accent)] group-hover:translate-x-1 transition-all text-sm" />
                              </Link>
                            </motion.div>
                          )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* LOGOUT SUCCESS TOAST */}
      <AnimatePresence>
        {showLogoutToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="px-6 py-4 rounded-[2rem] bg-[var(--card)]/90 backdrop-blur-2xl border border-green-500/30 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <FiCheckCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-green-500 italic">Logged Out</span>
                <span className="text-[10px] text-[var(--foreground)]/60 font-medium uppercase tracking-[0.1em]">Successfully logged out</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBSCRIBE SUCCESS TOAST */}
      <AnimatePresence>
        {showSubscribeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="px-6 py-4 rounded-[2rem] bg-[var(--card)]/90 backdrop-blur-2xl border border-sky-500/30 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                <FiBell size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-sky-500 italic">Subscribed</span>
                <span className="text-[10px] text-[var(--foreground)]/60 font-medium uppercase tracking-[0.1em]">Successfully subscribed to notifications</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
