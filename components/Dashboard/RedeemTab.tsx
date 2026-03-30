import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGift, FiLoader, FiCheckCircle, FiXCircle, FiArrowRight, FiShield } from "react-icons/fi";

interface RedeemTabProps {
    setWalletBalance: (balance: number) => void;
}

export default function RedeemTab({ setWalletBalance }: RedeemTabProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/user/redeem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code: code.trim() })
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ type: 'success', message: data.message });
                setCode("");
                setWalletBalance(data.newBalance);
                window.dispatchEvent(new Event("walletUpdated"));
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (err) {
            setStatus({ type: 'error', message: "Redemption failed. Try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start px-4">
                {/* LEFT: FORM SIDE */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/5 border border-blue-500/10 mb-2">
                            <FiGift className="text-blue-500" size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Rewards</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-[var(--foreground)]">Redeem <span className="text-blue-500">Code</span></h1>
                        <p className="text-[10px] font-bold text-[var(--muted)] mt-2 uppercase tracking-wide opacity-50">Add money to your wallet instantly.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full"
                    >
                        <form onSubmit={handleRedeem} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-black text-blue-500/40 ml-1">Voucher Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value.toUpperCase());
                                        if (status.type) setStatus({ type: null, message: "" });
                                    }}
                                    placeholder="TK-XXXX-XXXX"
                                    className="w-full bg-[var(--card)]/30 border border-white/5 rounded-xl px-4 py-4 text-lg font-black tracking-widest text-[var(--foreground)] placeholder:text-[var(--muted)]/20 focus:border-blue-500/30 outline-none transition-all"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !code.trim()}
                                className="w-full h-14 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest italic text-[11px] shadow-lg shadow-blue-500/10 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-20"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <span>Redeem Now</span>
                                        <FiArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        <AnimatePresence mode="wait">
                            {status.type && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 shadow-sm ${status.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400'
                                        : 'bg-rose-500/10 border-rose-500/10 text-rose-400'
                                        }`}
                                >
                                    {status.type === 'success' ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{status.message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* RIGHT: STEPS SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="p-6 rounded-3xl bg-[var(--card)]/40 border border-white/5 space-y-6 relative overflow-hidden">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-30">How it works</h3>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0">1</div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-tight text-[var(--foreground)]">Enter Code</p>
                                    <p className="text-[9px] text-[var(--muted)] mt-1 tracking-wide leading-relaxed opacity-40 font-bold uppercase">Enter your voucher code exactly as shown.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0">2</div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-tight text-[var(--foreground)]">Get Balance</p>
                                    <p className="text-[9px] text-[var(--muted)] mt-1 tracking-wide leading-relaxed opacity-40 font-bold uppercase">Click redeem to add balance to your account.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-400 shrink-0">3</div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-tight text-[var(--foreground)]">Use Instantly</p>
                                    <p className="text-[9px] text-[var(--muted)] mt-1 tracking-wide leading-relaxed opacity-40 font-bold uppercase">Balance is added instantly to your wallet.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                        <FiShield className="text-blue-500/60" size={12} />
                        <p className="text-[8px] font-black text-blue-400/60 uppercase tracking-[0.2em]">Secure & Encrypted Processing</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
