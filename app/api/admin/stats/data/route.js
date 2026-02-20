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

        /* ================= FILTER ================= */
        const query = { wallet: { $gt: 0 } };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { userId: { $regex: search, $options: "i" } }
            ];
        }

        /* ================= FETCH ================= */
        const [wallets, totalCount] = await Promise.all([
            User.find(query)
                .sort({ wallet: -1 })
                .skip(skip)
                .limit(limit)
                .select("name userId wallet email userType")
                .lean(),
            User.countDocuments(query)
        ]);

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            data: wallets || [],
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (err) {
        console.error("Wallet data fetch failed", err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
