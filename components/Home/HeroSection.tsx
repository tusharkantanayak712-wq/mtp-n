"use client";

import GamesPage from "@/app/games/page";
import GameBannerCarousel from "./GameBannerCarousel";
import HomeServices from "./HomeServices";
import TrustHighlights from "./TrustHighlights";
import TopNoticeBanner from "./TopNoticeBanner";
import FlashSale from "./FlashSale";
import ScrollingNoticeBand from "./ScrollingNoticeBand";
import StorySlider from "./StorySlider";
import HomeQuickActions from "./HomeQuickActions";
import HomeReferralStats from "./HomeReferralStats";
import PromoBanner from "./PromoBanner";
import SEOContent from "./SEOContent";

export default function HeroSection() {


  return (
    <>
      <TopNoticeBanner />
      <GameBannerCarousel />

      <div className="space-y-2 mt-4">
        <StorySlider />
        <FlashSale />
      </div>

      <PromoBanner />

      <div className="space-y-2">
        <HomeQuickActions />
        <HomeReferralStats />
      </div>

      <GamesPage />

      <div className="mt-1 space-y-12 pb-10">
        <HomeServices />
        <TrustHighlights />
      </div>

      <SEOContent />

      {/* <ScrollingNoticeBand /> */}



    </>

  );
}
