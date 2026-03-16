import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ success: false, message: "Transaction ID required" }, { status: 400 });
        }

        await connectDB();

        /* ============ AUTH CHECK (ADMIN ONLY) ============ */
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
        }

        if (decoded.userType !== "owner") {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        /* ============ FETCH TRANSACTION ============ */
        const transaction = await WalletTransaction.findById(transactionId);
        if (!transaction) {
            return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === "success") {
            return NextResponse.json({ success: true, message: "Transaction is already successful" });
        }

        /* ============ GATEWAY VERIFICATION ============ */
        const orderId = transaction.referenceId; // The Order ID sent to gateway
        if (!orderId) {
            return NextResponse.json({ success: false, message: "No Reference Order ID found" }, { status: 400 });
        }

        const formData = new URLSearchParams();
        formData.append("user_token", process.env.XTRA_USER_TOKEN!);
        formData.append("order_id", orderId);

        console.log(`Verifying Order ${orderId} with Gateway...`);

        const resp = await fetch("https://chuimei-pe.in/api/check-order-status", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });

        const data = await resp.json();
        console.log("Gateway Response:", data);

        const gatewayStatus = data?.result?.txnStatus;
        const isSuccess =
            data?.status === true ||
            gatewayStatus === "COMPLETED" ||
            gatewayStatus === "SUCCESS";

        if (!isSuccess) {
            return NextResponse.json({
                success: false,
                message: `Gateway status is ${gatewayStatus || 'PENDING/FAILED'}. Cannot auto-approve.`
            });
        }

        /* ============ AMOUNT CHECK ============ */
        const verifiedAmount = Number(data?.result?.amount || 0);
        if (verifiedAmount <= 0) {
            return NextResponse.json({ success: false, message: "Invalid amount received from gateway" }, { status: 400 });
        }

        // Optional: Warn if amount mismatch
        if (verifiedAmount !== transaction.amount) {
            console.warn(`Amount mismatch for ${orderId}. DB: ${transaction.amount}, Gateway: ${verifiedAmount}`);
        }

        /* ============ AUTO APPROVE & CREDIT ============ */
        // 1. Transaction Update
        const updatedTxn = await WalletTransaction.findOneAndUpdate(
            { _id: transaction._id, status: { $ne: "success" } },
            {
                $set: {
                    status: "success",
                    amount: verifiedAmount, // Enforce verified amount
                    description: "Wallet Top-up Verified by Admin",
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedTxn) {
            return NextResponse.json({ success: true, message: "Already processed" });
        }

        // 2. User Credit
        const user = await User.findOneAndUpdate(
            { _id: transaction.userObjectId },
            {
                $inc: { wallet: verifiedAmount }
            },
            { new: true }
        );

        if (user) {
            updatedTxn.balanceAfter = user.wallet;
            await updatedTxn.save();
        }

        return NextResponse.json({
            success: true,
            message: `Successfully verified & credited ₹${verifiedAmount}`,
            data: updatedTxn
        });

    } catch (err) {
        console.error("Verify Error:", err);
        return NextResponse.json(
            { success: false, message: "Server error during verification" },
            { status: 500 }
        );
    }
}
