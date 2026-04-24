export interface BlogPost {
  game: string;
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  image: string;
  featured?: boolean;
  tags?: string[];
}

export const BLOGS_DATA: BlogPost[] = [
  {
    id: "22",
    title: "Best MLBB Heroes for Rank Push in 2026: The Ultimate Meta Guide",
    slug: "best-mlbb-heroes-for-rank-push-2026",
    type: "Meta Guide",
    excerpt: "Master the 2026 meta with our comprehensive guide to the best heroes for rank push in Mobile Legends. Discover top picks for all roles.",
    publishedAt: "2026-04-24",
    readingTime: "15 min read",
    image: "/blog/best-heroes-2026.png",
    featured: true,
    game: "mlbb",
    tags: ["meta", "rank-push", "tier-list", "2026"]
  },
  {
    id: "21",
    title: "Step-by-Step Guide: How to Buy MLBB Diamonds Safely",
    slug: "step-by-step-guide-to-buy-diamonds-safely",
    type: "Tutorial",
    excerpt: "Want to buy MLBB diamonds but don't know how? Our 2026 guide provides a step-by-step process for a safe top-up with zero risk.",
    publishedAt: "2026-03-31",
    readingTime: "11 min read",
    image: "/blog/mlbb-buy-safely-guide.png",
    featured: true,
    game: "mlbb",
    tags: ["tutorial", "safety", "diamonds"]
  },
  {
    id: "20",
    title: "The 2026 Diamond Spending Blueprint: How to Spend Like a Pro & Save Money",
    slug: "how-to-spend-diamonds-wisely-in-mlbb",
    type: "Strategy Guide",
    excerpt: "Most players waste half of their diamonds. Learn the blueprint to spend wisely, avoid traps, and use the 'Daily Discount' trick.",
    publishedAt: "2026-03-31",
    readingTime: "13 min read",
    image: "/blog/mlbb-wise-spending.png",
    featured: true,
    game: "mlbb",
    tags: ["diamonds", "savings", "blueprint"]
  },
  {
    id: "19",
    title: "Weekly Diamond Pass vs. Direct Recharge in MLBB: Which is Better?",
    slug: "weekly-diamond-pass-vs-direct-recharge",
    type: "Value Comparison",
    excerpt: "Should you buy the Weekly Diamond Pass or direct diamonds? Our 2026 guide breaks down the value, ROI, and best way to spend.",
    publishedAt: "2026-03-31",
    readingTime: "12 min read",
    image: "/blog/mlbb-wdp-vs-diamonds.png",
    featured: true,
    game: "mlbb",
    tags: ["diamonds", "value", "comparison"]
  },
  {
    id: "18",
    title: "Is MLBB Worth Spending Money On? The 2026 Honest Review",
    slug: "is-mlbb-worth-spending-money-on",
    type: "Opinion",
    excerpt: "Should you buy diamonds in Mobile Legends? Our 2026 guide explores if MLBB is worth spending money on, covering Starlight and skin perks.",
    publishedAt: "2026-03-31",
    readingTime: "11 min read",
    image: "/blog/mlbb-worth-it.png",
    featured: true,
    game: "mlbb",
    tags: ["opinion", "worth-it", "diamonds"]
  },
  {
    id: "17",
    title: "How to Avoid Scams While Buying MLBB Diamonds: The 2026 Safety Guide",
    slug: "how-to-avoid-scams-while-buying-diamonds",
    type: "Safety Guide",
    excerpt: "Don't get scammed! Learn how to safely buy Mobile Legends diamonds. Our 2026 guide covers common top-up scams, identifying fake sites, and safety tips.",
    publishedAt: "2026-03-31",
    readingTime: "13 min read",
    image: "/blog/mlbb-avoid-scams.png",
    featured: true,
    game: "mlbb",
    tags: ["safety", "scams", "top-up"]
  },
  {
    id: "16",
    title: "How to Reduce Lag in Mobile Legends: The Ultimate 2026 FPS & Ping Fix",
    slug: "how-to-reduce-lag-in-mobile-legends",
    type: "Tech Guide",
    excerpt: "Experience zero lag in MLBB. Learn how to reduce lag, fix ping spikes, and optimize your phone's FPS for a smooth, pro-tier experience.",
    publishedAt: "2026-03-31",
    readingTime: "14 min read",
    image: "/blog/mlbb-reduce-lag.png",
    featured: true,
    game: "mlbb",
    tags: ["tech", "lag", "fps"]
  },
  {
    id: "15",
    title: "The Best Ways to Spend Diamonds in MLBB: Maximize Your Value",
    slug: "best-ways-to-spend-diamonds-in-mlbb",
    type: "Value Guide",
    excerpt: "Want to get the most out of your MLBB diamonds? Learn how to maximize your value with Starlight, Weekly Passes, and event-exclusive draws.",
    publishedAt: "2026-03-31",
    readingTime: "15 min read",
    image: "/blog/mlbb-spend-diamonds.png",
    featured: true,
    game: "mlbb",
    tags: ["diamonds", "value", "guide"]
  },
  {
    id: "14",
    title: "How to Fix Ping Issues in MLBB: The 2026 Lag Fix Guide",
    slug: "how-to-fix-ping-issues-in-mlbb",
    type: "Tech Guide",
    excerpt: "Tired of lag and high ping? Learn the best ways to fix ping issues, reduce latency, and optimize your network settings.",
    publishedAt: "2026-03-31",
    readingTime: "14 min read",
    image: "/blog/mlbb-fix-ping.png",
    featured: true,
    game: "mlbb",
    tags: ["tech", "ping", "lag"]
  },
  {
    id: "13",
    title: "How to Carry in Solo Queue MLBB: The Ultimate Carry Guide",
    slug: "how-to-carry-in-solo-queue",
    type: "Pro Strategy",
    excerpt: "Tired of losing with random teammates? Master the art of carrying in Solo Queue with our ganking and team management secrets.",
    publishedAt: "2026-03-31",
    readingTime: "16 min read",
    image: "/blog/mlbb-solo-carry.png",
    featured: true,
    game: "mlbb",
    tags: ["solo", "carry", "strategy"]
  },
  {
    id: "12",
    title: "How to Rank Up From Epic to Mythic in MLBB: The 2026 Survival Guide",
    slug: "how-to-rank-up-from-epic-to-mythic-in-2026",
    type: "Ranking Guide",
    excerpt: "Stuck in 'Epic Hell'? Break the cycle with our pro guide on drafting, objective control, and the mindset secrets to reaching Mythic.",
    publishedAt: "2026-03-31",
    readingTime: "18 min read",
    image: "/blog/mlbb-epic-to-mythic.png",
    featured: true,
    game: "mlbb",
    tags: ["ranking", "mythic", "epic"]
  },
  {
    id: "11",
    title: "How to Win More Matches Consistently in MLBB (Ultimate Ranking Strategy)",
    slug: "how-to-win-more-matches-consistently",
    type: "Pro Tips",
    excerpt: "Win-streaks are not about luck. Consistently winning in Mobile Legends requires discipline, drafting, and a winner mindset.",
    publishedAt: "2026-03-31",
    readingTime: "12 min read",
    image: "/blog/mlbb-win-consistently.png",
    featured: true,
    game: "mlbb",
    tags: ["tips", "win", "rank"]
  },
  {
    id: "10",
    title: "The Complete Mobile Legends Gameplay Guide: Lanes, Jungle & Objectives",
    slug: "complete-mlbb-gameplay-guide",
    type: "Game Guide",
    excerpt: "Master the core mechanics of Mobile Legends. Learn the secrets of laning, jungle rotations, and capturing key map objectives like Turtle and Lord.",
    publishedAt: "2026-03-31",
    readingTime: "15 min read",
    image: "/blog/mlbb-gameplay-guide.png",
    featured: true,
    game: "mlbb",
    tags: ["guide", "gameplay", "strategy"]
  },
  {
    id: "9",
    title: "How to Farm Gold Fast in MLBB (Mobile Legends Farming Guide)",
    slug: "how-to-farm-gold-fast-in-mlbb",
    type: "Strategy",
    excerpt: "Want to get your core items before anyone else? Learn the best strategies for farming gold fast in Mobile Legends.",
    publishedAt: "2026-03-31",
    readingTime: "7 min read",
    image: "/blog/mlbb-gold-farm.png",
    featured: true,
    game: "mlbb",
    tags: ["strategy", "farming", "gold"]
  },
  {
    id: "8",
    title: "MLBB Roles Explained: Tank, Fighter, Mage, Assassin, Marksman, Support",
    slug: "mlbb-roles-guide",
    type: "Game Guide",
    excerpt: "Learn the 6 main roles in Mobile Legends: Bang Bang. Understand how each role works to win more games.",
    publishedAt: "2026-03-30",
    readingTime: "5 min read",
    image: "/blog/mlbb-roles.png",
    featured: true,
    game: "mlbb",
    tags: ["guide", "roles"]
  },
  {
    id: "6",
    title: "99% Players Don’t Know These MLBB Tricks (Rank Up Instantly)",
    slug: "mlbb-tricks-to-rank-up",
    type: "Pro Tips",
    excerpt: "Master the hidden mechanics of Mobile Legends that pro players use to dominate Every match.",
    publishedAt: "2026-03-29",
    readingTime: "6 min read",
    image: "/blog/mlbb-tricks.png",
    featured: true,
    game: "mlbb"
  },
  {
    id: "1",
    title: "MLBB Weekly Pass Price in India (2026)",
    slug: "mlbb-weekly-pass-price-in-india",
    type: "Guide",
    excerpt: "Learn the latest MLBB weekly pass price in India and whether it's worth buying.",
    publishedAt: "2026-01-10",
    readingTime: "4 min read",
    image: "/blog/weekly-pass-price.png",
    featured: true,
    game: "mlbb"
  },
  {
    id: "2",
    title: "How to Buy MLBB Diamonds Safely in India",
    slug: "how-to-buy-mlbb-diamonds-safely-in-india",
    type: "Safety",
    excerpt: "Step-by-step guide to buying MLBB diamonds safely in India.",
    publishedAt: "2025-01-12",
    readingTime: "5 min read",
    image: "/blog/buy-safely.png",
    featured: true,
    game: "mlbb"
  },
  {
    id: "3",
    title: "Is MLBB Top-Up Legal in India?",
    slug: "is-mlbb-top-up-legal-in-india",
    type: "Info",
    excerpt: "Understand whether MLBB top-ups are legal in India.",
    publishedAt: "2025-01-05",
    readingTime: "3 min read",
    image: "/blog/legal-india.png",
    game: "mlbb"
  },
  {
    id: "4",
    title: "How to Gift MLBB Diamonds to Friends (2025)",
    slug: "how-to-gift-mlbb-diamonds",
    type: "Guide",
    excerpt: "A complete guide on how to safely gift Mobile Legends diamonds to your friends using their Player ID.",
    publishedAt: "2025-02-07",
    readingTime: "3 min read",
    image: "/blog/gift-guide.png",
    featured: true,
    game: "mlbb"
  },
  {
    id: "5",
    title: "Best MLBB Diamond Packages – Value Guide (2025)",
    slug: "best-mlbb-diamond-packages-value-guide",
    type: "Value Guide",
    excerpt: "Find out which bundle gives you the most diamonds per rupee and how to save more.",
    publishedAt: "2025-02-26",
    readingTime: "5 min read",
    image: "/blog/best-value.png",
    featured: true,
    game: "mlbb"
  },
  {
    id: "7",
    title: "Stop Losing in Mobile Legends – Fix These 7 Mistakes Now",
    slug: "stop-losing-mlbb-7-mistakes",
    type: "Guide",
    excerpt: "Are you stuck in Epic or Legend rank? Learn how to fix your gameplay and start winning.",
    publishedAt: "2026-03-29",
    readingTime: "7 min read",
    image: "/blog/fix-mistakes.png",
    game: "mlbb"
  },
];
