"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleLogin = async (credential: string) => {
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
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("userName", data.user.name);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("userId", data.user.userId);

      setSuccess("Signed in successfully. Redirecting...");
      setTimeout(() => (window.location.href = "/"), 800);
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--card)] border border-black/10 dark:border-white/10 shadow-lg p-6 sm:p-8">

        {/* BRAND */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white font-bold shadow">
            G
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sign in to continue
          </p>
        </div>

        {/* FEEDBACK */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* GOOGLE BUTTON */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) =>
              res.credential && handleGoogleLogin(res.credential)
            }
            onError={() => setError("Google authentication was cancelled")}
            theme="outline"
            size="large"
            shape="pill"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--muted)] border-t-[var(--foreground)]" />
            Authenticating…
          </div>
        )}

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          By continuing, you agree to our{" "}
          <span className="text-[var(--foreground)]">Terms</span> &{" "}
          <span className="text-[var(--foreground)]">Privacy Policy</span>
        </p>
      </div>
    </section>
  );
}
