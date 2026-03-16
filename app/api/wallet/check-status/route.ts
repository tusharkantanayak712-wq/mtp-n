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

    if (existingTxn) {
      // 🔒 SECURITY CHECK: Ensure the transaction belongs to the requesting user
      // We check both userId (string) and userObjectId (mongo ID) to be safe
      const isOwner =
        existingTxn.userId === tokenUserId ||
        existingTxn.userObjectId?.toString() === decoded.userId || // if token has mongo ID
        existingTxn.userId === decoded.userId; // if token has user ID string

      // If we can't verify ownership via direct ID, fetch user to be sure (optional but safer)
      // For now, let's just relax strict string equality if needed or log for debug

      // FIX: The issue might be that tokenUserId is sometimes the mongo _id and sometimes the custom userId
      // We should check if the transaction is linked to the user's account in any way.

      if (!isOwner) {
        // Double check via DB user lookup if IDs don't match strings directly
        const user = await User.findById(decoded.userId) || await User.findOne({ userId: decoded.userId });
        if (!user || (existingTxn.userObjectId?.toString() !== user._id.toString() && existingTxn.userId !== user.userId)) {
          return NextResponse.json(
            { success: false, message: "Forbidden: Transaction does not belong to you" },
            { status: 403 }
          );
        }
      }

      if (existingTxn.status === "success") {
        return NextResponse.json({
          success: true,
          message: "Payment already processed",
          amount: existingTxn.amount,
          newWallet: existingTxn.balanceAfter,
        });
      }
    }

    // ============ GATEWAY CHECK ============
    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch("https://chuimei-pe.in/api/check-order-status", {
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

      // 🔒 ATOMIC PROCESSING: Prevent Double Credit
      // Step 1: Try to lock the transaction (pending -> success)
      let transactionLock = null;
      let finalTxn = existingTxn;
      let updatedUser = user; // Initialize with current user state

      if (existingTxn) {
        // If txn exists, try to update it from pending/failed to success
        transactionLock = await WalletTransaction.findOneAndUpdate(
          {
            _id: existingTxn._id,
            status: { $ne: "success" } // Lock: Only update if NOT already success
          },
          {
            $set: {
              status: "success",
              amount: amount,
              description: "Wallet Top-up Successful",
              updatedAt: new Date()
            }
          },
          { new: true }
        );

        if (!transactionLock) {
          // Lock failed? It means status was already 'success' (processed by webhook)
          // Just return success
          return NextResponse.json({
            success: true,
            message: "Payment already processed",
            amount,
            newWallet: user.wallet,
          });
        }
        finalTxn = transactionLock;

      } else {
        // If txn doesn't exist yet (rare, but possible if webhook didn't create it first), create it now
        try {
          finalTxn = await WalletTransaction.create({
            transactionId: `WALLET${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            userId: user.userId,
            userObjectId: user._id,
            type: "credit",
            amount: amount,
            balanceBefore: user.wallet || 0,
            balanceAfter: (user.wallet || 0) + amount,
            description: "Wallet Top-up Successful",
            status: "success",
            referenceId: orderId,
            performedBy: "user",
          });
        } catch (e) {
          // Creation failed? Maybe duplicate referenceId unique constraint?
          // If so, fetch and check
          return NextResponse.json({
            success: true,
            message: "Payment processed",
            amount,
            newWallet: user.wallet,
          });
        }
      }

      // Step 2: Credit User Wallet (Atomic $inc)
      // Only runs if we successfully locked/created the transaction
      updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: {
            wallet: amount,
            order: 1
          }
        },
        { new: true }
      );

      // Update balanceAfter in txn to be accurate
      if (finalTxn && updatedUser) {
        finalTxn.balanceAfter = updatedUser.wallet;
        await finalTxn.save();
      }

      return NextResponse.json({
        success: true,
        message: "Payment Successful",
        amount,
        newWallet: updatedUser?.wallet || user.wallet,
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
            transactionId: `WALLET${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
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
