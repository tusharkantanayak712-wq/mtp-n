import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game ID Trade - Buy, Sell & Rent Game IDs",
  description: "Secure marketplace for game ID trading. Buy, sell or rent premium game IDs with trusted support.",
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
