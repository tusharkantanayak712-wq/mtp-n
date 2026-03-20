// app/page.tsx
import HomeSection from "@/components/Home/Home";
import WhatsAppQRPopup from "@/components/WhatsAppQRPopup";

export const metadata = {
  title: "MLBB Topup India | Buy MLBB Diamonds Instantly at Best Price",
  description:
    "MLBB Topup India - Get the cheapest Mobile Legends diamonds instantly. Trusted website for fast MLBB recharge with UPI, lowest prices, and 24/7 instant delivery. Buy ML diamonds in India without login at Blue Buff!",
  keywords: [
    "mlbb recharge india cheap",
    "mlbb top up india instant",
    "buy ml diamonds india low price",
    "mlbb recharge with upi",
    "cheapest mlbb recharge website",
    "mlbb recharge trusted site india",
    "mlbb diamonds instant delivery india",
    "mobile legends recharge india fast",
    "mlbb top up india no login",
    "mlbb recharge website india cheap",
    "mlbb topup",
    "mlbb diamond topup",
    "mlbb diamond recharge",
    "buy mlbb diamonds",
    "mobile legends topup",
    "mlbb diamonds india",
  ],
};

export default function Page() {
  return (
    <main>
      <WhatsAppQRPopup />

      <HomeSection />
    </main>
  );
}
