import CoinsTab from "@/components/Dashboard/CoinsTab";
import Script from "next/script";

export default function CoinsPage() {
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

      <CoinsTab />
    </>
  );
}
