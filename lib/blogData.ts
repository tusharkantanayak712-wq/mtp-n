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
