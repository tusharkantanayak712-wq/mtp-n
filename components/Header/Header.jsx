"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiChevronRight, FiLogOut, FiCheckCircle, FiShield, FiZap, FiMenu, FiX, FiLayers } from "react-icons/fi";
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
    // { label: "Orders", href: "/dashboard/orders" },
    // { label: "Support", href: "/dashboard/support" },
    { label: "Region Check", href: "/region" },
    { label: "Services", href: "/services" },
  ],

  userMenu: {
    common: [
      { label: "My Orders", href: "/dashboard/orders" },
      { label: "Customer Support", href: "/dashboard/support" },
      // { label: "My Wallet", href: "/dashboard/wallet" },
      // { label: "Account Matrix", href: "/dashboard/account" },
      { label: "Membership", href: "/admin-panal" },
    ],
    roles: {
      owner: { label: "Admin Panel", href: "/owner-panal" },
    },
  },
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("/");

  const dropdownRef = useRef(null);
  const logoRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Load initial data from session storage for instant UI update
    const savedUser = {
      name: sessionStorage.getItem("userName"),
      email: sessionStorage.getItem("email"),
      userId: sessionStorage.getItem("userId"),
      avatar: sessionStorage.getItem("avatar"),
    };
    if (savedUser.name) setUser(savedUser);

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUser(d.user);
          // Keep session storage in sync
          sessionStorage.setItem("userName", d.user.name);
          sessionStorage.setItem("email", d.user.email);
          sessionStorage.setItem("userId", d.user.id || d.user.userId);
          sessionStorage.setItem("avatar", d.user.avatar || "");
          if (d.user.phone) sessionStorage.setItem("phone", d.user.phone);
        } else {
          const keysToRemove = ["token", "userName", "email", "userId", "phone", "avatar"];
          keysToRemove.forEach(key => sessionStorage.removeItem(key));
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = () => {
    // Clear all auth and session related data
    const keysToRemove = ["token", "userName", "email", "userId", "phone", "pending_topup_order"];
    keysToRemove.forEach(key => sessionStorage.removeItem(key));

    // Clear form-related persistent data
    localStorage.removeItem("mlbb_verified_players");

    setUser(null);
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
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "backdrop-blur-3xl bg-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.8)] border-b border-white/5 active-header"
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
                className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] italic text-[var(--muted)] hover:text-[var(--accent)] transition-all group overflow-hidden"
              >
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
            <ThemeToggle />

            {/* USER BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserMenuOpen((p) => !p)}
              className="relative flex items-center gap-2 h-10 px-4 rounded-full bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/40 hover:bg-white/[0.06] transition-all duration-500 group shadow-2xl"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center overflow-hidden ring-1 ring-white/10 group-hover:rotate-12 transition-all duration-500">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FiShield className="text-white text-[10px]" />
                )}
              </div>
              {user && (
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/80 pr-1 max-w-[100px] truncate italic">
                  {user.name}
                </span>
              )}
            </motion.button>

            {/* USER DROPDOWN */}
            <AnimatePresence>
              {userMenuOpen && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 top-full mt-3 w-80 max-h-[80vh] overflow-y-auto bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />
                  {!user ? (
                    <>
                      {/* Navigation for non-logged users on mobile */}
                      <div className="md:hidden p-4 border-b border-white/5">
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
                                : "hover:bg-white/[0.03] text-white/60"
                                }`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
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
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform duration-500">
                              <FiZap size={20} />
                            </div>
                            <div>
                              <h3 className="text-sm font-black uppercase italic tracking-wider text-white">Login / Register</h3>
                              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-widest mt-1">Access your account</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* User Info Header with Logout */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-[var(--accent)]/10 to-transparent border-b border-white/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
                            {user?.avatar ? (
                              <Image
                                src={user.avatar}
                                alt="Avatar"
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <FiShield className="text-white text-xl" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm uppercase italic tracking-wider text-white truncate">{user.name}</p>
                            <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-widest truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase italic tracking-[0.2em] border border-red-500/20 transition-all shadow-lg shadow-red-500/5 group"
                        >
                          <FiLogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                          Logout
                        </motion.button>
                      </motion.div>

                      {/* Navigation Items (Mobile Only) */}
                      <div className="md:hidden p-4 border-b border-white/5">
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
                                : "hover:bg-white/[0.03] text-white/60"
                                }`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
                              <FiChevronRight
                                className={
                                  activeNav === item.href
                                    ? "text-[var(--accent)]"
                                    : "opacity-40"
                                }
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* Menu Items */}
                      <div className="p-3">
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
                              className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group"
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-[var(--accent)] italic">{item.label}</span>
                              <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                            </Link>
                          </motion.div>
                        ))}

                        {user?.userType &&
                          HEADER_CONFIG.userMenu.roles[user.userType] && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Link
                                href={
                                  HEADER_CONFIG.userMenu.roles[user.userType].href
                                }
                                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 hover:bg-[var(--accent)]/10 transition-all group"
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] italic">
                                  {
                                    HEADER_CONFIG.userMenu.roles[user.userType]
                                      .label
                                  }
                                </span>
                                <FiChevronRight className="text-[var(--accent)] group-hover:translate-x-1 transition-all" />
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
            <div className="px-6 py-4 rounded-[2rem] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-green-500/30 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <FiCheckCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-green-500 italic">Logged Out</span>
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-[0.1em]">Successfully logged out</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
