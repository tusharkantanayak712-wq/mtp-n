"use client";

import { FaInstagram, FaTwitter, FaDiscord, FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-14">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* 📨 Left - Contact Info */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">
            Contact Us
          </h1>

          <p className="text-[var(--muted)] leading-relaxed text-base sm:text-lg">
            Have a question, partnership idea, or need support?  
            Reach out to us — we're here to help.
          </p>

          {/* 📍 Location */}
         

          {/* ✉️ Email */}
          <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)] shadow-md">
            <p className="text-sm text-[var(--muted)] mb-1">Email</p>
            <a
              href="mailto:aamonvss@gmail.com"
              className="text-lg font-semibold text-[var(--accent)] hover:underline break-all"
            >
              aamonvss@gmail.com
            </a>
          </div>

          {/* 🌐 Social Links */}
          <div className="flex gap-4 mt-6">
            <a
              href="https://www.instagram.com/mlbbtopup.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              <FaInstagram size={22} />
            </a>

            <a
              href="https://x.com/tk_dev_"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              <FaTwitter size={22} />
            </a>

            {/* <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              <FaDiscord size={22} />
            </a> */}

            <a
              href="mailto:aamonvss@gmail.com"
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>

        {/* 🗺️ Right - Map */}
        <div className="flex-1 h-[380px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-[var(--border)]">
          <iframe
            title="Bhubaneswar Location"
            src="https://www.google.com/maps?q=Bhubaneswar,Odisha&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-14 text-center text-[var(--muted)] text-sm">
        <p>We usually respond within 24 hours.</p>
      </div>
    </main>
  );
}
