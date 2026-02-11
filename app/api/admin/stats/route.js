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

        /* ================= QUERY PARAMS ================= */
        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        /* ================= AGGREGATION & FETCH ================= */
        // Base query: wallet > 0
        const query = { wallet: { $gt: 0 } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } }
            ];
        }

        const [totalBalanceAgg, wallets, totalCount] = await Promise.all([
            // Sum all user wallets (this is global sum, not affected by pagination/search usually, 
            // but maybe we want global sum regardless of search? Keeping it global for now)
            User.aggregate([
                { $match: { wallet: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: "$wallet" } } }
            ]),
            // Paginated wallets
            User.find(query)
                .sort({ wallet: -1 })
                .skip(skip)
                .limit(limit)
                .select("name userId wallet email userType")
                .lean(),
            // Count for pagination
            User.countDocuments(query)
        ]);

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            data: {
                totalBalance: totalBalanceAgg[0]?.total || 0,
                wallets: wallets || [],
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
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
