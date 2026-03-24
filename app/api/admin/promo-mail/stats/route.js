import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import PromoLog from "@/models/PromoLog";

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

        /* ================= STATS ================= */
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [totalStats, todayStats, recentLogs] = await Promise.all([
          // All time stats
          PromoLog.aggregate([
            { $group: { _id: null, totalSent: { $sum: "$successCount" } } }
          ]),
          // Today's stats
          PromoLog.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, totalSent: { $sum: "$successCount" } } }
          ]),
          // Last 10 logs
          PromoLog.find().sort({ createdAt: -1 }).limit(10)
        ]);

        return Response.json({
            success: true,
            stats: {
                totalEmails: totalStats[0]?.totalSent || 0,
                todayEmails: todayStats[0]?.totalSent || 0
            },
            recentLogs
        });

    } catch (err) {
        console.error("Promo Stats Error:", err);
        return Response.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
