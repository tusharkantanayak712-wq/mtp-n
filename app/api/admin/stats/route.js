import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
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

        /* ================= STATS ================= */
        const now = new Date();
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [walletStats, txStats, totalActive] = await Promise.all([
            // User Wallet Stats
            User.aggregate([
                { $match: { wallet: { $gt: 0 } } },
                { $group: { _id: null, totalBalance: { $sum: "$wallet" } } }
            ]),
            // Transaction Aggregates grouped by time facets
            WalletTransaction.aggregate([
                {
                    $facet: {
                        "deposits": [
                            { $match: { type: "credit", status: "success" } },
                            {
                                $group: {
                                    _id: null,
                                    day: { $sum: { $cond: [{ $gte: ["$createdAt", startOfDay] }, "$amount", 0] } },
                                    week: { $sum: { $cond: [{ $gte: ["$createdAt", startOfWeek] }, "$amount", 0] } },
                                    month: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$amount", 0] } }
                                }
                            }
                        ],
                        "usage": [
                            { $match: { type: "debit", status: "success" } },
                            {
                                $group: {
                                    _id: null,
                                    day: { $sum: { $cond: [{ $gte: ["$createdAt", startOfDay] }, "$amount", 0] } },
                                    week: { $sum: { $cond: [{ $gte: ["$createdAt", startOfWeek] }, "$amount", 0] } },
                                    month: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$amount", 0] } }
                                }
                            }
                        ]
                    }
                }
            ]),
            User.countDocuments({ wallet: { $gt: 0 } })
        ]);

        const txData = txStats[0];

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            data: {
                totalBalance: walletStats[0]?.totalBalance || 0,
                activeWallets: totalActive,
                deposits: {
                    day: txData.deposits[0]?.day || 0,
                    week: txData.deposits[0]?.week || 0,
                    month: txData.deposits[0]?.month || 0,
                },
                usage: {
                    day: txData.usage[0]?.day || 0,
                    week: txData.usage[0]?.week || 0,
                    month: txData.usage[0]?.month || 0,
                }
            },
        });
    } catch (err) {
        console.error("Stats fetch failed", err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
