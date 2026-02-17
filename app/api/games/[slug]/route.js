import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";

/* ================= MEMBERSHIP CONFIG ================= */
const MEMBERSHIPS = {
  "silver-membership": {
    gameName: "Silver Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
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
        sellingPrice: 100,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "silver-3m",
        sellingPrice: 200,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/rs_klee62.png",
        },
      },
    ],
  },

  "reseller-membership": {
    gameName: "Reseller Membership",
    gameFrom: "Your Platform",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
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
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
        },
      },
      {
        itemName: "3 Month",
        itemSlug: "reseller-3m",
        sellingPrice: 299,
        dummyPrice: 1099,
        itemAvailablity: true,
        index: 3,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767096434/sew_zcz775.png",
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
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
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
        sellingPrice: 30,
        dummyPrice: 199,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "yt-3m",
        sellingPrice: 90,
        dummyPrice: 499,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/aa_avjoox.jpg",
        },
      },
    ],
  },

  netflix: {
    gameName: "Netflix",
    gameFrom: "Netflix Inc.",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
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
        sellingPrice: 99,
        dummyPrice: 299,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
        },
      },
      {
        itemName: "3 Months",
        itemSlug: "nf-3m",
        sellingPrice: 249,
        dummyPrice: 799,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/s_d5mln0.jpg",
        },
      },
    ],
  },

  instagram: {
    gameName: "Instagram Services",
    gameFrom: "Meta",
    gameImageId: {
      image:
        "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
    },
    gameDescription: "Followers, likes & engagement services.",
    inputFieldOne: "Username",
    inputFieldTwoOption: [],
    isValidationRequired: false,
    gameAvailablity: true,
    itemId: [
      {
        itemName: "1K Followers",
        itemSlug: "ig-1k",
        sellingPrice: 249,
        dummyPrice: 499,
        itemAvailablity: true,
        index: 1,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
        },
      },
      {
        itemName: "5K Followers",
        itemSlug: "ig-5k",
        sellingPrice: 1099,
        dummyPrice: 1999,
        itemAvailablity: true,
        index: 2,
        itemImageId: {
          image:
            "https://res.cloudinary.com/dk0sslz1q/image/upload/v1767027180/a_jnlvg0.jpg",
        },
      },
    ],
  },
};

/* ================= COC CONFIG ================= */
// const COC_CONFIG = {
//   gameName: "Clash of Clans",
//   gameFrom: "Supercell",
//   gameImageId: {
//     image:
//       "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771307213/coc_dqjjc0.png",
//   },
//   gameDescription: "Clash of Clans Top-up (Manual Process). High-speed delivery.",
//   inputFieldOne: "Game ID (Player Tag)",
//   inputFieldTwo: "Mobile Number",
//   isValidationRequired: false,
//   gameAvailablity: true,
//   itemId: [
//     {
//       itemName: "Event Pass (India)",
//       itemSlug: "coc-event-pass-in",
//       sellingPrice: 230,
//       dummyPrice: 299,
//       itemAvailablity: true,
//       index: 1,
//       itemImageId: {
//         image:
//           "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771307213/coc_dqjjc0.png",
//       },
//     },
//     {
//       itemName: "Gold Pass (India)",
//       itemSlug: "coc-gold-pass-in",
//       sellingPrice: 330,
//       dummyPrice: 449,
//       itemAvailablity: true,
//       index: 2,
//       itemImageId: {
//         image:
//           "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771307213/coc_dqjjc0.png",
//       },
//     },
//     {
//       itemName: "Event Pass (Global)",
//       itemSlug: "coc-event-pass-global",
//       sellingPrice: 449,
//       dummyPrice: 549,
//       itemAvailablity: true,
//       index: 3,
//       itemImageId: {
//         image:
//           "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771307213/coc_dqjjc0.png",
//       },
//     },
//     {
//       itemName: "Gold Pass (Global)",
//       itemSlug: "coc-gold-pass-global",
//       sellingPrice: 599,
//       dummyPrice: 749,
//       itemAvailablity: true,
//       index: 4,
//       itemImageId: {
//         image:
//           "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771307213/coc_dqjjc0.png",
//       },
//     },
//   ],
// };

