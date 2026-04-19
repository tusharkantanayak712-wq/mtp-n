"use client";

import AuthGuard from "../../components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
         </div>
         <h2 className="text-xl font-black uppercase italic tracking-tighter">Welcome to the Hub</h2>
         <p className="text-[var(--muted)]/60 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">
            Select a service above to manage your account and rewards.
         </p>
      </div>
    </AuthGuard>
  );
}
