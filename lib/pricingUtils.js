import PricingConfig from "@/models/PricingConfig";

/* ================= STATIC CONFIGS ================= */
const MEMBERSHIPS = {
    "silver-membership": {
        itemId: [
            { itemSlug: "silver-6m", itemName: "Silver 6 Months", sellingPrice: 550 },
            { itemSlug: "silver-12m", itemName: "Silver 12 Months", sellingPrice: 1000 },
        ],
    },
    "reseller-membership": {
        itemId: [
            { itemSlug: "reseller-6m", itemName: "Reseller 6 Months", sellingPrice: 550 },
            { itemSlug: "reseller-12m", itemName: "Reseller 12 Months", sellingPrice: 1000 },
        ],
    },
};

const OTTS = {
    "youtube-premium": {
        itemId: [{ itemSlug: "yt-1m", itemName: "YouTube Premium 1m", sellingPrice: 25 }],
    },
    netflix: {
        itemId: [{ itemSlug: "nf-1m", itemName: "Netflix 1m", sellingPrice: 110 }],
    },
    spotify: {
        itemId: [{ itemSlug: "spot-1m", itemName: "Spotify 1m", sellingPrice: 30 }],
    },
};

const STARLIGHT_CONFIG = {
    itemId: [
        { itemSlug: "starlight-normal", itemName: "Normal Starlight", sellingPrice: 230 },
        { itemSlug: "starlight-premium", itemName: "Premium Starlight", sellingPrice: 500 },
    ],
};

const BGMI_CONFIG = {
    itemId: [
        { itemSlug: "bgmi-60-uc", itemName: "60 UC", sellingPrice: 75 },
        { itemSlug: "bgmi-325-uc", itemName: "325 UC", sellingPrice: 380 },
        { itemSlug: "bgmi-660-uc", itemName: "660 UC", sellingPrice: 760 },
        { itemSlug: "bgmi-1800-uc", itemName: "1800 UC", sellingPrice: 1970 },
        { itemSlug: "bgmi-3850-uc", itemName: "3850 UC", sellingPrice: 3950 },
        { itemSlug: "bgmi-8100-uc", itemName: "8100 UC", sellingPrice: 8100 },
    ],
};

const resolvePricingRole = (role) => {
    if (["user", "member", "admin"].includes(role)) return role;
    return null; // owner → base price
};

export async function calculateItemPrice(gameSlug, itemSlug, userType) {
    let baseItem = null;
    let itemName = "";

    // 1. Check local static configs
    if (OTTS[gameSlug]) {
        baseItem = OTTS[gameSlug].itemId.find((i) => i.itemSlug === itemSlug);
    } else if (gameSlug === "starlight-card-manual") {
        baseItem = STARLIGHT_CONFIG.itemId.find((i) => i.itemSlug === itemSlug);
    } else if (gameSlug === "bgmi-manual") {
        baseItem = BGMI_CONFIG.itemId.find((i) => i.itemSlug === itemSlug);
    } else if (MEMBERSHIPS[gameSlug]) {
        baseItem = MEMBERSHIPS[gameSlug].itemId.find((i) => i.itemSlug === itemSlug);
    }

    // 2. If not found locally, fetch from external API
    if (!baseItem) {
        try {
            const response = await fetch(
                `https://game-off-ten.vercel.app/api/v1/game/${gameSlug}`,
                {
                    headers: { "x-api-key": process.env.API_SECRET_KEY },
                }
            );
            const data = await response.json();
            if (data?.success && data.data?.itemId) {
                baseItem = data.data.itemId.find((i) => i.itemSlug === itemSlug);
            }
        } catch (error) {
            console.error("External API Price Fetch Error:", error);
        }
    }

    if (!baseItem) return null;

    itemName = baseItem.itemName || itemSlug;
    const basePrice = Number(baseItem.sellingPrice);

    // 3. Apply Markup/Overrides based on User Type
    const pricingRole = resolvePricingRole(userType);
    if (!pricingRole) return { price: Math.ceil(basePrice), itemName }; // Owner or base

    const pricingConfig = await PricingConfig.findOne({ userType: pricingRole }).lean();

    let finalPrice = basePrice;
    const override = pricingConfig?.overrides?.find(
        (o) => o.gameSlug === gameSlug && o.itemSlug === itemSlug
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

    return { price: Math.ceil(finalPrice), itemName };
}
