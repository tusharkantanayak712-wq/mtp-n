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

export default function HeroSection() {


  return (
    <>
      <TopNoticeBanner />

      <GameBannerCarousel />

      <StorySlider />

      <HomeQuickActions />
      <FlashSale />
      <HomeReferralStats />


      {/* <ScrollingNoticeBand/> */}
      <GamesPage />
      <PromoBanner />



      <HomeServices />
      <TrustHighlights />
      <ScrollingNoticeBand />



    </>

  );
}
