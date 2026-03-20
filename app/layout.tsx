import type { Metadata } from "next";
import Script from "next/script";

export const dynamic = "force-dynamic";

import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SocialFloat from "@/components/SocialFloat/SocialFloat";
import { GoogleAnalytics } from '@next/third-parties/google';
import ChristmasPopup from "@/components/Seasonal/ChristmasPopup";
import { Poppins } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import ChatBot from "@/components/SocialFloat/Chatbot"; // Removed as we use wrapper
import ChatbotWrapper from "@/components/Layout/ChatbotWrapper";
import ValentinePopup from "@/components/Seasonal/ValentinePopup";
import ValentineEffect from "@/components/Seasonal/ValentineEffect";
import Maintaince from "@/components/Seasonal/Maintaince";
import MaintenanceWrapper from "@/components/Layout/MaintenanceWrapper";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { getAppSettings } from "@/lib/settings";
import BottomNav from "@/components/Layout/BottomNav";



export const metadata: Metadata = {
  title: {
    default: "MLBB Topup India | Buy MLBB Diamonds Instantly",
    template: "%s | MLBB Topup India",
  },
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
  metadataBase: new URL("https://mlbbtopup.in"),
  openGraph: {
    title: "MLBB Topup India | Buy MLBB Diamonds Instantly",
    description:
      "Instant & cheapest MLBB diamond top-up in India. Secure UPI payments, fast delivery, and lowest prices. Buy Mobile Legends diamonds without login!",
    url: "https://mlbbtopup.in",
    siteName: "MLBB Topup India",
    images: [
      {
        url: "/logoBB.png",
        width: 800,
        height: 600,
        alt: "Blue Buff - MLBB Topup India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLBB Topup India | Buy MLBB Diamonds Instantly",
    description: "Cheap & Instant MLBB diamonds in India. UPI payments supported. Fast delivery!",
    images: ["/logoBB.png"],
    creator: "@bluebuff_india",
  },
  alternates: {
    canonical: "https://mlbbtopup.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAppSettings();

  return (
    <html lang="en" className={poppins.variable}>


      <body className="bg-black text-white">
        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Blue Buff",
              "url": "https://mlbbtopup.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mlbbtopup.in/games?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          id="organization-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Blue Buff",
              "url": "https://mlbbtopup.in",
              "logo": "https://mlbbtopup.in/logoBB.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9178521537",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": "en"
              },
              "sameAs": [
                "https://instagram.com/mlbbtopup.in",
                "https://x.com/tk_dev_"
              ]
            })
          }}
        />
        <GoogleAnalytics gaId="G-CKCKWLGJ9N" />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Header />

          {/* <div className="snow" />
  <span className="big-snow"></span>
  <span className="big-snow"></span>
  <span className="big-snow"></span>  */}
          {/* <div className="hearts" />

          {/* <ChristmasPopup />  */}
          {/* <ValentineEffect />

           */}
          {/* <ValentineEffect /> */}
          {/* <ValentinePopup /> */}
          <MaintenanceWrapper maintenanceMode={settings.maintenanceMode} />
          <main className="pt-16 pb-24 md:pb-0">{children}</main>




          <Footer />
          <SocialFloat />
          <ChatbotWrapper />
          <BottomNav />


          <div />
        </GoogleOAuthProvider>


        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />

        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "b7844eac-b557-40e4-ad01-11546347a279",
                safari_web_id: "web.onesignal.auto.5ccade99-0f35-4775-9ae0-5e2c3bfd110b",
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                  enable: false, // Turned off the persistent bell icon
                },
              });

              // Automatically show the slidedown prompt if not subscribed
              if (!OneSignal.Notifications.permission) {
                 OneSignal.Slidedown.promptPush();
              }
            });
          `}
        </Script>

      </body>
      <GoogleAnalytics gaId="G-CKCKWLGJ9N" />
      {/* <script src="https://quge5.com/88/tag.min.js" data-zone="191906" async data-cfasync="false"></script> */}
    </html>
  );
}
