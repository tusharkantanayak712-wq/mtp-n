"use client";

import AuthGuard from "../../components/AuthGuard";
import JoinedTournaments from "@/components/Dashboard/JoinedTournaments";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-[1px] bg-[var(--accent)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">Blue Buff Hub</span>
            </div>
            <h1 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">
              DASHBOARD <span className="text-[var(--accent)]">OVERVIEW</span>
            </h1>
            <p className="text-[10px] text-[var(--muted)] italic mt-2 uppercase tracking-widest">Manage your rewards, orders and tournament status.</p>
          </div>
        </div>

        {/* Joined Tournaments Section */}
        <JoinedTournaments />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-2">
             <h3 className="text-xs font-[900] italic uppercase tracking-tighter">Need <span className="text-[var(--accent)]">Help?</span></h3>
             <p className="text-[10px] text-[var(--muted)]">Our support team is available 24/7 to assist with your tournament registrations.</p>
          </div>
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-2">
             <h3 className="text-xs font-[900] italic uppercase tracking-tighter">Earn <span className="text-[var(--accent)]">BBC</span></h3>
             <p className="text-[10px] text-[var(--muted)]">Complete daily tasks and check-ins to earn more coins for tournament entries.</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
