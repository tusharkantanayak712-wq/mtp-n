import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import CoinTransaction from "@/models/CoinTransaction";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (decoded.userType !== "owner") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const source = url.searchParams.get("source") || "";
    const type = url.searchParams.get("type") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { userId: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { referenceId: { $regex: search, $options: "i" } },
      ];
    }
    if (source) query.source = source;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    // Calculate Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [transactions, total, stats, userStats] = await Promise.all([
      CoinTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CoinTransaction.countDocuments(query),
      CoinTransaction.aggregate([
        {
          $facet: {
            overall: [
              { $group: {
                _id: "$type",
                total: { $sum: "$coins" }
              }}
            ],
            today: [
              { $match: { createdAt: { $gte: today } } },
              { $group: {
                _id: "$type",
                total: { $sum: "$coins" }
              }}
            ]
          }
        }
      ]),
      // Sum all coins from User model
      import("@/models/User").then(m => m.default.aggregate([
        { $group: { _id: null, total: { $sum: "$coins" } } }
      ]))
    ]);

    // Format stats for frontend
    const statsData = {
      totalEarned: stats[0].overall.find((s: any) => s._id === "earn")?.total || 0,
      totalSpent: stats[0].overall.find((s: any) => s._id === "spend")?.total || 0,
      todayEarned: stats[0].today.find((s: any) => s._id === "earn")?.total || 0,
      todaySpent: stats[0].today.find((s: any) => s._id === "spend")?.total || 0,
      totalAvailable: userStats[0]?.total || 0,
    };

    return NextResponse.json({
      success: true,
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: statsData,
    });
  } catch (error) {
    console.error("[admin/coins/history] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
