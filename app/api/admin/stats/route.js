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

        /* ================= AGGREGATION ================= */
        const [totalBalance, topWallets] = await Promise.all([
            // Sum all user wallets
            User.aggregate([
                { $match: { wallet: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: "$wallet" } } }
            ]),
            // Top 10 wallets
            User.find({ wallet: { $gt: 0 } })
                .sort({ wallet: -1 })
                .limit(10)
                .select("name userId wallet email userType")
                .lean()
        ]);

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            data: {
                totalBalance: totalBalance[0]?.total || 0,
                topWallets: topWallets || [],
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
