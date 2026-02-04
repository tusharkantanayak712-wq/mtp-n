import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
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
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ success: false, message: "Missing orderId" });

    const order = await Order.findOne({ orderId });
    if (!order) return NextResponse.json({ success: false, message: "Order not found" });

    if (order.userId && order.userId !== decoded.userId) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (order.status === "success" || order.status === "SUCCESS") {
      return NextResponse.json({ success: true, message: "Already processed", topupResponse: order.externalResponse });
    }

    if (order.expiresAt && Date.now() > order.expiresAt.getTime()) {
      order.status = "failed";
      await order.save();
      return NextResponse.json({ success: false, message: "Order expired" });
    }

    // Check Payment Gateway Status
    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch("https://xyzpay.site/api/check-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();
    const txnStatus = data?.result?.txnStatus;

    if (txnStatus === "PENDING") {
      return NextResponse.json({
        success: false,
        message: "Payment pending",
        paymentStatus: "pending",
        topupStatus: "pending"
      });
    }

    if (txnStatus !== "SUCCESS" && txnStatus !== "COMPLETED") {
      order.status = "failed";
      order.paymentStatus = "failed";
      order.gatewayResponse = data;
      await order.save();
      return NextResponse.json({
        success: false,
        message: "Payment failed",
        paymentStatus: "failed",
        topupStatus: "pending"
      });
    }

    // Price Check
    const paidAmount = Number(data?.result?.amount || data?.result?.txnAmount || data?.result?.orderAmount);
    if (!paidAmount || paidAmount !== Number(order.price)) {
      order.status = "fraud";
      order.paymentStatus = "failed";
      await order.save();
      return NextResponse.json({
        success: false,
        message: "Amount mismatch detected",
        paymentStatus: "failed",
        topupStatus: "pending"
      });
    }

    // Final Confirmation
    order.paymentStatus = "success";
    order.gatewayResponse = data;
    await order.save();

    // Topup Logic
    if (order.topupStatus === "success" || order.topupStatus === "processing") {
      return NextResponse.json({
        success: true,
        message: order.topupStatus === "processing" ? "Order is being processed" : "Topup already completed",
        paymentStatus: order.paymentStatus,
        topupStatus: order.topupStatus
      });
    }

    order.topupStatus = "processing";
    await order.save();

    let multiplier = 1;
    let baseItemSlug = order.itemSlug;

    const comboMatch = order.itemSlug.match(/(.+)-(\d+)x$/i);
    if (comboMatch) {
      baseItemSlug = comboMatch[1];
      multiplier = parseInt(comboMatch[2]);
    }

    const responses = [];
    let successCount = 0;

    for (let i = 0; i < multiplier; i++) {
      try {
        console.log(`[fulfillment] Attempt ${i + 1}/${multiplier} | Order: ${orderId} | ID: ${order.gameSlug}_${baseItemSlug}`);

        const gameResp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api-service/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_SECRET_KEY!,
          },
          body: JSON.stringify({
            playerId: String(order.playerId),
            zoneId: String(order.zoneId),
            productId: `${order.gameSlug}_${baseItemSlug}`,
            currency: "USD",
          }),
        });

        const gameData = await gameResp.json();
        console.log(`[fulfillment] Response ${i + 1}/${multiplier}:`, JSON.stringify(gameData));
        responses.push(gameData);

        const isSuccess = gameResp.ok &&
          (gameData?.success === true || gameData?.status === true || gameData?.result?.status === "SUCCESS");

        if (isSuccess) {
          successCount++;
        }
      } catch (err: any) {
        console.error(`[fulfillment] Crash ${i + 1}/${multiplier}:`, err.message);
        responses.push({ error: true, message: err.message });
      }
    }

    order.externalResponse = responses;
    if (successCount === multiplier) {
      order.status = "success";
      order.topupStatus = "success";
    } else if (successCount > 0) {
      order.status = "success";
      order.topupStatus = "success";
      order.itemName = `${order.itemName} (${successCount}/${multiplier} delivered)`;
    } else {
      order.status = "failed";
      order.topupStatus = "failed";
    }

    await order.save();

    return NextResponse.json({
      success: order.status === "success",
      message: order.status === "success" ? "Topup successful" : "Topup failed",
      paymentStatus: order.paymentStatus,
      topupStatus: order.topupStatus,
      topupResponse: responses,
    });
  } catch (error: any) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
