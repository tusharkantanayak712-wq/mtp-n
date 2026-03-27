import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import UsdtDeposit from "@/models/UsdtDeposit";

export async function GET(req: Request) {
    try {
        await connectDB();

        // ============ AUTH ============
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const url = new URL(req.url);
        const depositId = url.searchParams.get("depositId");

        if (!depositId) {
            return NextResponse.json({ success: false, message: "depositId required" }, { status: 400 });
        }

        const deposit = await UsdtDeposit.findOne({ depositId });
        if (!deposit) {
            return NextResponse.json({ success: false, message: "Deposit not found" }, { status: 404 });
        }

        // Verify ownership
        if (deposit.userId !== decoded.userId && deposit.userObjectId?.toString() !== decoded.userId) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const now = new Date();
        const expiresAt = new Date(deposit.expiresAt);

        if (deposit.status === "waiting" && now > expiresAt) {
            deposit.status = "expired";
            await deposit.save();
        }

        return NextResponse.json({
            success: true,
            deposit: {
                depositId: deposit.depositId,
                usdtAmount: deposit.usdtAmount,
                coinsToCredit: deposit.coinsToCredit,
                network: deposit.network,
                depositAddress: deposit.depositAddress,
                txHash: deposit.txHash,
                status: deposit.status,
                expiresAt: deposit.expiresAt,
                createdAt: deposit.createdAt,
            },
        });

    } catch (err) {
        console.error("USDT status error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
