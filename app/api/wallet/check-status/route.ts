import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ============ AUTHENTICATION ============
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

    const { orderId } = await req.json();
    const tokenUserId = decoded.userId;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing orderId" },
        { status: 400 }
      );
    }

    // ============ CHECK IF ALREADY PROCESSED ============
    const existingTxn = await WalletTransaction.findOne({
      referenceId: orderId,
      status: "success"
    });

    if (existingTxn) {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        amount: existingTxn.amount,
        newWallet: existingTxn.balanceAfter,
      });
    }

    // ============ GATEWAY CHECK ============
    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch("https://xyzpay.site/api/check-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();
    console.log("Gateway Response:", data);

    // 💳 Gateway success logic
    const gatewaySuccess =
      data?.status == true ||
      data?.result?.txnStatus == "COMPLETED" ||
      data?.result?.txnStatus == "SUCCESS";

    if (!gatewaySuccess) {
      // Log failure if not already logged
      const existingFail = await WalletTransaction.findOne({
        referenceId: orderId,
        status: "failed"
      });

      if (!existingFail) {
        let user = await User.findById(tokenUserId);
        if (!user) user = await User.findOne({ userId: tokenUserId });

        if (user) {
          await WalletTransaction.create({
            transactionId: `FAIL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: user.userId,
            userObjectId: user._id,
            type: "credit", // It was intended to be a credit
            amount: Number(data?.result?.amount || 0),
            balanceBefore: user.wallet || 0,
            balanceAfter: user.wallet || 0,
            description: `Top-up Failed: ${data?.message || data?.result?.txnStatus || "Unknown Error"}`,
            status: "failed",
            referenceId: orderId,
            performedBy: "user",
          });
        }
      }

      return NextResponse.json({
        success: false,
        message: "Payment Pending or Failed",
      });
    }

    const amount = Number(data?.result?.amount || 0);

    if (!amount) {
      return NextResponse.json({
        success: false,
        message: "Invalid amount",
      });
    }

    // 💰 Update User Wallet
    let user = await User.findById(tokenUserId);
    if (!user) {
      user = await User.findOne({ userId: tokenUserId });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const balanceBefore = user.wallet || 0;
    const balanceAfter = balanceBefore + amount;

    user.wallet = balanceAfter;
    user.order = (user.order || 0) + 1;

    await user.save();

    // ============ LOG TRANSACTION ============
    await WalletTransaction.create({
      transactionId: `TOPUP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user.userId,
      userObjectId: user._id,
      type: "credit",
      amount: amount,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      description: "Wallet Top-up via UPI",
      status: "success",
      referenceId: orderId,
      performedBy: "user",
    });

    return NextResponse.json({
      success: true,
      message: "Payment Successful",
      amount,
      newWallet: user.wallet,
    });
  } catch (error) {
    console.error("Check-status error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
