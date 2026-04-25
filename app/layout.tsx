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
    default: "MLBB Top Up India – Buy Cheapest Diamonds Instantly | mlbbtopup.in",
    template: "%s | MLBB Top Up India – Buy Cheapest Diamonds Instantly",
  },
  description:
    "Safe & instant MLBB diamond top up in India. Cheapest rates for Weekly Pass, Starlight & skins. Secure UPI/Paytm payments with 5-minute delivery. Trusted by thousands.",
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
    "mlbb recharge under 50 rs",
    "mlbb recharge under 80 rs india",
    "mlbb recharge under 100 rs india",
    "cheap mlbb diamonds 2024 india",
    "lowest price mlbb diamonds india",
    "mlbb diamond price list india",
    "mlbb recharge best price india",
    "mlbb diamond rate india today",
    "mlbb topup discount india",
    "mlbb recharge offer india today",
    "buy 86 diamonds mlbb india",
    "buy 172 diamonds mlbb india",
    "mlbb weekly pass recharge india",
    "mlbb twilight pass recharge india",
    "mlbb small diamond pack india",
    "mlbb mini pack recharge instant",
    "mlbb weekly pass cheapest india",
    "mlbb diamond bundle recharge india",
    "mlbb subscription recharge india",
    "mlbb starlight recharge india",
    "mlbb recharge by uid india",
    "mlbb topup uid only india",
    "instant mlbb recharge without login",
    "mlbb auto topup website india",
    "mlbb instant diamonds delivery",
    "fastest mlbb recharge india",
    "mlbb recharge in seconds india",
    "mlbb topup instant payment india",
    "mlbb recharge direct account india",
    "legit mlbb recharge india",
    "trusted mlbb diamond seller india",
    "safe mlbb topup site india",
    "real mlbb recharge website india",
    "genuine mlbb diamond store india",
    "secure mlbb recharge with upi",
    "verified mlbb topup website",
    "best site to buy mlbb diamonds india",
    "how to buy mlbb diamonds with upi",
    "mlbb recharge guide india",
    "mlbb diamond recharge steps",
    "mobile legends payment methods india",
    "how instant mlbb topup works",
    "mlbb weekly pass worth it india",
    "mlbb cheapest recharge method india",
    "mlbb topup without moonton login",
    "mlbb recharge india online",
    "mlbb recharge delhi",
    "mlbb recharge mumbai",
    "mlbb recharge kolkata",
    "mlbb recharge chennai",
    "mlbb recharge bangalore",
    "mlbb recharge hyderabad",
    "mlbb recharge odisha",
    "mlbb recharge tamil nadu",
    "mlbb recharge west bengal",
    "buy mlbb diamonds near me",
    "mlbb recharge local payment india",
    "mlbb recharge with phonepe",
    "mlbb recharge with google pay",
    "mlbb recharge with paytm",
    "mlbb recharge with upi id",
    "mlbb recharge without card india",
    "mlbb recharge using wallet india",
    "mlbb recharge upi instant india",
    "mlbb recharge qr payment india",
    "mlbb recharge pay later india",
    "mlbb recharge 24x7 india",
    "mlbb recharge anytime india",
    "mlbb midnight recharge mlbb",
    "mlbb emergency recharge diamonds",
    "mlbb quick topup now",
    "mlbb recharge instantly online",
    "mlbb recharge in 1 minute",
    "mlbb fastest topup service india",
    "mlbb recharge holi offer",
    "mlbb recharge diwali discount",
    "mlbb recharge new year sale",
    "mlbb recharge special event offer",
    "mlbb recharge bonus diamonds india",
    "mlbb promo diamond recharge india",
    "mlbb topup limited time deal",
    "codashop vs mlbbtopup india",
    "cheapest mlbb recharge site comparison",
    "best mlbb topup website india 2026",
    "mlbb recharge price comparison india",
    "where to buy cheapest mlbb diamonds",
    "codashop alternative india mlbb",
    "mlbb recharge without otp india",
    "mlbb recharge uid server fast",
    "mlbb recharge instant confirmation",
    "mlbb recharge safe payment gateway",
    "mlbb recharge under 5 minutes india",
    "mlbb recharge trusted seller online",
    "mlbb recharge official partner india",
    "mlbb recharge auto delivery system",
    "mlbb top up india",
    "mobile legends recharge india",
    "mlbb diamond top up",
    "buy mlbb diamonds india",
    "mlbb recharge website",
    "mlbb top up cheap",
    "mobile legends diamonds india",
    "instant mlbb recharge",
    "cheapest mlbb top up",
    "mlbb top up online",
    "mlbb diamonds cheap",
    "mlbb top up instant delivery",
    "mlbb recharge fast india",
    "mlbb diamond purchase india",
    "secure mlbb top up site",
    "trusted mlbb recharge website",
    "mlbb top up with upi",
    "mlbb recharge without login",
    "mlbb direct top up india",
    "cheapest mlbb top up website in india",
    "best mlbb recharge site india",
    "instant mlbb diamond top up india",
    "buy mobile legends diamonds instantly",
    "safe mlbb recharge website india",
    "how to top up mlbb diamonds india",
    "mlbb top up using upi india",
    "mlbb recharge fast delivery india",
    "best site for mlbb top up cheap",
    "mlbb diamonds lowest price india",
    "mlbb skins purchase india",
    "mlbb diamonds for skins",
    "mlbb recharge for new skins",
    "mlbb event recharge india",
    "mlbb promo diamonds india",
    "mlbb weekly diamond pass india",
    "mlbb elite pass recharge",
    "mlbb battle points recharge",
    "bluebuff top up",
    "bluebuff recharge",
    "bluebuff mlbb diamonds",
    "bluebuff cheap mlbb top up",
    "bluebuff instant recharge",
    "bluebuff trusted site",
    "bluebuff india",
    "bluebuff mlbb recharge india",
    "bluebuff cheapest diamonds",
    "bluebuff fast delivery",
    "how to buy mlbb diamonds in india",
    "is mlbb top up safe",
    "how to get cheap mlbb diamonds",
    "how to top up mlbb instantly",
    "where to buy mlbb diamonds india",
    "mlbb recharge process india",
    "how fast is mlbb top up",
    "mlbb recharge trusted or not",
    "how to get mlbb diamonds cheap",
    "best mlbb recharge website 2026",
    "mlbb top up comparison india",
    "mlbb recharge price comparison",
    "mlbb top up better than codashop",
    "mlbb recharge deals india",
    "mlbb discount diamonds india",
    "mlbb best price recharge",
    "mlbb cheap diamonds today",
    "mlbb offer today india",
    "mlbb top up discount",
    "mlbb recharge sale india",
    "mlbb diamonds offer 2026",
    "mlbb instant offer diamonds",
    "mlbb bonus diamonds india",
    "mlbb promo code india",
    "mlbb recharge limited offer",
    "mlbb top up deal india",
    "instant mlbb top up under 5 minutes",
    "cheapest mlbb diamonds under 100 rs",
    "mlbb recharge without account login",
    "mlbb diamonds fast delivery india",
    "best mlbb recharge for beginners",
    "mlbb top up trusted india site",
    "buy mlbb diamonds safely india",
    "mlbb recharge no delay india",
    "mlbb diamonds instant india cheap",
    "mlbb top up legit website india",
  ],
  metadataBase: new URL("https://mlbbtopup.in"),
  openGraph: {
    title: "MLBB Top Up India – Buy Cheapest Diamonds Instantly | mlbbtopup.in",
    description:
      "Safe & instant MLBB diamond top up in India. Cheapest rates for Weekly Pass, Starlight & skins. Secure UPI/Paytm payments with 5-minute delivery. Trusted by thousands.",
    url: "https://mlbbtopup.in",
    siteName: "mlbbtopup.in",
    images: [
      {
        url: "/logoBB.png",
        width: 800,
        height: 600,
        alt: "mlbbtopup.in - MLBB Topup India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MLBB Top Up India – Buy Cheapest Diamonds Instantly | mlbbtopup.in",
    description: "Safe & instant MLBB diamond top up in India. Cheapest rates for Weekly Pass, Starlight & skins. Secure UPI/Paytm payments with 5-minute delivery. Trusted by thousands.",
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
          <main className="pt-14 pb-24 md:pb-0">{children}</main>




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
    </html>
  );
}
