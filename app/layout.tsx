import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SocialFloat from "@/components/SocialFloat/SocialFloat";
import { GoogleAnalytics } from '@next/third-parties/google';
import ChristmasPopup from "@/components/Seasonal/ChristmasPopup";
import { Poppins } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatBot from "@/components/SocialFloat/Chatbot";
import ValentinePopup from "@/components/Seasonal/ValentinePopup";
import ValentineEffect from "@/components/Seasonal/ValentineEffect";


export const metadata: Metadata = {
  title: {
    default: "MLBB Topup India | Buy MLBB Diamonds Instantly",
    template: "%s | MLBB Topup India",
  },
  description:
    "MLBB Topup India – Buy Mobile Legends diamonds instantly with fast delivery, secure payments, and best prices. Trusted MLBB diamond top-up platform.",
  keywords: [
    "mlbb topup",
    "mlbb topup india",
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
      "Instant MLBB diamond top-up in India. Secure payments, fast delivery, and best prices.",
    url: "https://mlbbtopup.in",
    siteName: "MLBB Topup India",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>

      <body className="bg-black text-white">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Header />

          {/* <div className="snow" />
  <span className="big-snow"></span>
  <span className="big-snow"></span>
  <span className="big-snow"></span>  */}
          {/* <div className="hearts" />

          {/* <ChristmasPopup />  */}
          {/* <ValentineEffect />

          <ValentinePopup /> */}

          <main className="pt-20">{children}</main>
          <Footer />
          <SocialFloat />
          <ChatBot />
          <div />
        </GoogleOAuthProvider>


        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />

        <Script id="onesignal-init" strategy="afterInteractive">
          {`
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
      appId: "b7844eac-b557-40e4-ad01-11546347a279",
              safari_web_id: "web.onesignal.auto.5ccade99-0f35-4775-9ae0-5e2c3bfd110b",
        notifyButton: {
          enable: true,
        },
      });
    });
  `}
        </Script>

      </body>
      <GoogleAnalytics gaId="G-CKCKWLGJ9N" />
      {/* <script src="https://quge5.com/88/tag.min.js" data-zone="191906" async data-cfasync="false"></script> */}
    </html>
  );
}
