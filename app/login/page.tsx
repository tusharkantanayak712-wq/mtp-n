"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userName, setUserName] = useState("");

  const handleGoogleLogin = async (credential: string) => {
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Authentication failed");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("userId", data.user.userId);

      setUserName(data.user.name);
      setSuccess("done");

      setTimeout(() => {
        window.location.replace("/");
      }, 1200);
    } catch {
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-background">
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-background to-[var(--accent)]/5" />
      
      {/* FLOATING ORBS */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">
        {/* GLOW EFFECT */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] rounded-3xl blur-2xl opacity-20 transition duration-1000" />

        <div className="relative rounded-3xl bg-[var(--card)]/95 backdrop-blur-2xl border border-[var(--border)] shadow-2xl px-8 py-12 sm:px-12 sm:py-14">
          
          {/* LOGO & HEADER */}
          <div className="text-center mb-10">
            {/* Logo Container with Gradient Border */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-2xl blur-lg opacity-50" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg">
                <Image 
                  src="/logoBB.png" 
                  alt="Logo" 
                  width={50} 
                  height={50}
                  className="relative z-10"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-2">
              {success ? `Welcome Back!` : "Welcome Back"}
            </h1>

            <p className="text-[var(--foreground)]/60 text-base">
              {success ? `Hey ${userName}, setting things up...` : "Sign in to continue your journey"}
            </p>
          </div>

          {/* SUCCESS STATE */}
          {success && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-5 py-4 text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Signed in successfully</p>
                <p className="text-sm opacity-80">Redirecting you now...</p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 px-5 py-4 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Authentication failed</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          )}

          {/* GOOGLE LOGIN BUTTON */}
          {!success && (
            <div className="space-y-4">
              {/* Custom styled container for Google button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className={`relative flex justify-center p-1 bg-[var(--card)] rounded-2xl transition-all duration-300 ${
                  loading ? "opacity-40 pointer-events-none scale-[0.98]" : "hover:scale-[1.02]"
                }`}>
                  <GoogleLogin
                    onSuccess={(res) =>
                      res.credential && handleGoogleLogin(res.credential)
                    }
                    onError={() =>
                      setError("Google authentication was cancelled")
                    }
                    theme="outline"
                    size="large"
                    shape="pill"
                  />
                </div>
              </div>

              {/* DIVIDER */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--card)] text-[var(--foreground)]/60">
                    Secure authentication
                  </span>
                </div>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/60 font-medium">Secure</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/60 font-medium">Fast</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/60 font-medium">Reliable</p>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && !success && (
            <div className="mt-6 flex items-center justify-center gap-3 text-[var(--foreground)]/60 animate-in fade-in duration-300">
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
                <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
              </div>
              <span className="text-sm font-medium">Authenticating securely...</span>
            </div>
          )}

          {/* FOOTER */}
          {!success && (
            <div className="mt-10 pt-6 border-t border-[var(--border)]">
              <p className="text-xs text-center text-[var(--foreground)]/50 leading-relaxed">
                By continuing, you agree to our{" "}
                <a href="#" className="font-semibold text-[var(--primary)] hover:underline underline-offset-4 transition">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-[var(--primary)] hover:underline underline-offset-4 transition">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>

        {/* TRUST BADGE */}
        {!success && (
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--foreground)]/50">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Protected by Google OAuth 2.0</span>
          </div>
        )}
      </div>
    </section>
  );
}