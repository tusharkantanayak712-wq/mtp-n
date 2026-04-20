"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar, FiCalendar, FiCheckCircle, FiArrowRight, FiCheck,
  FiYoutube, FiSmartphone, FiGlobe, FiMessageCircle,
  FiZap, FiRefreshCw, FiClock, FiList, FiLock, FiTrendingUp,
  FiExternalLink, FiAlertCircle, FiUsers, FiChevronLeft, FiChevronRight, FiPlay
} from "react-icons/fi";
import Link from "next/link";
import { ADS_CONFIG } from "@/lib/adsConfig";


// ──────────────────────────────────────────── TYPES ──────────────────────────
interface Task {
  taskId: string;
  title: string;
  description: string;
  type: "url_visit" | "yt_watch" | "app_install" | "wp_join" | "custom";
  url: string;
  reward: number;
  waitSeconds: number;
  sponsorName: string | null;
  completed: boolean;
  maxReached: boolean;
  expiresAt: string | null;
  hasCode: boolean;
}

interface CoinHistory {
  type: "earn" | "spend";
  coins: number;
  source: string;
  description: string;
  createdAt: string;
}

const COINS_PER_RUPEE = 100;
const DAY_LABELS = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];

// ──────────────────────────────── TASK ICON ──────────────────────────────────
const TaskIcon = ({ type }: { type: Task["type"] }) => {
  switch (type) {
    case "yt_watch": return <FiYoutube className="text-xl" />;
    case "app_install": return <FiSmartphone className="text-xl" />;
    case "wp_join": return <FiMessageCircle className="text-xl" />;
    case "url_visit": return <FiGlobe className="text-xl" />;
    default: return <FiStar className="text-xl" />;
  }
};

const taskGradients: Record<string, string> = {
  yt_watch: "from-red-500/20 to-red-600/5 border-red-500/20",
  app_install: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  wp_join: "from-green-500/20 to-green-600/5 border-green-500/20",
  url_visit: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
  custom: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
};

const taskIconBg: Record<string, string> = {
  yt_watch: "bg-red-500/10 text-red-400",
  app_install: "bg-blue-500/10 text-blue-400",
  wp_join: "bg-green-500/10 text-green-400",
  url_visit: "bg-purple-500/10 text-purple-400",
  custom: "bg-amber-500/10 text-amber-400",
};

