import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        await connectDB();

        // ============ AUTHENTICATION ============
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const decodedUserId = decoded.userId;

        // Get current user to find their custom userId
        let currentUser = await User.findById(decodedUserId);
        if (!currentUser) {
            currentUser = await User.findOne({ userId: decodedUserId });
        }

        if (!currentUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const currentCustomId = currentUser.userId;

        // ============ PAGINATION ============
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "5");
        const skip = (page - 1) * limit;

        // ============ QUERY REFERRALS ============
        // Find users who were referred by THIS user (using their custom userId)
        const referrals = await User.find({ referredBy: currentCustomId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("name userId createdAt avatar"); // Select only necessary fields

        const total = await User.countDocuments({ referredBy: currentCustomId });

        return NextResponse.json({
            success: true,
            data: referrals,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error("Referral fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
