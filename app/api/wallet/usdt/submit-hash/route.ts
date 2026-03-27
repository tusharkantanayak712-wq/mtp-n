import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import UsdtDeposit from "@/models/UsdtDeposit";

export async function POST(req: Request) {
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

        const { depositId, txHash } = await req.json();

        if (!depositId || !txHash) {
            return NextResponse.json({ success: false, message: "depositId and txHash are required" }, { status: 400 });
        }

        // Basic tx hash format check
        const cleanHash = txHash.trim();
        if (cleanHash.length < 40) {
            return NextResponse.json({ success: false, message: "Invalid transaction hash format" }, { status: 400 });
        }

        const deposit = await UsdtDeposit.findOne({ depositId });
        if (!deposit) {
            return NextResponse.json({ success: false, message: "Deposit not found" }, { status: 404 });
        }

        const now = new Date();
        const expiresAt = new Date(deposit.expiresAt);

        if (deposit.status === "waiting" && now > expiresAt) {
            deposit.status = "expired";
            await deposit.save();
        }

        if (deposit.status === "confirmed") {
            return NextResponse.json({ success: true, message: "Deposit already confirmed" });
        }

        if (deposit.status === "failed" || deposit.status === "expired") {
            return NextResponse.json({ success: false, message: `Deposit is ${deposit.status}. Please create a new deposit.` });
        }

        // Check for duplicate txHash
        const existing = await UsdtDeposit.findOne({ txHash: cleanHash, _id: { $ne: deposit._id } });
        if (existing) {
            return NextResponse.json({ success: false, message: "This transaction hash has already been submitted" }, { status: 400 });
        }

        // Update deposit with tx hash
        deposit.txHash = cleanHash;
        deposit.status = "submitted";
        await deposit.save();

        return NextResponse.json({
            success: true,
            message: "Transaction hash submitted. Your deposit will be verified and credited within 10-30 minutes.",
            depositId: deposit.depositId,
            status: "submitted",
        });

    } catch (err) {
        console.error("USDT submit-hash error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
