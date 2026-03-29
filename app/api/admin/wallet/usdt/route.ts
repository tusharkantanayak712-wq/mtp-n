import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UsdtDeposit from "@/models/UsdtDeposit";
import WalletTransaction from "@/models/WalletTransaction";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await connectDB();

        // ============ ADMIN AUTH ============
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
        }

        if (decoded.userType !== "owner" && decoded.userType !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const { depositId, action, notes } = await req.json();
        // action: "confirm" | "reject"

        if (!depositId || !action) {
            return NextResponse.json({ success: false, message: "depositId and action required" }, { status: 400 });
        }

        const deposit = await UsdtDeposit.findOne({ depositId });
        if (!deposit) {
            return NextResponse.json({ success: false, message: "Deposit not found" }, { status: 404 });
        }

        if (deposit.status === "confirmed") {
            return NextResponse.json({ success: true, message: "Deposit already confirmed" });
        }

        if (action === "reject") {
            deposit.status = "failed";
            deposit.confirmedBy = decoded.userId;
            deposit.notes = notes || "Rejected by admin";
            await deposit.save();
            return NextResponse.json({ success: true, message: "Deposit rejected" });
        }

        if (action !== "confirm") {
            return NextResponse.json({ success: false, message: "Invalid action. Use confirm or reject" }, { status: 400 });
        }

        // ============ CONFIRM & CREDIT ============
        // Lock: update status to confirmed only if not already confirmed
        const locked = await UsdtDeposit.findOneAndUpdate(
            { _id: deposit._id, status: { $ne: "confirmed" } },
            {
                $set: {
                    status: "confirmed",
                    confirmedBy: decoded.userId,
                    notes: notes || "Confirmed by admin",
                },
            },
            { new: true }
        );

        if (!locked) {
            return NextResponse.json({ success: true, message: "Already processed" });
        }

        // Credit user wallet
        const user = await User.findOneAndUpdate(
            { _id: deposit.userObjectId },
            { $inc: { wallet: deposit.coinsToCredit } },
            { new: true }
        );

        if (!user) {
            // Rollback
            await UsdtDeposit.findByIdAndUpdate(deposit._id, { $set: { status: "submitted", notes: "User not found - rollback" } });
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Record WalletTransaction
        const transactionId = `USDT${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        await WalletTransaction.create({
            transactionId,
            userId: deposit.userId,
            userObjectId: deposit.userObjectId,
            type: "credit",
            amount: deposit.coinsToCredit,
            balanceBefore: user.wallet - deposit.coinsToCredit,
            balanceAfter: user.wallet,
            description: `USDT Deposit Confirmed — ${deposit.usdtAmount} USDT via ${deposit.network}`,
            status: "success",
            referenceId: deposit.depositId,
            performedBy: "admin",
        });

        return NextResponse.json({
            success: true,
            message: `Successfully confirmed & credited ${deposit.coinsToCredit} coins (${deposit.usdtAmount} USDT)`,
            newWalletBalance: user.wallet,
        });

    } catch (err) {
        console.error("USDT confirm error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// List pending USDT deposits for admin panel
export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
        }

        if (decoded.userType !== "owner" && decoded.userType !== "admin") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const url = new URL(req.url);
        const status = url.searchParams.get("status") || "submitted";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = 20;

        // Auto-expire
        await UsdtDeposit.updateMany(
            { status: "waiting", expiresAt: { $lt: new Date() } },
            { $set: { status: "expired" } }
        );

        const total = await UsdtDeposit.countDocuments({ status });
        const deposits = await UsdtDeposit.find({ status })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            deposits,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        console.error("USDT list error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
