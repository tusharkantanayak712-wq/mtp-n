import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLBB Tournaments & Scrims India: Compete and Win Big | Blue Buff",
  description: "Join daily MLBB tournaments and scrims in India. Compete for Weekly Passes, Diamonds, and cash prizes. Join the most competitive gaming community at Blue Buff India.",
  keywords: [
    "mlbb tournaments india 2026",
    "mlbb scrims india",
    "mobile legends tournament india",
    "win mlbb weekly pass",
    "mlbb gaming community india",
    "blue buff tournaments",
    "daily mlbb matches india"
  ],
  alternates: { canonical: "https://mlbbtopup.in/tournament" },
};

export default function TournamentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