/* ================= STARLIGHT CONFIG ================= */
const STARLIGHT_CONFIG = {
  gameName: "Starlight Card",
  gameFrom: "Moonton",
  gameImageId: {
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771308008/starkight_xk7xqv.webp",
  },
  gameDescription: "Mobile Legends Starlight Membership (Manual Process).",
  inputFieldOne: "Player ID (Server ID)",
  inputFieldTwo: "Mobile Number",
  isValidationRequired: false,
  gameAvailablity: true,
  itemId: [
    {
      itemName: "Normal Starlight",
      itemSlug: "starlight-normal",
      sellingPrice: 230,
      dummyPrice: 299,
      itemAvailablity: true,
      index: 1,
      itemImageId: {
        image:
          "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771308008/starkight_xk7xqv.webp",
      },
    },
    {
      itemName: "Premium Starlight",
      itemSlug: "starlight-premium",
      sellingPrice: 500,
      dummyPrice: 599,
      itemAvailablity: true,
      index: 2,
      itemImageId: {
        image:
          "https://res.cloudinary.com/dk0sslz1q/image/upload/v1771308008/starkight_xk7xqv.webp",
      },
    },
  ],
};

/* ================= BGMI CONFIG ================= */
const BGMI_CONFIG = {
  gameName: "BGMI",
  gameFrom: "Krafton",
  gameImageId: {
    image:
      "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
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
      sellingPrice: 72,
      dummyPrice: 95,
      itemAvailablity: true,
      index: 1,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
    },
    {
      itemName: "325 UC",
      itemSlug: "bgmi-325-uc",
      sellingPrice: 360,
      dummyPrice: 490,
      itemAvailablity: true,
      index: 2,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
    },
    {
      itemName: "660 UC",
      itemSlug: "bgmi-660-uc",
      sellingPrice: 700,
      dummyPrice: 980,
      itemAvailablity: true,
      index: 3,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
    },
    {
      itemName: "1800 UC",
      itemSlug: "bgmi-1800-uc",
      sellingPrice: 1760,
      dummyPrice: 2400,
      itemAvailablity: true,
      index: 4,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
    },
    {
      itemName: "3850 UC",
      itemSlug: "bgmi-3850-uc",
      sellingPrice: 3600,
      dummyPrice: 4800,
      itemAvailablity: true,
      index: 5,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
      },
    },
    {
      itemName: "8100 UC",
      itemSlug: "bgmi-8100-uc",
      sellingPrice: 7200,
      dummyPrice: 9400,
      itemAvailablity: true,
      index: 6,
      itemImageId: {
        image: "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768502877/WhatsApp_Image_2026-01-16_at_00.15.15_sbkqaz.jpg",
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

    // if (slug === "coc-manual") {
    //   return NextResponse.json({
    //     success: true,
    //     data: { gameSlug: slug, ...COC_CONFIG },
    //   });
    // }

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
    data.data.itemId = data.data.itemId.map((item) => {
      const basePrice = Number(item.sellingPrice);
      let finalPrice = basePrice;

      const override = pricingConfig?.overrides?.find(
        (o) =>
          o.gameSlug === gameSlug &&
          o.itemSlug === item.itemSlug
      );

      if (override?.fixedPrice != null) {
        finalPrice = override.fixedPrice;
      } else {
        const slab = pricingConfig?.slabs?.find(
          (s) => basePrice >= s.min && basePrice < s.max
        );
        if (slab) {
          finalPrice = basePrice * (1 + slab.percent / 100);
        }
      }

      return {
        ...item,
        sellingPrice: Math.ceil(finalPrice),
      };
    });

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
