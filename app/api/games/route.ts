import { NextResponse } from "next/server";

/* ================= IMAGES ================= */
const MLBB_MAIN_IMAGE = "/game-assets/mlbbindia.jpg";

const MLBB_SMALL_IMAGE = "/game-assets/mlbb-ph-small.jpg";

const MLBB_DOUBLE_IMAGE = "/game-assets/double-dias.jpg";

const MLBB_MY_IMAGE = "/game-assets/all-region.jpg";

const MLBB_RUSSIA_IMAGE = "/game-assets/mlbb-russia.jpg";
const MLBB_INDO_IMAGE = "/game-assets/mlbb-indo.jpg";

const MAGIC_IMAGE = "/game-assets/magicchess.jpg";

const HOK_IMAGE = "/game-assets/hok.jpg";


const GENSIN_IMAGE = "/game-assets/genshin.jpg";
const COC_IMAGE = "/game-assets/coc_logo.png";
const STARLIGHT_IMAGE = "/game-assets/starkight.webp";
const WEEKLY_MONTHLY_IMAGE = "/game-assets/weekly-monthly-bundle.jpg";


/* ================= OTT SECTION ================= */
const OTTS = [
  {
    name: "YouTube Premium",
    slug: "youtube-premium",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
    category: "OTT",
    available: true,
    isManual: true,
  },
  {
    name: "Netflix",
    slug: "netflix",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
    category: "OTT",
    available: true,
    isManual: true,
  },
  {
    name: "Spotify Premium",
    slug: "spotify",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771319767/sporytyf_d59bfc.png",
    category: "OTT",
    available: true,
    isManual: true,
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
    isManual: true,
  },
  {
    name: "Reseller Membership",
    slug: "reseller-membership",
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
    type: "reseller",
    category: "Membership",
    available: true,
    isManual: true,
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
      if (updatedGame.gameName === "MLBB RUSSIA") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_RUSSIA_IMAGE,
        };
      }
      if (updatedGame.gameName === "MLBB INDO") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_INDO_IMAGE,
        };
      }

      if (updatedGame.gameSlug === "magic-chess-gogo-india924") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MAGIC_IMAGE,
        };
      }
      if (updatedGame.gameSlug === "genshin-impact742") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: GENSIN_IMAGE,
        };
      }
      if (updatedGame.gameSlug === "honor-of-kings57") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: HOK_IMAGE,
        };
      }
      if (updatedGame.gameSlug === "weeklymonthly-bundle931") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: WEEKLY_MONTHLY_IMAGE,
        };
      }


      return updatedGame;
    };

    /* ================= FILTER GAMES ================= */
    const excludedGameSlugs = [
      "test-1637",
      "mobile-legends-backup826",
      "ph-value-pass588",
      "value-pass-ml948"
    ];

    const filteredGames =
      data?.data?.games
        ?.filter(
          (game: any) => !excludedGameSlugs.includes(game.gameSlug)
        )
        ?.map(normalizeGame) || [];

    // // Add COC Manual
    // filteredGames.push({
    //   gameName: "Clash of Clans",
    //   gameSlug: "coc-manual",
    //   gameFrom: "Supercell",
    //   gameAvailablity: true,
    //   gameImageId: {
    //     image: COC_IMAGE,
    //   },
    //   tagId: {
    //     tagName: "Manual",
    //     tagBackground: "#f59e0b",
    //     tagColor: "#ffffff",
    //   },
    // });

    // Add Starlight Card
    filteredGames.push({
      gameName: "Starlight Card",
      gameSlug: "starlight-card-manual",
      gameFrom: "Moonton",
      gameAvailablity: true,
      gameImageId: {
        image: STARLIGHT_IMAGE,
      },
      tagId: {
        tagName: "Manual",
        tagBackground: "#f59e0b",
        tagColor: "#ffffff",
      },
    });

    // Add BGMI Manual
    filteredGames.push({
      gameName: "BGMI",
      gameSlug: "bgmi-manual",
      gameFrom: "Krafton",
      gameAvailablity: true,
      gameImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
      tagId: {
        tagName: "Manual",
        tagBackground: "#f59e0b",
        tagColor: "#ffffff",
      },
    });

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
        g.gameName.toLowerCase().includes("mlbb") ||
        g.gameSlug.toLowerCase().includes("legends988")


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
        // category: filteredCategories,
        totalGames: filteredGames.length,

        // 🔥 GAME SECTIONS
        featuredGames,
        mlbbVariants,
        // availableGames,
        // publishers,
        // regionalGames,

        // 🔥 OTT SECTION
        otts: {
          title: "OTT Subscriptions",
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
