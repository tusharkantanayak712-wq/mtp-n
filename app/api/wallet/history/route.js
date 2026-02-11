import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            const token = auth.split(" ")[1];
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const { userId } = decoded;

        /* ================= QUERY PARAMS ================= */
        const { searchParams } = new URL(req.url);
        const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
        const skip = (page - 1) * limit;

        /* ================= QUERY ================= */
        // Get user details to filter by various user identifiers
        let user = await User.findOne({ userId: decoded.userId });
        if (!user) user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const query = {
            $or: [
                { userId: user.userId }, // Custom ID
                { userObjectId: user._id } // Mongo ID
            ]
        };

        const [transactions, total] = await Promise.all([
            WalletTransaction.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-userObjectId -__v") // Exclude internal fields
                .lean(),
            WalletTransaction.countDocuments(query),
        ]);

        /* ================= RESPONSE ================= */
        return NextResponse.json({
            success: true,
            data: transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("User wallet history fetch failed", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
