import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join MLBB Scrims & Tournaments: Win Weekly Passes | Blue Buff India",
  description: "Register for the latest Mobile Legends: Bang Bang tournaments. 1v1, 5v5, and seasonal scrims with premium prizes. Fast registration and instant match details at Blue Buff.",
  keywords: [
    "mlbb 1v1 tournaments india",
    "mlbb 5v5 scrims india",
    "mobile legends bang bang tournaments",
    "how to join mlbb scrims india",
    "mlbb weekly pass prizes",
    "blue buff mlbb tournament registration"
  ],
  alternates: { canonical: "https://mlbbtopup.in/tournament/mlbb" },
};

export default function MLBBTournamentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
