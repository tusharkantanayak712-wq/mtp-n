export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
}

export const BLOGS_DATA: BlogPost[] = [
  {
    id: "6",
    title: "99% Players Don’t Know These MLBB Tricks (Rank Up Instantly)",
    slug: "mlbb-tricks-to-rank-up",
    type: "Pro Tips",
    excerpt:
      "Master the hidden mechanics of Mobile Legends that pro players use to dominate Every match. Learn advanced minimap tricks, jungle pathing, and item countering.",
    publishedAt: "2026-03-29",
    readingTime: "6 min read",
    featured: true,
  },
  {
    id: "1",
    title: "MLBB Weekly Pass Price in India (2026)",
    slug: "mlbb-weekly-pass-price-in-india",
    type: "Guide",
    excerpt:
      "Learn the latest MLBB weekly pass price in India and whether it's worth buying.",
    publishedAt: "2026-01-10",
    readingTime: "4 min read",
    featured: true,
  },
  {
    id: "2",
    title: "How to Buy MLBB Diamonds Safely in India",
    slug: "how-to-buy-mlbb-diamonds-safely-in-india",
    type: "Safety",
    excerpt:
      "Step-by-step guide to buying MLBB diamonds safely in India.",
    publishedAt: "2025-01-12",
    readingTime: "5 min read",
    featured: true,
  },
  {
    id: "3",
    title: "Is MLBB Top-Up Legal in India?",
    slug: "is-mlbb-top-up-legal-in-india",
    type: "Info",
    excerpt:
      "Understand whether MLBB top-ups are legal in India.",
    publishedAt: "2025-01-05",
    readingTime: "3 min read",
  },
  {
    id: "4",
    title: "How to Gift MLBB Diamonds to Friends (2025)",
    slug: "how-to-gift-mlbb-diamonds",
    type: "Guide",
    excerpt:
      "A complete guide on how to safely gift Mobile Legends diamonds to your friends using their Player ID.",
    publishedAt: "2025-02-07",
    readingTime: "3 min read",
    featured: true,
  },
  {
    id: "5",
    title: "Best MLBB Diamond Packages – Which Gives the Most Value? (2025)",
    slug: "best-mlbb-diamond-packages-value-guide",
    type: "Value Guide",
    excerpt:
      "Not all MLBB diamond packages are equal. Find out which bundle gives you the most diamonds per rupee and how to save more with bonus events.",
    publishedAt: "2025-02-26",
    readingTime: "5 min read",
    featured: true,
  },
];
