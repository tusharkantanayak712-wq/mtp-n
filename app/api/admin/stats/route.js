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

        const [totalBalanceAgg, todayCreditsAgg, todayDebitsAgg, totalCount] = await Promise.all([
            // Sum all user wallets
            User.aggregate([
                { $match: { wallet: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: "$wallet" } } }
            ]),
            // Today's Credits (Deposits)
            WalletTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfDay }, type: "credit", status: "success" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            // Today's Debits (Usage)
            WalletTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfDay }, type: "debit", status: "success" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            // Count active wallets for stats card
            User.countDocuments({ wallet: { $gt: 0 } })
        ]);

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            data: {
                totalBalance: totalBalanceAgg[0]?.total || 0,
                activeWallets: totalCount,
                todayDeposits: todayCreditsAgg[0]?.total || 0,
                todayUsage: todayDebitsAgg[0]?.total || 0
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
