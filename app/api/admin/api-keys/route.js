import { connectDB } from "@/lib/mongodb";
import ApiKey from "@/models/ApiKey";
import Order from "@/models/Order";
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

        /* ================= QUERY ================= */
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Fetch all API keys with user info and recent order status
        const keys = await ApiKey.aggregate([
            {
                $addFields: {
                    user_oid: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_oid",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "orders",
                    let: {
                        customId: "$userDetails.userId",
                        objectIdStr: { $toString: "$userDetails._id" }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $or: [
                                                { $eq: ["$userId", "$$customId"] },
                                                { $eq: ["$userId", "$$objectIdStr"] }
                                            ]
                                        },
                                        { $gte: ["$createdAt", last24h] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: "recentOrders"
                }
            },
            {
                $project: {
                    name: 1,
                    lastFour: 1,
                    status: 1,
                    lastUsed: 1,
                    dailyLimit: { $ifNull: ["$dailyLimit", 10000] },
                    usedToday: { $ifNull: ["$usedToday", 0] },
                    "userDetails.name": 1,
                    "userDetails.userId": 1,
                    "userDetails.email": 1,
                    hasRecentOrder: { $gt: [{ $size: "$recentOrders" }, 0] }
                }
            },
            { $sort: { lastUsed: -1 } }
        ]);

        return Response.json({
            success: true,
            data: keys
        });
    } catch (err) {
        console.error("API Keys Fetch Error:", err);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
