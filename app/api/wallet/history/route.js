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
        const filter = searchParams.get("filter") || "all"; // all, inr, usdt

        /* ================= QUERY ================= */
        // Get user details to filter by various user identifiers
        let user = await User.findOne({ userId: decoded.userId });
        if (!user) user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const baseQuery = {
            $or: [
                { userId: user.userId }, // Custom ID
                { userObjectId: user._id } // Mongo ID
            ]
        };

        let txnQuery = { ...baseQuery };
        if (filter === "inr") {
            // Filter out transactions that have a referenceId starting with "USDT" or are from UsdtDeposit
            txnQuery.referenceId = { $not: /^USDT/ }; 
        } else if (filter === "usdt") {
            // Only transactions with referenceId starting with "USDT" 
            txnQuery.referenceId = /^USDT/;
        }

        // Update any waiting USDT deposits that have expired
        const now = new Date();
        await mongoose.model("UsdtDeposit").updateMany(
            { 
                ...baseQuery,
                status: "waiting", 
                expiresAt: { $lt: now } 
            },
            { $set: { status: "expired" } }
        );

        const [transactions, usdtDeposits, totalTransactionCount] = await Promise.all([
            WalletTransaction.find(txnQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-userObjectId -__v")
                .lean(),
            (filter === "all" || filter === "usdt") 
                ? mongoose.model("UsdtDeposit").find({ 
                    ...baseQuery, 
                    status: { $in: ["waiting", "submitted", "confirmed", "failed", "expired"] } 
                }).lean() 
                : Promise.resolve([]),
            WalletTransaction.countDocuments(txnQuery),
        ]);

        // Merge and Map
        const mappedUsdt = usdtDeposits
            .filter(d => d.status !== "confirmed") // confirmed ones are already in WalletTransaction
            .map(d => ({
                _id: d._id,
                transactionId: d.depositId,
                type: "credit",
                amount: d.coinsToCredit,
                description: `USDT Deposit (${d.usdtAmount} USDT via ${d.network})`,
                status: d.status === "submitted" ? "pending" : d.status, // submitted -> pending, others kept as is
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
                isUsdt: true
            }));

        const combined = [...mappedUsdt, ...transactions]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        /* ================= RESPONSE ================= */
        return NextResponse.json({
            success: true,
            data: combined,
            pagination: {
                total: totalTransactionCount + mappedUsdt.length,
                page,
                limit,
                totalPages: Math.ceil((totalTransactionCount + mappedUsdt.length) / limit),
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
