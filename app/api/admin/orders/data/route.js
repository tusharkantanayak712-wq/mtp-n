import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

function verifyOwner(req) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        throw { status: 401, message: "Unauthorized" };
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType !== "owner") {
        throw { status: 403, message: "Forbidden" };
    }

    return decoded;
}

export async function GET(req) {
    try {
        await connectDB();
        verifyOwner(req);

        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
        const search = searchParams.get("search")?.trim();
        const status = searchParams.get("status");
        const gameSlug = searchParams.get("gameSlug");
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const skip = (page - 1) * limit;

        let filter = {};

        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { gameSlug: { $regex: search, $options: "i" } },
                { itemName: { $regex: search, $options: "i" } },
                { playerId: { $regex: search, $options: "i" } },
            ];
        }

        if (status) filter.status = status;
        if (gameSlug) filter.gameSlug = gameSlug;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        return Response.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        return Response.json(
            { success: false, message: err.message || "Server error" },
            { status: err.status || 500 }
        );
    }
}
