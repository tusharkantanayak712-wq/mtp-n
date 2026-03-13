import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";
import { applyPricingToItems } from "@/lib/pricingUtils";

/* ================= MEMBERSHIP CONFIG ================= */
const MEMBERSHIPS = {
  "silver-membership": {
    gameName: "Silver Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image: "/membership/silver-m.png",
    },
    gameDescription: "Unlock premium pricing and basic benefits.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "silver-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image: "/membership/silver-m.png",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "silver-3m",
        sellingPrice: 249,
        dummyPrice: 749,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image: "/membership/silver-m.png",
        },
      },
      {
        itemName: "6 Months",
        itemSlug: "silver-6m",
        sellingPrice: 499,
        dummyPrice: 1499,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image: "/membership/silver-m.png",
        },
      },
      {
        itemName: "12 Months",
        itemSlug: "silver-12m",
        sellingPrice: 899,
        dummyPrice: 2699,
        itemAvailablity: true,
        index: 4,
        itemImageId: {
          image: "/membership/silver-m.png",
        },
      },
    ],
  },
  "reseller-membership": {
    gameName: "Reseller Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image: "/membership/reseller-m.png",
    },
    gameDescription: "Get reseller pricing, bulk access & dashboard.",
    inputFieldOne: "User Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "reseller-1m",
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image: "/membership/reseller-m.png",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "reseller-3m",
        sellingPrice: 249,
        dummyPrice: 749,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image: "/membership/reseller-m.png",
        },
      },
      {
        itemName: "6 Months",
        itemSlug: "reseller-6m",
        sellingPrice: 499,
        dummyPrice: 1499,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image: "/membership/reseller-m.png",
        },
      },
      {
        itemName: "12 Months",
        itemSlug: "reseller-12m",
        sellingPrice: 899,
        dummyPrice: 2699,
        itemAvailablity: true,
        index: 4,
        itemImageId: {
          image: "/membership/reseller-m.png",
        },
      },
    ],
  },
};

/* ================= OTT CONFIG ================= */
const OTTS = {
  "youtube-premium": {
    gameName: "YouTube Premium",
    gameFrom: "Google",
    gameImageId: {
      image: "/ott/youtube.webp",
    },
    gameDescription: "Ad-free YouTube, background play, YouTube Music.",
    inputFieldOne: "Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "yt-1m",
        sellingPrice: 25,
        dummyPrice: 199,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image: "/ott/youtube.webp",
        },
      },
    ],
  },

  netflix: {
    gameName: "Netflix",
    gameFrom: "Netflix Inc.",
    gameImageId: {
      image: "/ott/netflix.webp",
    },
    gameDescription: "Movies & series streaming subscription.",
    inputFieldOne: "Account Email",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "nf-1m",
        sellingPrice: 110,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image: "/ott/netflix.webp",
        },
      },
    ],
  },

  spotify: {
    gameName: "Spotify Premium",
    gameFrom: "Spotify",
    gameImageId: {
      image: "/ott/spotify.webp",
    },
    gameDescription: "Premium music streaming subscription.",
    inputFieldOne: "Email / Phone",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1 Month",
        itemSlug: "spot-1m",
        sellingPrice: 30,
        dummyPrice: 179,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image: "/ott/spotify.webp",
        },
      },
    ],
  },
};

/* ================= COC CONFIG ================= */
const COC_CONFIG = {
  gameName: "Clash of Clans",
  gameFrom: "Supercell",
  image: "/game-assets/coc_logo.png",
  gameDescription: "Clash of Clans Top-up (Manual Process). High-speed delivery.",
  inputFieldOne: "Game ID (Player Tag)",
  inputFieldTwo: "Mobile Number",
  isValidationRequired: false,
  gameAvailablity: true,
  itemId: [
    {
      itemName: "Event Pass (India)",
      itemSlug: "coc-event-pass-in",
      sellingPrice: 230,
      dummyPrice: 299,
      itemAvailablity: true,
      index: 1,
      itemImageId: {
        image: "/game-assets/coc_logo.png",
      },
    },
    {
      itemName: "Gold Pass (India)",
      itemSlug: "coc-gold-pass-in",
      sellingPrice: 330,
      dummyPrice: 449,
      itemAvailablity: true,
      index: 2,
      itemImageId: {
        image: "/game-assets/coc_logo.png",
      },
    },
    {
      itemName: "Event Pass (Global)",
      itemSlug: "coc-event-pass-global",
      sellingPrice: 449,
      dummyPrice: 549,
      itemAvailablity: true,
      index: 3,
      itemImageId: {
        image: "/game-assets/coc_logo.png",
      },
    },
    {
      itemName: "Gold Pass (Global)",
      itemSlug: "coc-gold-pass-global",
      sellingPrice: 599,
      dummyPrice: 749,
      itemAvailablity: true,
      index: 4,
      itemImageId: {
        image: "/game-assets/coc_logo.png",
      },
    },
  ],
};

/* ================= STARLIGHT CONFIG ================= */
const STARLIGHT_CONFIG = {
  gameName: "Starlight Card",
  gameFrom: "Moonton",
  gameImageId: {
    image: "/game-assets/starkight.webp",
  },
  gameDescription: "Mobile Legends Starlight Membership (Manual Process).",
  inputFieldOne: "Player ID (Server ID)",
  inputFieldTwo: "Mobile Number",
  isValidationRequired: false,
  gameAvailablity: false,
  itemId: [
    {
      itemName: "Normal Starlight",
      itemSlug: "starlight-normal",
      sellingPrice: 230,
      dummyPrice: 299,
      itemAvailablity: false,
      index: 1,
      itemImageId: {
        image: "/game-assets/starkight.webp",
      },
    },
    {
      itemName: "Premium Starlight",
      itemSlug: "starlight-premium",
      sellingPrice: 500,
      dummyPrice: 599,
      itemAvailablity: false,
      index: 2,
      itemImageId: {
        image: "/game-assets/starkight.webp",
      },
    },
  ],
};

