"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FiChevronRight, FiLogOut } from "react-icons/fi";
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
    { label: "Region Check", href: "/region" },
    { label: "Services", href: "/services" },
  ],

  userMenu: {
    common: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Customer Support", href: "/dashboard" },
      // { label: "Account Settings", href: "/dashboard" },
      // { label: "My Wallet", href: "/dashboard" },
      { label: "My Orders", href: "/dashboard" },
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

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUser(d.user);
        else sessionStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
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
        ? "backdrop-blur-2xl bg-[var(--background)]/90 shadow-xl border-b border-[var(--border)]"
        : "bg-transparent"
        }`}
    >
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
                className="relative px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
              >
                {item.label}
                <motion.span
                  initial={false}
                  animate={{
                    scaleX: activeNav === item.href ? 1 : 0,
                  }}
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-500 transform origin-left"
                />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
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
              className="relative flex items-center gap-2 h-10 px-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 group shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-[var(--accent)]/30 transition-all">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    width={28}
                    height={28}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaUser className="text-white text-xs" />
                )}
              </div>
              {user && (
                <span className="hidden sm:block text-sm font-medium pr-1 max-w-[100px] truncate">
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
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-80 max-h-[80vh] overflow-y-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl"
                >
                  {!user ? (
                    <>
                      {/* Navigation for non-logged users on mobile */}
                      <div className="md:hidden p-3 border-b border-[var(--border)]">
                        <p className="px-3 py-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                          Navigation
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
                              className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all ${activeNav === item.href
                                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                : "hover:bg-[var(--accent)]/5 text-[var(--muted)]"
                                }`}
                            >
                              <span className="text-sm font-medium">{item.label}</span>
                              <FiChevronRight
                                className={
                                  activeNav === item.href ? "text-[var(--accent)]" : ""
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
                          className="block p-6 text-center font-semibold hover:bg-[var(--accent)]/5 transition-colors rounded-2xl"
                        >
                          Login / Register
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* User Info Header with Logout */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-gradient-to-br from-[var(--accent)]/10 to-purple-600/10 border-b border-[var(--border)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-[var(--accent)]/20">
                            {user?.avatar ? (
                              <Image
                                src={user.avatar}
                                alt="Avatar"
                                width={56}
                                height={56}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <FaUser className="text-white text-xl" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base truncate">{user.name}</p>
                            <p className="text-xs text-[var(--muted)] truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold transition-all"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </motion.button>
                      </motion.div>

                      {/* Navigation Items (Mobile Only) */}
                      <div className="md:hidden p-3 border-b border-[var(--border)]">
                        <p className="px-3 py-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                          Navigation
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
                              className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all ${activeNav === item.href
                                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                : "hover:bg-[var(--accent)]/5"
                                }`}
                            >
                              <span className="text-sm font-medium">{item.label}</span>
                              <FiChevronRight
                                className={
                                  activeNav === item.href
                                    ? "text-[var(--accent)]"
                                    : "text-[var(--muted)]"
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
                              className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[var(--accent)]/5 transition-all group"
                            >
                              <span className="text-sm font-medium">{item.label}</span>
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
                                className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[var(--accent)]/5 transition-all group"
                              >
                                <span className="text-sm font-semibold">
                                  {
                                    HEADER_CONFIG.userMenu.roles[user.userType]
                                      .label
                                  }
                                </span>
                                <FiChevronRight className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
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
    </motion.header>
  );
}
