import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { unstable_cache } from "next/cache";

/* ================= AUTH (ANY USER) ================= */
function verifyUser(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET!);
}

/* ================= DATE HELPERS ================= */
function getDateFilter(
  range: string,
  start?: string | null,
  end?: string | null
) {
  const now = new Date();

  if (range === "monthly") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return { $gte: monthStart };
  }

  if (range === "prev-month") {
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { $gte: prevMonthStart, $lte: prevMonthEnd };
  }

  if (range === "custom") {
    const filter: any = {};

    if (start) {
      const startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        throw { status: 400, message: "Invalid start date" };
      }
      filter.$gte = startDate;
    }

    if (end) {
      const endDate = new Date(end);
      if (isNaN(endDate.getTime())) {
        throw { status: 400, message: "Invalid end date" };
      }

      // Include full end day
      endDate.setHours(23, 59, 59, 999);
      filter.$lte = endDate;
    }

    if (!start && !end) {
      throw {
        status: 400,
        message: "Start or end date required for custom range",
      };
    }

    return filter;
  }

  return null; // all-time
}

/* ================= LEADERBOARD ================= */
export async function GET(req: Request) {
  try {
    await connectDB();
    verifyUser(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const range = searchParams.get("range") || "all";
    const type = searchParams.get("type") || "purchase"; // purchase | referral
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const skip = (page - 1) * limit;

    let data = [];
    let total = 0;

    /* ================= CACHED AGGREGATION WRAPPER ================= */
    const getCachedLeaderboard = unstable_cache(
      async (t: string, r: string, s: string | null, e: string | null, sk: number, l: number) => {
        if (t === "referral") {
          const match: any = { referredBy: { $exists: true, $ne: null } };
          const df = getDateFilter(r, s, e);
          if (df) match.createdAt = df;

          const leaderboard = await User.aggregate([
            { $match: match },
            {
              $group: {
                _id: "$referredBy",
                referralCount: { $sum: 1 },
                lastReferralAt: { $max: "$createdAt" }
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "userId",
                as: "referrerInfo"
              }
            },
            { $unwind: "$referrerInfo" },
            { $sort: { referralCount: -1 } },
            {
              $facet: {
                data: [
                  { $skip: sk },
                  { $limit: l },
                  {
                    $project: {
                      _id: 0,
                      referralCount: 1,
                      user: {
                        name: "$referrerInfo.name",
                        userId: "$referrerInfo.userId",
                        avatar: "$referrerInfo.avatar"
                      }
                    }
                  }
                ],
                totalCount: [{ $count: "count" }]
              }
            }
          ]);
          return {
            data: leaderboard[0]?.data || [],
            total: leaderboard[0]?.totalCount[0]?.count || 0
          };
        } else {
          const match: any = { paymentStatus: "success", topupStatus: "success" };
          const df = getDateFilter(r, s, e);
          if (df) match.createdAt = df;

          const leaderboard = await Order.aggregate([
            { $match: match },
            {
              $group: {
                _id: { email: "$email", phone: "$phone" },
                totalSpent: { $sum: "$price" },
                totalOrders: { $sum: 1 },
                lastOrderAt: { $max: "$createdAt" },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { email: "$_id.email", phone: "$_id.phone" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $eq: ["$email", "$$email"] },
                          { $eq: ["$phone", "$$phone"] },
                        ],
                      },
                    },
                  },
                  { $project: { _id: 0, userId: 1, name: 1, email: 1, phone: 1 } },
                ],
                as: "user",
              },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $sort: { totalSpent: -1 } },
            {
              $facet: {
                data: [{ $skip: sk }, { $limit: l }],
                totalCount: [{ $count: "count" }],
              },
            },
          ]);
          return {
            data: leaderboard[0]?.data || [],
            total: leaderboard[0]?.totalCount[0]?.count || 0
          };
        }
      },
      ["leaderboard-cache"],
      { revalidate: 600, tags: ["leaderboard"] } // Cache for 10 minutes
    );

    const result = await getCachedLeaderboard(type, range, start, end, skip, limit);
    data = result.data;
    total = result.total;

    return Response.json({
      success: true,
      range,
      type,
      filters: { start, end },
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (err: any) {
    return Response.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: err.status || 500 }
    );
  }
}
