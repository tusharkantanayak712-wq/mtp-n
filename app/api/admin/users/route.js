import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer "))
      return Response.json({ message: "Unauthorized" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== "owner")
      return Response.json({ message: "Forbidden" }, { status: 403 });

    /* ================= STATS (ACTIVE & NEW USERS) ================= */
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    /* ================= QUERY ================= */
    /* ================= SINGLE OPTIMIZED AGGREGATION ================= */
    const [statsResult, totalUsers] = await Promise.all([
      User.aggregate([
        {
          $facet: {
            "active": [
              {
                $group: {
                  _id: null,
                  day: { $sum: { $cond: [{ $gte: ["$lastLogin", last24h] }, 1, 0] } },
                  week: { $sum: { $cond: [{ $gte: ["$lastLogin", last7d] }, 1, 0] } },
                  month: { $sum: { $cond: [{ $gte: ["$lastLogin", last30d] }, 1, 0] } }
                }
              }
            ],
            "new": [
              {
                $group: {
                  _id: null,
                  day: { $sum: { $cond: [{ $gte: ["$createdAt", last24h] }, 1, 0] } },
                  week: { $sum: { $cond: [{ $gte: ["$createdAt", last7d] }, 1, 0] } },
                  month: { $sum: { $cond: [{ $gte: ["$createdAt", last30d] }, 1, 0] } }
                }
              }
            ]
          }
        }
      ]),
      User.countDocuments({}),
    ]);

    const stats = statsResult[0];

    /* ================= RESPONSE ================= */
    return Response.json({
      success: true,
      total: totalUsers,
      activeStats: {
        day: stats.active[0]?.day || 0,
        week: stats.active[0]?.week || 0,
        month: stats.active[0]?.month || 0,
      },
      newStats: {
        day: stats.new[0]?.day || 0,
        week: stats.new[0]?.week || 0,
        month: stats.new[0]?.month || 0,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }
}
