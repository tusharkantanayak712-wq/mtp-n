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
    // Look for existing transaction by referenceId (orderId)
    let existingTxn = await WalletTransaction.findOne({ referenceId: orderId });

    if (existingTxn && existingTxn.status === "success") {
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

    // 💳 Analyze Gateway Status
    const gatewayStatus = data?.result?.txnStatus;

    // Success conditions (adjust based on actual gateway response)
    // Some gateways return 'SUCCESS', 'COMPLETED', or boolean status true
    const isSuccess =
      data?.status === true ||
      gatewayStatus === "COMPLETED" ||
      gatewayStatus === "SUCCESS";

    // Failure conditions
    // Be careful not to mark 'PENDING' as failed
    const isFailed =
      gatewayStatus === "FAILED" ||
      gatewayStatus === "FAILURE" ||
      gatewayStatus === "TXN_FAILURE";

    const amount = Number(data?.result?.amount || 0);

    /* ============ HANDLE SUCCESS ============ */
    if (isSuccess) {
      if (!amount) {
        return NextResponse.json({
          success: false,
          message: "Invalid amount received from gateway",
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
      user.order = (user.order || 0) + 1; // Increment order count log
      await user.save();

      // 📝 Update or Create Transaction Log
      if (existingTxn) {
        // Update existing pending/failed transaction to success
        existingTxn.status = "success";
        existingTxn.amount = amount; // Ensure amount matches actual payment
        existingTxn.balanceAfter = balanceAfter;
        existingTxn.description = "Wallet Top-up Successful";
        // Update transactionId to indicate success (optional, but good for clarity)
        // existingTxn.transactionId = `TOPUP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`; 
        // Better to keep original ID or update? Let's update to match consistent format for successful topups
        existingTxn.transactionId = `TOPUP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        await existingTxn.save();
      } else {
        // Should theoretically exist if created via create-order app flow
        // But handle case where it doesn't (legacy or direct API call)
        await WalletTransaction.create({
          transactionId: `TOPUP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          userId: user.userId,
          userObjectId: user._id,
          type: "credit",
          amount: amount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          description: "Wallet Top-up Successful",
          status: "success",
          referenceId: orderId,
          performedBy: "user",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Payment Successful",
        amount,
        newWallet: user.wallet,
      });
    }

    /* ============ HANDLE FAILURE ============ */
    if (isFailed) {
      if (existingTxn) {
        existingTxn.status = "failed";
        existingTxn.description = `Top-up Failed: ${data?.message || gatewayStatus || "Unknown Error"}`;
        await existingTxn.save();
      } else {
        // Create failure record if not exists
        let user = await User.findById(tokenUserId);
        if (!user) user = await User.findOne({ userId: tokenUserId });

        if (user) {
          await WalletTransaction.create({
            transactionId: `FAIL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: user.userId,
            userObjectId: user._id,
            type: "credit", // Intended type
            amount: amount,
            balanceBefore: user.wallet || 0,
            balanceAfter: user.wallet || 0,
            description: `Top-up Failed: ${data?.message || gatewayStatus || "Unknown Error"}`,
            status: "failed",
            referenceId: orderId,
            performedBy: "user",
          });
        }
      }

      return NextResponse.json({
        success: false,
        message: "Payment Failed",
      });
    }

    /* ============ HANDLE PENDING (Default) ============ */
    // If not success and not explicitly failed, it's pending.
    // We don't need to change DB state (it's already pending).

    return NextResponse.json({
      success: false,
      message: "Payment Pending",
    });

  } catch (error) {
    console.error("Check-status error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
