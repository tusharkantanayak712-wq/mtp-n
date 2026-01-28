import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/* ================= AUTH HELPERS ================= */
const requireOwner = (req) => {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== "owner") {
      return { error: "Forbidden", status: 403 };
    }

    return { decoded };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

const requireAdminMemberOwner = (req) => {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // owner, admin, member can VIEW pricing
    if (!["owner", "admin", "member"].includes(decoded.userType)) {
      return { error: "Forbidden", status: 403 };
    }

    return { decoded };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

/* =================================================
   GET → Fetch pricing (SEPARATE FOR ALL ROLES)
   ================================================= */
export async function GET(req) {
  try {
    await connectDB();

    const authCheck = requireAdminMemberOwner(req);
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const userType = searchParams.get("userType");

    if (!userType) {
      return NextResponse.json(
        { success: false, message: "userType is required" },
        { status: 400 }
      );
    }

    if (!["user", "member", "admin"].includes(userType)) {
      return NextResponse.json(
        { success: false, message: "Invalid userType" },
        { status: 400 }
      );
    }

    const pricing = await PricingConfig.findOne({
      userType,
    }).lean();

    return NextResponse.json({
      success: true,
      data: {
        slabs: pricing?.slabs || [],
        overrides: pricing?.overrides || [],
      },
    });
  } catch (err) {
    console.error("GET pricing error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =================================================
   PATCH → Save pricing
   OWNER sets pricing for user / member / admin
   ================================================= */
export async function PATCH(req) {
  try {
    await connectDB();

    const authCheck = requireOwner(req);
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const body = await req.json();
    const { userType, slabs = [], overrides = [] } = body;

    if (!userType) {
      return NextResponse.json(
        { success: false, message: "userType is required" },
        { status: 400 }
      );
    }

    if (!["user", "member", "admin"].includes(userType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Pricing can only be set for user, member, or admin",
        },
        { status: 400 }
      );
    }

    /* ================= VALIDATE SLABS ================= */
    for (const s of slabs) {
      if (
        typeof s.min !== "number" ||
        typeof s.max !== "number" ||
        typeof s.percent !== "number"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid slab format" },
          { status: 400 }
        );
      }
    }

    /* ================= VALIDATE OVERRIDES ================= */
    for (const o of overrides) {
      if (
        !o.gameSlug ||
        !o.itemSlug ||
        typeof o.fixedPrice !== "number" ||
        o.fixedPrice < 0
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid override format" },
          { status: 400 }
        );
      }
    }

    /* ================= LOAD EXISTING ================= */

    const existing =
      (await PricingConfig.findOne({ userType })) ||
      new PricingConfig({ userType, slabs: [], overrides: [] });

    /* ================= MERGE OVERRIDES ================= */

    // key = gameSlug::itemSlug
    const overrideMap = new Map();

    // keep existing overrides
    for (const o of existing.overrides || []) {
      overrideMap.set(`${o.gameSlug}::${o.itemSlug}`, o);
    }

    // apply incoming overrides (replace or add)
    for (const o of overrides) {
      overrideMap.set(`${o.gameSlug}::${o.itemSlug}`, {
        gameSlug: o.gameSlug,
        itemSlug: o.itemSlug,
        fixedPrice: o.fixedPrice,
      });
    }

    const mergedOverrides = Array.from(overrideMap.values());

    /* ================= SAVE ================= */

    existing.slabs = slabs;
    existing.overrides = mergedOverrides;

    await existing.save();

    return NextResponse.json({
      success: true,
      data: existing,
    });
  } catch (err) {
    console.error("PATCH pricing error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
