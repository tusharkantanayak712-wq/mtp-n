import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
    const baseUrl = "https://mlbbtopup.in";

    // 1. Static Routes (Must match sitemap.ts)
    const staticUrls = [
        `${baseUrl}/`,
        `${baseUrl}/games`,
        `${baseUrl}/region`,
        `${baseUrl}/services`,
        `${baseUrl}/about`,
        `${baseUrl}/contact`,
        `${baseUrl}/privacy-policy`,
        `${baseUrl}/terms-and-conditions`,
        `${baseUrl}/refund-policy`,
        `${baseUrl}/blog`,
        `${baseUrl}/idsonsell`,
        `${baseUrl}/blog/is-mlbb-top-up-legal-in-india`,
        `${baseUrl}/blog/how-to-buy-mlbb-diamonds-safely-in-india`,
        `${baseUrl}/blog/mlbb-weekly-pass-price-in-india`,
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

    const ottUrls = OTTS.map((item) => `${baseUrl}/games/ott/${item.slug}`);
    const membershipUrls = MEMBERSHIPS.map(
        (item) => `${baseUrl}/games/membership/${item.slug}`
    );

    /* ================= DYNAMIC GAME ROUTES ================= */
    let gameUrls: string[] = [];

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

            gameUrls = games
                // .filter((g: any) => g.gameSlug && g.gameAvailablity) // Optional: filter available only
                .filter((g: any) => g.gameSlug)
                .map((g: any) => `${baseUrl}/games/${g.gameSlug}`);
        }
    } catch (error) {
        console.error("Sitemap.txt generation error:", error);
    }

    const allUrls = [
        ...staticUrls,
        ...gameUrls,
        ...ottUrls,
        ...membershipUrls,
    ];

    return new NextResponse(allUrls.join("\n"), {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
