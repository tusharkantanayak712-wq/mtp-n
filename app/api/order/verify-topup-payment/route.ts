import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    /* =====================================================
       AUTH (JWT)
    ===================================================== */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET!
      );
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const tokenUserId = decoded.userId;

    /* =====================================================
       REQUEST BODY
    ===================================================== */
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: "Missing orderId",
      });
    }

    /* =====================================================
       FETCH ORDER
    ===================================================== */
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    /* =====================================================
       🔒 OWNERSHIP CHECK (CRITICAL)
    ===================================================== */
    if (order.userId && order.userId !== tokenUserId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Already completed → safe exit
    if (order.status === "success") {
      return NextResponse.json({
        success: true,
        message: "Already processed",
        topupResponse: order.externalResponse,
      });
    }

    /* =====================================================
       EXPIRE CHECK
    ===================================================== */
    if (order.expiresAt && Date.now() > order.expiresAt.getTime()) {
      order.status = "failed";
      order.paymentStatus = "failed";
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Order expired",
      });
    }

    /* =====================================================
       CHECK GATEWAY STATUS
    ===================================================== */
    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch(
      "https://xyzpay.site/api/check-order-status",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      }
    );

    const data = await resp.json();
    const txnStatus = data?.result?.txnStatus;

    /* =====================================================
       PAYMENT STATES
    ===================================================== */

    // ⏳ Pending
    if (txnStatus === "PENDING") {
      return NextResponse.json({
        success: false,
        message: "Payment pending, please wait",
      });
    }

    // ❌ Failed
    if (txnStatus !== "SUCCESS" && txnStatus !== "COMPLETED") {
      order.status = "failed";
      order.paymentStatus = "failed";
      order.gatewayResponse = data;
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Payment failed",
      });
    }

    /* =====================================================
       STRICT PRICE CHECK
    ===================================================== */
    const paidAmount = Number(
      data?.result?.amount ||
      data?.result?.txnAmount ||
      data?.result?.orderAmount
    );

    if (!paidAmount || paidAmount !== Number(order.price)) {
      order.status = "fraud";
      order.paymentStatus = "failed";
      order.topupStatus = "failed";
      order.gatewayResponse = data;
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Payment amount mismatch detected",
      });
    }

    /* =====================================================
       PAYMENT CONFIRMED
    ===================================================== */
    order.paymentStatus = "success";
    order.gatewayResponse = data;
    await order.save();

    /* =====================================================
       TOPUP (IDEMPOTENT & CONCURRENCY GUARD)
    ===================================================== */
    /* =====================================================
       TOPUP (IDEMPOTENT & CONCURRENCY GUARD)
    ===================================================== */
    if (order.topupStatus === "success") {
      return NextResponse.json({
        success: true,
        message: "Topup already completed",
        topupResponse: order.externalResponse,
      });
    }

    if (order.topupStatus === "processing") {
      // Check if processing for more than 3 minutes (stale)
      const updatedAt = (order as any).updatedAt || new Date();
      const diffMinutes = (Date.now() - new Date(updatedAt).getTime()) / 60000;

      if (diffMinutes < 3) {
        return NextResponse.json({
          success: false,
          message: "Topup is already in progress. Please wait.",
        });
      }

      console.log(`Retrying stale processing order: ${orderId} (${Math.round(diffMinutes)} mins old)`);
    }

    // Mark as processing to prevent concurrent hits
    order.topupStatus = "processing";
    await order.save();

    // Determine multiplier and base slug for the external API
    let multiplier = 1;
    let baseItemSlug = order.itemSlug;

    // Detect generic combo pattern like [slug]-2x, [slug]-3x etc.
    const comboMatch = order.itemSlug.match(/(.+)-(\d+)x$/i);
    if (comboMatch) {
      baseItemSlug = comboMatch[1];
      multiplier = parseInt(comboMatch[2]);
    }

    // Normalize gameSlug to lowercase for the provider API
    const normalizedGameSlug = order.gameSlug.toLowerCase();

    console.log(`[TOPUP] Starting fulfillment for Order ${orderId}: ${multiplier}x ${baseItemSlug} (${normalizedGameSlug})`);

    const responses = [];
    let successCount = 0;

    for (let i = 0; i < multiplier; i++) {
      try {
        console.log(`[TOPUP] Attempt ${i + 1}/${multiplier} (Product: ${normalizedGameSlug}_${baseItemSlug})`);

        // Timeout protection (15 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const gameResp = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api-service/order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_SECRET_KEY!,
            },
            body: JSON.stringify({
              playerId: String(order.playerId),
              zoneId: String(order.zoneId),
              productId: `${normalizedGameSlug}_${baseItemSlug}`,
              currency: "USD",
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        const gameData = await gameResp.json();
        responses.push(gameData);

        const isSuccess =
          gameResp.ok &&
          (gameData?.success === true ||
            gameData?.status === true ||
            gameData?.result?.status === "SUCCESS");

        if (isSuccess) {
          successCount++;
          console.log(`[TOPUP] Attempt ${i + 1} SUCCESS`);
        } else {
          console.error(`[TOPUP] Attempt ${i + 1} FAILED:`, JSON.stringify(gameData));
        }
      } catch (err: any) {
        console.error(`[TOPUP] Attempt ${i + 1} CRASHED:`, err.message);
        responses.push({ error: "System Error", message: err.message });
      }
    }

    order.externalResponse = responses;

    if (successCount === multiplier) {
      order.status = "success";
      order.topupStatus = "success";
    } else if (successCount > 0) {
      // Partial success
      order.status = "success";
      order.topupStatus = "success";
      order.itemName = `${order.itemName} (Partial: ${successCount}/${multiplier})`;
    } else {
      order.status = "failed";
      order.topupStatus = "failed";
    }

    await order.save();
    console.log(`[TOPUP] Order ${orderId} finalized with status: ${order.status} (${successCount}/${multiplier} success)`);

    return NextResponse.json({
      success: order.status === "success",
      message:
        order.status === "success"
          ? `Topup successful (${successCount}/${multiplier})`
          : "Topup fulfillment failed. System will retry automatically or contact support.",
      topupResponse: responses,
    });
  } catch (error: any) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
