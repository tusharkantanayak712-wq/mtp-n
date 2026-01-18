import { NextResponse } from "next/server";

/* ================= IMAGES ================= */
const MLBB_MAIN_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766076026/7fd445965237d07c1583c1dfb0ee9517_bp14p4.jpg";

const MLBB_SMALL_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536112/WhatsApp_Image_2026-01-16_at_09.29.38_pli9ba.jpg";

  const MLBB_DOUBLE_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536006/WhatsApp_Image_2026-01-16_at_09.05.31_hqquhq.jpg";

    const MLBB_MY_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536112/WhatsApp_Image_2026-01-16_at_09.31.07_tweqho.jpg";

/* ================= OTT SECTION ================= */
const OTTS = [
  {
    name: "YouTube Premium",
    slug: "youtube-premium",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
    category: "OTT",
    available: true,
  },
  {
    name: "Netflix",
    slug: "netflix",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
    category: "OTT",
    available: true,
  },
  {
    name: "Instagram Services",
    slug: "instagram",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
    category: "Social",
    available: true,
  },
];
/* ================= MEMBERSHIP SECTION ================= */
const MEMBERSHIPS = [
  {
    name: "Silver Membership",
    slug: "silver-membership",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
    type: "silver",
    category: "Membership",
    available: true,
  },
  {
    name: "Reseller Membership",
    slug: "reseller-membership",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
    type: "reseller",
    category: "Membership",
    available: true,
  },
];


/* ================= API ================= */
export async function GET() {
  try {
    const response = await fetch("https://game-off-ten.vercel.app/api/v1/game", {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_SECRET_KEY!,
      },
      cache: "no-store",
    });

    const data = await response.json();

    /* ================= NORMALIZE GAME ================= */
    const normalizeGame = (game: any) => {
      let updatedGame = { ...game };

      // Rename MLBB SMALL/PHP → MLBB SMALL
      if (updatedGame.gameName === "MLBB SMALL/PHP") {
        updatedGame.gameName = "MLBB SMALL";
      }

      // Fix wrong publisher spelling
      if (updatedGame.gameFrom === "Moneyton") {
        updatedGame.gameFrom = "Moonton";
      }

      // Replace Mobile Legends main image
      if (updatedGame.gameSlug === "mobile-legends988") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_MAIN_IMAGE,
        };
      }

      // Replace MLBB SMALL image
      if (updatedGame.gameName === "MLBB SMALL") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_SMALL_IMAGE,
        };
      }
        if (updatedGame.gameName === "MLBB Double") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_DOUBLE_IMAGE,
        };
      }
        if (updatedGame.gameName === "SG/MY Mlbb") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_MY_IMAGE,
        };
      }

      return updatedGame;
    };

    /* ================= FILTER GAMES ================= */
    const filteredGames =
      data?.data?.games
        ?.filter((game: any) => game.gameSlug !== "test-1637")
        ?.map(normalizeGame) || [];

    /* ================= FILTER CATEGORY GAMES ================= */
    const filteredCategories =
      data?.data?.category?.map((cat: any) => ({
        ...cat,
        gameId:
          cat.gameId
            ?.filter((game: any) => game.gameSlug !== "test-1637")
            ?.map(normalizeGame) || [],
      })) || [];

    /* ================= EXTRA SECTIONS ================= */

    // Featured games
    const featuredGames = filteredGames.filter((g: any) =>
      ["mobile-legends988", "pubg-mobile138", "genshin-impact742"].includes(
        g.gameSlug
      )
    );

    // MLBB family
    const mlbbVariants = filteredGames.filter(
      (g: any) =>
        g.gameSlug.includes("mlbb") ||
        g.gameName.toLowerCase().includes("mlbb")
    );

    // Available only
    const availableGames = filteredGames.filter(
      (g: any) => g.gameAvailablity === true
    );

    // Group by publisher
    const publishers = filteredGames.reduce((acc: any, game: any) => {
      const key = game.gameFrom || "Unknown";
      acc[key] = acc[key] || [];
      acc[key].push(game);
      return acc;
    }, {});

    // Group by region tag
    const regionalGames = filteredGames.reduce((acc: any, game: any) => {
      const region = game.tagId?.tagName || "Global";
      acc[region] = acc[region] || [];
      acc[region].push(game);
      return acc;
    }, {});

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      ...data,
      data: {
        ...data.data,

        games: filteredGames,
        category: filteredCategories,
        totalGames: filteredGames.length,

        // 🔥 GAME SECTIONS
        featuredGames,
        mlbbVariants,
        availableGames,
        publishers,
        regionalGames,

        // 🔥 OTT SECTION
        otts: {
          title: "OTT & Social Subscriptions",
          items: OTTS.filter((o) => o.available),
          total: OTTS.filter((o) => o.available).length,
        },
        // 🔥 MEMBERSHIP SECTION
memberships: {
  title: "Memberships & Passes",
  items: MEMBERSHIPS.filter((m) => m.available),
  total: MEMBERSHIPS.filter((m) => m.available).length,
},

      },
    });
  } catch (error) {
    console.error("GAME API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch game list",
      },
      { status: 500 }
    );
  }
}
