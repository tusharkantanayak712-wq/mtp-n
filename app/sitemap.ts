import { MetadataRoute } from "next";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mlbbtopup.in";
  const now = new Date();

  // 1. Fixed Static Routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/region`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/idsonsell`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    // Static Blog Posts
    {
      url: `${baseUrl}/blog/is-mlbb-top-up-legal-in-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-buy-mlbb-diamonds-safely-in-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/mlbb-weekly-pass-price-in-india`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-gift-mlbb-diamonds`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/best-mlbb-diamond-packages-value-guide`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

  ];

  /* ================= OTT & MEMBERSHIP STATIC DATA ================= */
  const OTTS = [
    { slug: "youtube-premium" },
    { slug: "netflix" },
    { slug: "instagram" },
  ];

  const MEMBERSHIPS = [
    { slug: "silver-membership" },
    { slug: "reseller-membership" },
  ];

  const ottRoutes = OTTS.map((item) => ({
    url: `${baseUrl}/games/ott/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const membershipRoutes = MEMBERSHIPS.map((item) => ({
    url: `${baseUrl}/games/membership/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  /* ================= DYNAMIC GAME ROUTES ================= */
  let gameRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch("https://game-off-ten.vercel.app/api/v1/game", {
      headers: {
        "x-api-key": process.env.API_SECRET_KEY || "",
      },
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const games = data?.data?.games || [];

      gameRoutes = games
        .filter((g: any) => g.gameSlug && g.gameAvailablity)
        .map((g: any) => ({
          url: `${baseUrl}/games/${g.gameSlug}`,
          lastModified: now, // Could use g.updatedAt if available
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }));
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...gameRoutes, ...ottRoutes, ...membershipRoutes];
}
