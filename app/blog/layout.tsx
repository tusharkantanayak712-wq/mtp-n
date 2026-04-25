import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MLBB Insights & Guides – Tips for Safe & Cheap Top Up | Blue Buff",
  description: "Stay updated with the latest Mobile Legends: Bang Bang news, diamond price guides, and safety tips for recharge in India. Your source for elite MLBB insights.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Adsterra Social Bar */}
      <Script 
        src="https://pl29247592.profitablecpmratenetwork.com/a5/bb/66/a5bb66c93c9892d321190ff4ef0081a4.js" 
        strategy="afterInteractive" 
      />

      {/* Monetag Onclick (Popunder) */}
      <Script id="monetag-popunder" strategy="afterInteractive">
        {`
          (function(s){s.dataset.zone='10923815',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
        `}
      </Script>

      {children}
    </>
  );
}
