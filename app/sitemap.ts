import { MetadataRoute } from "next";
import { BLOGS_DATA } from "@/lib/blogData";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mlbbtopup.in";
  const now = new Date();

  // 1. Core Platform Routes
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/games`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/region`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/leaderboard`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/blog/mlbb`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 },
  ];

  // 2. Dynamic Blog Routes from BLOGS_DATA
  const blogRoutes = BLOGS_DATA.map((blog) => ({
    url: `${baseUrl}/blog/${blog.game}/${blog.slug}`,
    lastModified: new Date(blog.publishedAt),
    changeFrequency: "weekly" as const,
    priority: blog.featured ? 0.7 : 0.6,
  }));

  // 3. Other Utility Routes
  const utilityRoutes = [
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  /* ================= OTT & MEMBERSHIP DATA ================= */
  const OTTS = [{ slug: "youtube-premium" }, { slug: "netflix" }, { slug: "spotify" }];
  const MEMBERSHIPS = [{ slug: "silver-membership" }, { slug: "reseller-membership" }];

  const ottRoutes = OTTS.map((item) => ({
    url: `${baseUrl}/games/ott/${item.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const membershipRoutes = MEMBERSHIPS.map((item) => ({
    url: `${baseUrl}/games/membership/${item.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  /* ================= DYNAMIC GAME ROUTES ================= */
  let gameRoutes: MetadataRoute.Sitemap = [];
  const manualGames = [
    { slug: "coc-manual", priority: 0.9 },
    { slug: "starlight-card-manual", priority: 0.9 },
    { slug: "bgmi-manual", priority: 0.9 },
  ];

  const manualRoutes = manualGames.map((g) => ({
    url: `${baseUrl}/games/${g.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: g.priority,
  }));

  try {
    const response = await fetch("https://game-off-ten.vercel.app/api/v1/game", {
      headers: { "x-api-key": process.env.API_SECRET_KEY || "" },
    });

    if (response.ok) {
      const data = await response.json();
      const games = data?.data?.games || [];
      gameRoutes = games
        .filter((g: any) => g.gameSlug && g.gameAvailablity)
        .map((g: any) => ({
          url: `${baseUrl}/games/${g.gameSlug}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.9,
        }));
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...gameRoutes,
    ...manualRoutes,
    ...ottRoutes,
    ...membershipRoutes,
    ...utilityRoutes
  ];
}