/* ================= BGMI CONFIG ================= */
const BGMI_CONFIG = {
  gameName: "BGMI",
  gameFrom: "Krafton",
  gameImageId: {
    image: "/game-assets/bgmi-logo.webp",
  },
  gameDescription: "Battlegrounds Mobile India (Manual Process). High-speed delivery.",
  inputFieldOne: "Character ID",
  inputFieldTwo: "Mobile Number",
  isValidationRequired: false,
  gameAvailablity: true,
  itemId: [
    {
      itemName: "60 UC",
      itemSlug: "bgmi-60-uc",
      sellingPrice: 73,
      dummyPrice: 95,
      itemAvailablity: true,
      index: 1,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
    {
      itemName: "325 UC",
      itemSlug: "bgmi-325-uc",
      sellingPrice: 375,
      dummyPrice: 490,
      itemAvailablity: true,
      index: 2,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
    {
      itemName: "660 UC",
      itemSlug: "bgmi-660-uc",
      sellingPrice: 729,
      dummyPrice: 980,
      itemAvailablity: true,
      index: 3,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
    {
      itemName: "1800 UC",
      itemSlug: "bgmi-1800-uc",
      sellingPrice: 1849,
      dummyPrice: 2400,
      itemAvailablity: true,
      index: 4,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
    {
      itemName: "3850 UC",
      itemSlug: "bgmi-3850-uc",
      sellingPrice: 3749,
      dummyPrice: 4800,
      itemAvailablity: true,
      index: 5,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
    {
      itemName: "8100 UC",
      itemSlug: "bgmi-8100-uc",
      sellingPrice: 7299,
      dummyPrice: 9400,
      itemAvailablity: true,
      index: 6,
      itemImageId: {
        image: "/game-assets/bgmi-logo.webp",
      },
    },
  ],
};

/* ================= ROLE → PRICING (FIXED) ================= */
const resolvePricingRole = (role) => {
  if (["user", "member", "admin"].includes(role)) return role;
  return null; // owner → base price
};

/* ================= API ================= */
export async function GET(req, { params }) {
  const { slug } = await params;

  try {
    /* ===== STATIC PRODUCTS ===== */
    if (OTTS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...OTTS[slug] },
      });
    }

    if (slug === "coc-manual") {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...COC_CONFIG },
      });
    }

    if (slug === "starlight-card-manual") {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...STARLIGHT_CONFIG },
      });
    }

    if (slug === "bgmi-manual") {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...BGMI_CONFIG },
      });
    }

    if (MEMBERSHIPS[slug]) {
      return NextResponse.json({
        success: true,
        data: { gameSlug: slug, ...MEMBERSHIPS[slug] },
      });
    }

    /* ===== OPTIONAL AUTH ===== */
    let userType = "user";
    const auth = req.headers.get("authorization");

    if (auth?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          auth.split(" ")[1],
          process.env.JWT_SECRET
        );
        if (decoded?.userType) userType = decoded.userType;
      } catch { }
    }

    const pricingRole = resolvePricingRole(userType);

    /* ===== FETCH BASE GAME ===== */
    const response = await fetch(
      `https://game-off-ten.vercel.app/api/v1/game/${slug}`,
      {
        headers: { "x-api-key": process.env.API_SECRET_KEY },
      }
    );

    const data = await response.json();
    if (!data?.data?.itemId) return NextResponse.json(data);

    /* ===== FETCH PRICING ===== */
    await connectDB();

    let pricingConfig = null;
    if (pricingRole) {
      pricingConfig = await PricingConfig.findOne({
        userType: pricingRole,
      }).lean();
    }

    const gameSlug = data.data.gameSlug;

    /* ================= COMBO OFFERS (PRE-PRICING) ================= */
    const baseWeeklyPass = data.data.itemId.find(
      (i) => i.itemSlug === "weekly-pass816"
    );

    if (baseWeeklyPass) {
      const combos = [
        // { multiplier: 2, label: "2x" },
        // { multiplier: 3, label: "3x" },
      ];

      combos.forEach((combo) => {
        // Only add if it doesn't already exist from the source API
        const exists = data.data.itemId.find(
          (i) => i.itemSlug === `${baseWeeklyPass.itemSlug}-${combo.multiplier}x`
        );
        if (!exists) {
          data.data.itemId.push({
            ...baseWeeklyPass,
            itemName: `${combo.label} ${baseWeeklyPass.itemName}`,
            itemSlug: `${baseWeeklyPass.itemSlug}-${combo.multiplier}x`,
            sellingPrice: baseWeeklyPass.sellingPrice * combo.multiplier,
            dummyPrice: baseWeeklyPass.dummyPrice
              ? baseWeeklyPass.dummyPrice * combo.multiplier
              : undefined,
            index: baseWeeklyPass.index + combo.multiplier * 0.1,
          });
        }
      });
    }

    /* ===== APPLY PRICING ===== */
    data.data.itemId = applyPricingToItems(data.data.itemId, gameSlug, pricingConfig);

    // Final sort to keep UI clean
    data.data.itemId.sort((a, b) => a.sellingPrice - b.sellingPrice);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Game Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
