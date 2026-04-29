"use client";

import AuthGuard from "@/components/AuthGuard";
import JoinedTournaments from "@/components/Dashboard/JoinedTournaments";
import Link from "next/link";
import { FiChevronLeft, FiAward } from "react-icons/fi";

export default function MyTournamentsPage() {
  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] transition-colors w-fit">
            <FiChevronLeft size={14} /> Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-[1px] bg-[var(--accent)]" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent)] italic">Blue Buff Scrims</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-[900] italic tracking-tighter uppercase leading-none">
                MY <span className="text-[var(--accent)]">TOURNAMENTS</span>
              </h1>
            </div>
            <Link 
              href="/tournament" 
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent)]/20 hover:brightness-110 transition-all flex items-center gap-2 w-fit"
              style={{ color: "#ffffff", backgroundColor: "var(--accent)" }}
            >
              <FiAward size={12} /> 
              <span>Join New Tournament</span>
            </Link>
          </div>
        </div>

        {/* The List Component */}
        <div className="pt-4">
           <JoinedTournaments />
        </div>
      </div>
    </AuthGuard>
  );
}