// ──────────────────────────────── ADSTERRA CARD ──────────────────────────────
function AdsterraCard({ lastAdReward, adLink, title, onReward, showToast }: { 
  lastAdReward: string | null;
  adLink: string;
  title?: string;
  onReward: (newBal: number, lastTime: string) => void;
  showToast: (m: string, t: "success" | "error") => void;
}) {
  const [opened, setOpened] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [cooldownText, setCooldownText] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cooldown effect
  useEffect(() => {
    if (!lastAdReward) {
      setCooldownText(null);
      return;
    }

    const updateCooldown = () => {
      const last = new Date(lastAdReward).getTime();
      const diff = Date.now() - last;
      const remaining = ADS_CONFIG.COOLDOWN_MS - diff;

      if (remaining > 0) {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setCooldownText(`${mins}m ${secs}s`);
      } else {
        setCooldownText(null);
      }
    };

    updateCooldown();
    const inv = setInterval(updateCooldown, 1000);
    return () => clearInterval(inv);
  }, [lastAdReward]);

  const handleOpen = () => {
    if (cooldownText) return showToast(`Please wait ${cooldownText} for next ad`, "error");
    window.open(adLink, "_blank", "noopener,noreferrer");
    setOpened(true);
    setTimer(15);
  };

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    timerRef.current = setTimeout(() => setTimer((t) => (t !== null ? t - 1 : null)), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer]);

  const handleClaim = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/coins/ad-reward", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        onReward(data.newBalance, data.transaction.createdAt);
        setOpened(false);
        setTimer(null);
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Reward claim failed", "error");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-4 flex flex-col gap-3 overflow-hidden group transition-all ${
        cooldownText ? "border-[var(--border)] bg-[var(--card)]/20 opacity-80" : "border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 shadow-lg shadow-blue-500/5"
      }`}
    >
      <div className="absolute top-0 right-0 p-2">
         <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
           cooldownText ? "text-[var(--muted)]/40 bg-[var(--card)]/40" : "text-blue-400/50 bg-blue-500/10"
         }`}>
           {cooldownText ? "Cooldown Active" : "Bonus Reward"}
         </span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
          cooldownText ? "bg-[var(--card)]/40 grayscale" : "bg-blue-500/10 group-hover:scale-110"
        }`}>
          <FiPlay className={cooldownText ? "text-[var(--muted)]/40 text-xl" : "text-blue-400 text-xl"} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-black uppercase tracking-tight ${cooldownText ? "text-[var(--muted)]/60" : ""}`}>
            {cooldownText ? "Next Ad Soon" : (title || "Watch Ad & Earn")}
          </p>
          <p className="text-[9px] text-[var(--muted)]/60 mt-0.5 leading-relaxed italic line-clamp-1">
            {cooldownText ? "Cooldown in progress..." : "View for 15s to claim free coins! (45m cooldown)"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1 ${
          cooldownText ? "bg-[var(--card)]/20 border-[var(--border)]" : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <FiStar className={cooldownText ? "text-[var(--muted)]/30 text-xs" : "text-blue-400 text-xs"} />
          <span className={`font-black text-[11px] ${cooldownText ? "text-[var(--muted)]/40" : "text-blue-400"}`}>
            +{ADS_CONFIG.REWARD_COINS} BBC
          </span>
        </div>
        {!opened ? (
          <motion.button
            whileHover={{ scale: cooldownText ? 1 : 1.05 }} whileTap={{ scale: cooldownText ? 1 : 0.95 }}
            onClick={handleOpen}
            disabled={!!cooldownText}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all min-w-[90px] justify-center ${
              cooldownText 
                ? "bg-[var(--card)]/40 text-amber-400/80 border border-amber-500/20 cursor-not-allowed" 
                : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            }`}
          >
            {cooldownText ? <><FiClock className="animate-pulse" /> {cooldownText}</> : <><FiPlay /> Watch</>}
          </motion.button>
        ) : timer !== null && timer > 0 ? (
          <div className="flex items-center gap-1.5 text-blue-400">
            <FiClock className="text-xs animate-pulse" />
            <span className="text-[10px] font-black font-mono">{timer}s</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleClaim}
            disabled={claiming}
            className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase disabled:opacity-50"
          >
            {claiming ? <FiRefreshCw className="animate-spin text-xs" /> : "Verify & Claim"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────── TASK CARD ──────────────────────────────────
function TaskCard({ task, onClaim, pendingClaims, isUnlocked, isWatchingAd, adTimer, onStartAd }: {
  task: Task;
  onClaim: (task: Task, code?: string) => Promise<{ pending?: boolean }>;
  pendingClaims: Set<string>;
  isUnlocked: boolean;
  isWatchingAd: boolean;
  adTimer: number | null;
  onStartAd: () => void;
}) {
  const [timer, setTimer] = useState<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gradient = taskGradients[task.type] || taskGradients.custom;
  const iconBg = taskIconBg[task.type] || taskIconBg.custom;
  const isPending = pendingClaims.has(task.taskId);

  const handleOpenMainTask = () => {
    window.open(task.url, "_blank", "noopener,noreferrer");
    setOpened(true);
    setTimer(task.waitSeconds);
  };

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    timerRef.current = setTimeout(() => setTimer((t) => (t !== null ? t - 1 : null)), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer]);

  const handleClaim = async () => {
    if (claiming) return;
    if (task.hasCode && !enteredCode.trim()) {
      setCodeError("Please enter the secret code from the task content");
      return;
    }
    setCodeError("");
    setClaiming(true);
    const result = await onClaim(task, enteredCode.trim() || undefined);
    if (result?.pending) setSubmitted(true);
    setClaiming(false);
  };

  const canClaim = opened && (timer === 0 || timer === null);
  const isDone = task.completed;
  const isLimitReached = task.maxReached;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-gradient-to-br ${gradient} p-4 flex flex-col gap-3 overflow-hidden`}
    >
      {task.sponsorName && (
        <span className="absolute top-2.5 right-2.5 text-[8px] font-black uppercase tracking-widest text-[var(--muted)]/50 bg-[var(--card)]/40 px-1.5 py-0.5 rounded">
          Sponsored
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <TaskIcon type={task.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-tight truncate">{task.title}</p>
          {task.description && (
            <p className="text-[9px] text-[var(--muted)]/60 mt-0.5 leading-relaxed line-clamp-2">{task.description}</p>
          )}
          {task.hasCode && !isDone && !isPending && (
            <span className="inline-flex items-center gap-1 mt-1 text-[8px] font-bold text-purple-400">
              <FiLock size={8} /> Secret code required
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
          <FiStar className="text-amber-400 text-xs" />
          <span className="text-amber-400 font-black text-[11px]">+{task.reward} BBC</span>
        </div>

        {isDone ? (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <FiCheckCircle className="text-sm" />
            <span className="text-[10px] font-black uppercase">Done</span>
          </div>
        ) : isLimitReached ? (
          <div className="flex items-center gap-1.5 text-[var(--muted)]/40">
            <FiLock className="text-sm" />
            <span className="text-[10px] font-black uppercase">Full</span>
          </div>
        ) : isPending || submitted ? (
          <div className="flex items-center gap-1.5 text-amber-400">
            <FiClock className="text-sm animate-pulse" />
            <span className="text-[10px] font-black uppercase">Under Review</span>
          </div>
        ) : !opened ? (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (isUnlocked) handleOpenMainTask();
              else onStartAd();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide ${
              isWatchingAd ? "bg-purple-500/20 text-purple-400" : isUnlocked ? "bg-[var(--accent)] text-white" : "bg-purple-600 text-white"
            }`}
          >
            {isWatchingAd ? (
              <><FiClock className="animate-pulse" /> {adTimer}s</>
            ) : isUnlocked ? (
              <>Go <FiExternalLink className="text-xs" /></>
            ) : (
              <>Unlock <FiLock className="text-xs" /></>
            )}
          </motion.button>
        ) : timer !== null && timer > 0 ? (
          <div className="flex items-center gap-1.5 text-[var(--muted)]">
            <FiClock className="text-xs animate-pulse" />
            <span className="text-[10px] font-black font-mono">{timer}s</span>
          </div>
        ) : !task.hasCode ? (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleClaim}
            disabled={claiming}
            className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide disabled:opacity-50"
          >
            {claiming ? <FiRefreshCw className="animate-spin text-xs" /> : "Submit"}
            {!claiming && <FiArrowRight className="text-xs" />}
          </motion.button>
        ) : null}
      </div>

      {(isPending || submitted) && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/5 border border-amber-500/15 rounded-lg">
          <FiAlertCircle className="text-amber-400 text-xs shrink-0" />
          <p className="text-[8px] text-amber-400 font-bold">Waiting for admin approval. Coins will be added once approved.</p>
        </div>
      )}

      {/* Code input — shown after timer, if code required */}
      {opened && canClaim && task.hasCode && !isPending && !submitted && !isDone && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/5 border border-purple-500/20 rounded-lg">
            <FiLock className="text-purple-400 text-xs shrink-0" />
            <p className="text-[8px] text-purple-400 font-bold">Find the secret code in the task content, then enter it below.</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={enteredCode}
              onChange={(e) => { setEnteredCode(e.target.value.toUpperCase()); setCodeError(""); }}
              placeholder="ENTER CODE HERE"
              className="flex-1 bg-[var(--background)]/60 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-black tracking-widest text-purple-300 placeholder:text-[var(--muted)]/20 outline-none focus:border-purple-500/60 transition-colors"
              autoComplete="off"
            />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleClaim}
              disabled={claiming || !enteredCode.trim()}
              className="flex items-center gap-1 bg-purple-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase disabled:opacity-40"
            >
              {claiming ? <FiRefreshCw className="animate-spin text-xs" /> : <><FiCheck className="text-xs" /> Verify</>}
            </motion.button>
          </div>
          {codeError && (
            <p className="text-[9px] text-rose-400 font-bold flex items-center gap-1">
              <FiAlertCircle className="text-xs" /> {codeError}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════ MAIN COMPONENT ════════════════════════════
type TabKey = "checkin" | "tasks" | "watch" | "convert" | "history";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "checkin",  label: "Check-in", icon: <FiCalendar size={13} /> },
  { key: "tasks",    label: "Tasks",    icon: <FiZap size={13} /> },
  { key: "watch",    label: "Ads",      icon: <FiPlay size={13} /> },
];

export default function CoinsTab() {
  const [activeTab, setActiveTab] = useState<TabKey>("checkin");
  const [coins, setCoins] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [rewards, setRewards] = useState([2, 3, 5, 7, 10, 15, 25]);
  const [nextReward, setNextReward] = useState(2);
  const [lastAdReward, setLastAdReward] = useState<string | null>(null);
  const [history, setHistory] = useState<CoinHistory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingClaims, setPendingClaims] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [convertCoins, setConvertCoins] = useState("");
  const [converting, setConverting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Pagination states
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksPages, setTasksPages] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPages, setHistoryPages] = useState(1);
  const [checkinRewarded, setCheckinRewarded] = useState(false);
  const [adTimer, setAdTimer] = useState<number | null>(null);
  const [activeAdTarget, setActiveAdTarget] = useState<string | null>(null);
  const [unlockedTaskIds, setUnlockedTaskIds] = useState<Set<string>>(new Set());
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartAd = (target: string) => {
    window.open(ADS_CONFIG.ADSTERRA_LINK, "_blank", "noopener,noreferrer");
    setActiveAdTarget(target);
    setAdTimer(15);
  };

  useEffect(() => {
    if (adTimer === null || adTimer <= 0) {
      if (adTimer === 0 && activeAdTarget) {
        if (activeAdTarget === "checkin") setCheckinRewarded(true);
        else setUnlockedTaskIds(prev => new Set([...prev, activeAdTarget]));
        setAdTimer(null);
        setActiveAdTarget(null);
      }
      return;
    }
    adTimerRef.current = setTimeout(() => setAdTimer(t => (t !== null ? t - 1 : null)), 1000);
    return () => { if (adTimerRef.current) clearTimeout(adTimerRef.current); };
  }, [adTimer, activeAdTarget]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [balRes, taskRes] = await Promise.all([
        fetch(`/api/coins/balance?historyPage=${historyPage}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/coins/tasks?page=${tasksPage}`,   { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [bal, taskData] = await Promise.all([balRes.json(), taskRes.json()]);

      if (bal.success) {
        setCoins(bal.coins);
        setCheckedInToday(bal.checkedInToday);
        setStreak(bal.streak || 0);
        setNextReward(bal.nextReward || 5);
        setRewards(bal.rewards || [5, 7, 10, 15, 20, 25, 50]);
        setLastAdReward(bal.lastAdReward);
        setHistory(bal.history || []);
        setHistoryPages(bal.historyPages || 1);
      }
      if (taskData.success) {
        setTasks(taskData.tasks || []);
        setTasksPages(taskData.pages || 1);
      }
    } catch (e) {
      console.error("Failed to fetch coin data:", e);
    } finally {
      setLoading(false);
    }
  }, [token, tasksPage, historyPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckin = async () => {
    if (checkinLoading || checkedInToday) return;
    setCheckinLoading(true);
    try {
      const res = await fetch("/api/coins/checkin", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCoins(data.newBalance);
        setCheckedInToday(true);
        setStreak(data.streak);
        setNextReward(data.nextReward);
        if (data.rewards) setRewards(data.rewards);
        showToast(data.message, "success");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Check-in failed. Try again.", "error");
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleClaimTask = async (task: Task, code?: string): Promise<{ pending?: boolean }> => {
    try {
      const res = await fetch("/api/coins/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ taskId: task.taskId, code }),
      });
      const data = await res.json();
      if (data.success) {
        setPendingClaims((prev) => new Set([...prev, task.taskId]));
        showToast(data.message, "success");
        return { pending: true };
      } else {
        showToast(data.message, "error");
        return {};
      }
    } catch {
      showToast("Failed to submit claim. Try again.", "error");
      return {};
    }
  };

  const handleConvert = async () => {
    const c = parseInt(convertCoins);
    if (!c || c < 100) return showToast("Minimum 100 coins to convert", "error");
    if (c > coins) return showToast("Insufficient coin balance", "error");
    setConverting(true);
    try {
      const res = await fetch("/api/coins/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coins: c }),
      });
      const data = await res.json();
      if (data.success) {
        setCoins(data.newCoinBalance);
        setConvertCoins("");
        showToast(data.message, "success");
        window.dispatchEvent(new Event("walletUpdated"));
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Conversion failed. Try again.", "error");
    } finally {
      setConverting(false);
    }
  };

  const convertPreview = parseInt(convertCoins) >= 100 ? (parseInt(convertCoins) / COINS_PER_RUPEE).toFixed(2) : null;
  const incompleteTasks = tasks.filter((t) => !t.completed && !t.maxReached);
  const completedTasks  = tasks.filter((t) => t.completed || t.maxReached);

  return (
    <div className="max-w-2xl mx-auto relative">

      {/* ── TOAST ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1600] px-5 py-3 rounded-2xl shadow-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 max-w-xs w-full justify-center ${
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <FiStar /> : <FiZap />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <FiRefreshCw className="text-3xl text-[var(--accent)]" />
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">

          {/* ── BALANCE HEADER ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-amber-500/10 via-[var(--card)]/60 to-[var(--card)]/40 p-4 sm:p-5"
          >
            <div className="absolute top-[-30%] right-[-5%] w-[160px] h-[160px] bg-amber-500/10 rounded-full blur-[50px] pointer-events-none" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                  <FiStar className="text-amber-400" size={9} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">BlueBuff Coins</span>
                </div>
                <motion.p
                  key={coins}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl font-black italic tracking-tighter text-amber-400"
                >
                  {coins.toLocaleString()}
                </motion.p>
                <p className="text-[var(--muted)] text-[10px] mt-0.5 font-bold uppercase tracking-wide">
                  = ₹{(coins / COINS_PER_RUPEE).toFixed(2)} wallet value
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 shrink-0">
                <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-xl p-2.5 text-center">
                  <p className="text-blue-400 font-black text-base">🔥 {streak}</p>
                  <p className="text-[7px] font-bold uppercase tracking-wide text-[var(--muted)]">Streak</p>
                </div>
                <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-xl p-2.5 text-center">
                  <p className="text-amber-400 font-black text-base">+{nextReward}</p>
                  <p className="text-[7px] font-bold uppercase tracking-wide text-[var(--muted)]">Tomorrow</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SEPARATE TOP TOOLS ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
             <button
               onClick={() => setActiveTab("convert")}
               className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest ${
                 activeTab === "convert"
                   ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                   : "bg-[var(--card)]/40 border-[var(--border)] text-[var(--muted)] hover:text-white"
               }`}
             >
               <FiTrendingUp size={14} />
               Convert
             </button>
             <button
               onClick={() => setActiveTab("history")}
               className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest ${
                 activeTab === "history"
                   ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
                   : "bg-[var(--card)]/40 border-[var(--border)] text-[var(--muted)] hover:text-white"
               }`}
             >
               <FiList size={14} />
               History
             </button>
          </div>

          {/* ── TOP TAB BAR ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-1.5 bg-[var(--card)]/40 p-1 rounded-2xl border border-[var(--border)]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex flex-col items-center gap-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all ${
                  activeTab === tab.key
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.key === "tasks" && incompleteTasks.length > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[7px] font-black flex items-center justify-center ${activeTab === "tasks" ? "bg-white text-[var(--accent)]" : "bg-[var(--accent)] text-white"}`}>
                    {incompleteTasks.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* ══ CHECK-IN ══ */}
            {activeTab === "checkin" && (
              <motion.div key="checkin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FiCalendar className="text-blue-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wide">Daily Check-in</p>
                      <p className="text-[9px] text-[var(--muted)]/60 font-bold uppercase">
                        {checkedInToday ? `Day ${streak} complete ✓` : `Next: +${nextReward} BBC`}
                      </p>
                    </div>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                      <FiZap className="text-amber-400 text-[10px]" />
                      <span className="text-amber-400 font-black text-[10px]">{streak}/7</span>
                    </div>
                  )}
                </div>

                {/* 7-day grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {rewards.map((reward, i) => {
                    const day = i + 1;
                    const isCompleted = checkedInToday ? day < streak : day < streak;
                    const isToday = day === streak && checkedInToday;
                    const isCurrent = day === (checkedInToday ? streak : streak + 1);
                    return (
                      <div key={day} className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                        isToday        ? "bg-amber-500/20 border-amber-500/40"
                        : isCompleted  ? "bg-emerald-500/10 border-emerald-500/20"
                        : isCurrent && !checkedInToday ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20"
                        : "bg-[var(--card)]/20 border-[var(--border)]/30"
                      }`}>
                        <span className="text-[7px] font-black uppercase text-[var(--muted)]/40">{DAY_LABELS[i]}</span>
                        <span className={`text-[8px] font-black ${
                          isToday || isCompleted ? "text-amber-400" : isCurrent ? "text-blue-400" : "text-[var(--muted)]/30"
                        }`}>
                          {isToday || isCompleted ? "✓" : reward}
                        </span>
                        {day === 7 && <span className="text-[6px] text-amber-400 font-black">🎉</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Reward labels */}
                <div className="flex gap-1 text-[7px] font-black text-center text-[var(--muted)]/30 px-0.5">
                  {rewards.map((r, i) => <div key={i} className="flex-1">{r} BBC</div>)}
                </div>

                <motion.button
                  whileHover={{ scale: checkedInToday ? 1 : 1.02 }}
                  whileTap={{ scale: checkedInToday ? 1 : 0.98 }}
                  onClick={handleCheckin}
                  disabled={checkedInToday || checkinLoading}
                  className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    checkedInToday
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default"
                      : "bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                  }`}
                >
                  {checkinLoading ? (
                    <FiRefreshCw className="animate-spin text-sm" />
                  ) : checkedInToday ? (
                    <><FiCheckCircle /> Checked In — Day {streak}</>
                  ) : (
                    <><FiCalendar /> Check In (+{nextReward} BBC)</>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* ══ TASKS ══ */}
            {activeTab === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiZap className="text-[var(--accent)] text-sm" />
                    <p className="text-[11px] font-black uppercase tracking-wide">Earn Tasks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pendingClaims.size > 0 && (
                      <span className="text-[8px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        {pendingClaims.size} pending
                      </span>
                    )}
                    <button onClick={fetchData} className="text-[var(--muted)]/40 hover:text-[var(--muted)] transition-colors">
                      <FiRefreshCw className="text-xs" />
                    </button>
                  </div>
                </div>

                {pendingClaims.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                    <FiAlertCircle className="text-amber-400 text-xs shrink-0" />
                    <p className="text-[8px] text-amber-400 font-bold">Claims require admin approval before coins are awarded.</p>
                  </div>
                )}


                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-[var(--muted)]/40">
                    <FiList className="text-3xl mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-wide">No tasks available</p>
                    <p className="text-[9px] mt-1">Check back soon!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incompleteTasks.map((task) => (
                      <TaskCard 
                        key={task.taskId} 
                        task={task} 
                        onClaim={handleClaimTask} 
                        pendingClaims={pendingClaims} 
                        isUnlocked={unlockedTaskIds.has(task.taskId)}
                        isWatchingAd={activeAdTarget === task.taskId}
                        adTimer={activeAdTarget === task.taskId ? adTimer : null}
                        onStartAd={() => handleStartAd(task.taskId)}
                      />
                    ))}
                    {completedTasks.length > 0 && (
                      <>
                        <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)]/30 pt-2">Completed</p>
                        {completedTasks.map((task) => (
                          <div key={task.taskId} className="opacity-40">
                            <TaskCard 
                              task={task} 
                              onClaim={async () => ({})} 
                              pendingClaims={pendingClaims} 
                              isUnlocked={true}
                              isWatchingAd={false}
                              adTimer={null}
                              onStartAd={() => {}}
                            />
                          </div>
                        ))}
                      </>
                    )}

                    {tasksPages > 1 && (
                      <div className="flex items-center justify-center gap-3 pt-4 pb-2">
                        <button onClick={() => setTasksPage(p => Math.max(1, p - 1))} disabled={tasksPage === 1}
                          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 disabled:opacity-30">
                          <FiChevronLeft className="text-xs" />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--muted)]">
                          {tasksPage} / {tasksPages}
                        </span>
                        <button onClick={() => setTasksPage(p => Math.min(tasksPages, p + 1))} disabled={tasksPage === tasksPages}
                          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 disabled:opacity-30">
                          <FiChevronRight className="text-xs" />
                        </button>
                      </div>
                    )}

                    {/* ══ PROMO CARD ══ */}
                    <Link href="/partner">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 relative overflow-hidden group"
                      >
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <FiUsers className="text-indigo-400 text-xs" />
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Promote With Us</span>
                          </div>
                          <h4 className="text-[12px] font-black uppercase italic italic-tighter text-white/90">Want to promote your YouTube, App, or Website?</h4>
                          <p className="text-[9px] text-[var(--muted)]/60 mt-1 leading-relaxed">Join 50+ partners and grow your audience instantly. Reach thousands of gamers every day.</p>
                          <div className="flex items-center gap-1.5 mt-3 text-indigo-400 text-[9px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                             Learn More <FiArrowRight />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ CONVERT ══ */}
            {activeTab === "convert" && (
              <motion.div key="convert" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <FiTrendingUp className="text-emerald-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wide">Convert to Wallet</p>
                    <p className="text-[9px] text-[var(--muted)]/60 font-bold uppercase">100 BBC = ₹1.00</p>
                  </div>
                </div>

                {/* Current balance pill */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <span className="text-[9px] font-bold uppercase text-[var(--muted)]">Your balance</span>
                  <span className="text-amber-400 font-black text-sm">{coins.toLocaleString()} BBC</span>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <FiStar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-sm" />
                    <input
                      type="number"
                      value={convertCoins}
                      onChange={(e) => setConvertCoins(e.target.value)}
                      placeholder="Enter coins (min 100)"
                      className="w-full pl-9 pr-4 py-3 bg-[var(--background)]/60 border border-[var(--border)] rounded-xl text-sm font-bold outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>

                  <AnimatePresence>
                    {convertPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
                      >
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase">You'll receive</span>
                        <span className="text-emerald-400 font-black text-sm">₹{convertPreview}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleConvert}
                    disabled={converting || !convertCoins || parseInt(convertCoins) < 100 || parseInt(convertCoins) > coins}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {converting ? <FiRefreshCw className="animate-spin" /> : <><FiArrowRight /> Add to Wallet</>}
                  </motion.button>

                  <div className="flex items-center gap-2 px-3 py-2 bg-[var(--card)]/40 border border-[var(--border)] rounded-xl">
                    <FiLock className="text-[var(--muted)]/40 text-xs" />
                    <p className="text-[8px] font-bold uppercase tracking-wide text-[var(--muted)]/40">Min 100 BBC · Instant transfer</p>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-500/5 border border-blue-500/15 rounded-xl border-dashed">
                    <FiZap className="text-blue-400 text-[10px] animate-pulse shrink-0" />
                    <p className="text-[8px] font-bold uppercase tracking-wide text-blue-400/80 leading-relaxed">
                      🚀 Crypto withdrawal & Listing on Decentralized Exchanges (DEX) coming soon! Hold your coins to maximize value.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ WATCH ADS ══ */}
            {activeTab === "watch" && (
              <motion.div key="watch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FiPlay className="text-blue-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wide">Watch Ads & Earn</p>
                    <p className="text-[9px] text-[var(--muted)]/60 font-bold uppercase">Earn daily rewards instantly</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <AdsterraCard 
                    title="Watch Ad Channel 1"
                    adLink={ADS_CONFIG.WATCH_EARN_LINK}
                    lastAdReward={lastAdReward}
                    onReward={(bal, lastTime) => { setCoins(bal); setLastAdReward(lastTime); }} 
                    showToast={showToast} 
                  />
                  <AdsterraCard 
                    title="Watch Ad Channel 2"
                    adLink={ADS_CONFIG.WATCH_EARN_LINK_2}
                    lastAdReward={lastAdReward}
                    onReward={(bal, lastTime) => { setCoins(bal); setLastAdReward(lastTime); }} 
                    showToast={showToast} 
                  />
                </div>

                <div className="relative rounded-2xl border border-[var(--border)] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-4 overflow-hidden">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                         <FiAlertCircle className="text-blue-400 text-sm" />
                      </div>
                      <div>
                         <h5 className="text-[10px] font-black uppercase tracking-wide text-white/80">Ad Information</h5>
                         <p className="text-[9px] text-[var(--muted)] mt-1 leading-relaxed">
                            Watch the full 15 seconds to be eligible for rewards. You can claim this bonus once every 45 minutes. Make sure your internet connection is stable.
                         </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* ══ HISTORY ══ */}
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiList className="text-[var(--muted)] text-sm" />
                  <p className="text-[11px] font-black uppercase tracking-wide">Coin History</p>
                  <button onClick={fetchData} className="ml-auto text-[var(--muted)]/40 hover:text-[var(--muted)] transition-colors">
                    <FiRefreshCw className="text-xs" />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-[var(--muted)]/40">
                    <FiList className="text-3xl mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-wide">No transactions yet</p>
                    <p className="text-[9px] mt-1">Complete tasks or check in to earn coins!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2.5 border-b border-[var(--border)]/30 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            item.type === "earn" ? "bg-amber-500/10" : "bg-rose-500/10"
                          }`}>
                            <FiStar className={`text-[10px] ${item.type === "earn" ? "text-amber-400" : "text-rose-400"}`} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black truncate max-w-[200px]">{item.description}</p>
                            <p className="text-[8px] text-[var(--muted)]/40 font-mono">
                              {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <span className={`font-black text-[11px] ${item.type === "earn" ? "text-amber-400" : "text-rose-400"}`}>
                          {item.type === "earn" ? "+" : "-"}{item.coins}
                        </span>
                      </div>
                    ))}

                    {historyPages > 1 && (
                      <div className="flex items-center justify-center gap-3 pt-4">
                        <button onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1}
                          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 disabled:opacity-30">
                          <FiChevronLeft className="text-xs" />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-wide text-[var(--muted)]">
                          {historyPage} / {historyPages}
                        </span>
                        <button onClick={() => setHistoryPage(p => Math.min(historyPages, p + 1))} disabled={historyPage === historyPages}
                          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 disabled:opacity-30">
                          <FiChevronRight className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
