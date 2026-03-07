"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGift, FiPlus, FiCopy, FiCheck, FiClock, FiUser, FiTrash2 } from "react-icons/fi";

export default function RedeemCodesTab() {
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [recentCodes, setRecentCodes] = useState([]);
    const [copiedCode, setCopiedCode] = useState(null);
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({ totalUsed: 0, total: 0 });

    const fetchCodes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/redeem-codes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRecentCodes(data.codes);
                setSummary(data.summary);
            }
        } catch (err) {
            console.error("Failed to fetch codes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/admin/redeem-codes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Number(amount), quantity: Number(quantity) })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message + "\n\nGenerated Codes:\n" + data.codes.join("\n"));
                setAmount("");
                setQuantity("");
                fetchCodes();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Failed to generate codes");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExpire = async (codeId) => {
        if (!confirm("Are you sure you want to expire/delete this code?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/redeem-codes?id=${codeId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchCodes();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Failed to expire code");
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-center text-center sm:text-left">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--muted)] tracking-widest mb-0.5 sm:mb-1">Total</p>
                    <p className="text-lg sm:text-2xl font-black italic">{summary.total}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-500/5 border border-green-500/10 flex flex-col justify-center text-center sm:text-left">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-green-500/60 tracking-widest mb-0.5 sm:mb-1">Claimed</p>
                    <p className="text-lg sm:text-2xl font-black italic text-green-500">{summary.totalUsed}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col justify-center text-center sm:text-left">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-blue-500/60 tracking-widest mb-0.5 sm:mb-1">Left</p>
                    <p className="text-lg sm:text-2xl font-black italic text-blue-400">{summary.total - summary.totalUsed}</p>
                </div>
            </div>

            {/* GENERATOR CARD */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-blue-500/5 border border-blue-500/10 transition-all">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <FiGift size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-xl font-black italic uppercase tracking-tight">Redeem Code Generator</h3>
                        <p className="text-[var(--muted)] text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60">Create single-use credit codes</p>
                    </div>
                </div>

                <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" onSubmit={handleGenerate}>
                    <div className="space-y-1">
                        <label className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--muted)] ml-1 tracking-widest">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full h-10 sm:h-12 bg-black/20 border border-[var(--border)] rounded-xl px-4 text-sm focus:border-blue-500/40 outline-none transition-all font-bold"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--muted)] ml-1 tracking-widest">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g. 10"
                            className="w-full h-10 sm:h-12 bg-black/20 border border-[var(--border)] rounded-xl px-4 text-sm focus:border-blue-500/40 outline-none transition-all font-bold"
                            required
                        />
                    </div>
                    <div className="flex items-end pt-1 sm:pt-0">
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full h-10 sm:h-12 bg-blue-500 text-white font-black italic uppercase text-[10px] sm:text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isGenerating ? "Processing..." : <><FiPlus /> Generate Codes</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* RECENT CODES TABLE */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2 text-white/40">
                    <FiClock /> Recently Generated Codes
                </h3>

                <div className="rounded-2xl border border-[var(--border)] bg-black/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-white/5 text-[var(--muted)] font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Value</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Redeemed By</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white/80">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">Loading codes...</td></tr>
                                ) : recentCodes.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">No codes generated yet</td></tr>
                                ) : recentCodes.map((code) => (
                                    <tr key={code._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-blue-400 select-all">
                                            {code.code}
                                        </td>
                                        <td className="px-6 py-4 font-black italic">
                                            ₹{code.value}
                                        </td>
                                        <td className="px-6 py-4 uppercase">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${code.status === "active"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                                }`}>
                                                {code.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {code.status === "used" && code.usedBy ? (
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-white flex items-center gap-1"><FiUser className="text-blue-400" size={10} /> {code.usedBy.name}</p>
                                                    <p className="text-[9px] opacity-40 uppercase tracking-tighter">ID: {code.usedBy.userId}</p>
                                                    <p className="text-[9px] opacity-40">{new Date(code.usedAt).toLocaleString()}</p>
                                                </div>
                                            ) : (
                                                <span className="opacity-20">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => copyToClipboard(code.code)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                                title="Copy Code"
                                            >
                                                {copiedCode === code.code ? <FiCheck /> : <FiCopy />}
                                            </button>
                                            {code.status === "active" && (
                                                <button
                                                    onClick={() => handleExpire(code._id)}
                                                    className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all"
                                                    title="Expire/Delete Code"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
