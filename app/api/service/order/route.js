import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import ApiKey from "@/models/ApiKey";
import { validateApiKey } from "@/lib/apiKeyAuth";
import { calculateItemPrice } from "@/lib/pricingUtils";

export async function POST(req) {
    try {
        const auth = await validateApiKey(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const body = await req.json();
        const { gameSlug, itemSlug, playerId, zoneId } = body;

        if (!gameSlug || !itemSlug || !playerId) {
            return NextResponse.json({ success: false, message: "Missing required fields (gameSlug, itemSlug, playerId)" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findById(auth.user.id);

        const priceData = await calculateItemPrice(gameSlug, itemSlug, user.userType);
        if (!priceData) {
            return NextResponse.json({ success: false, message: "Invalid game or item slug" }, { status: 404 });
        }

        const { price, itemName } = priceData;

        // ⚡ ATOMIC WALLET DEDUCTION
        // Only deducts if wallet >= price at the exact moment of the DB write.
        // Prevents negative balances even with 100 concurrent requests.
        const updatedUser = await User.findOneAndUpdate(
            { _id: auth.user.id, wallet: { $gte: price } },
            { $inc: { wallet: -price } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: `Insufficient wallet balance. Required: ₹${price}`
            }, { status: 403 });
        }

        // ⚡ ATOMIC DAILY LIMIT INCREMENT
        // Only increments if usedToday + price <= dailyLimit at the exact moment of write.
        // Prevents daily limit overshoot even under concurrent load.
        const updatedKey = await ApiKey.findOneAndUpdate(
            {
                _id: auth.key.id,
                $expr: { $lte: [{ $add: ["$usedToday", price] }, "$dailyLimit"] }
            },
            { $inc: { usedToday: price } },
            { new: true }
        );

        if (!updatedKey) {
            // Daily limit was hit concurrently — refund the wallet deduction
            await User.findByIdAndUpdate(auth.user.id, { $inc: { wallet: price } });
            return NextResponse.json({
                success: false,
                message: `Daily API spend limit reached. Order cancelled and wallet refunded.`
            }, { status: 403 });
        }

        const orderId = `API-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const newOrder = await Order.create({
            orderId,
            userId: updatedUser.userId,
            gameSlug,
            itemSlug,
            itemName,
            playerId,
            zoneId: zoneId || "",
            price,
            email: updatedUser.email,
            phone: updatedUser.phone || "",
            status: "pending",
            paymentStatus: "success",
            topupStatus: "pending",
            paymentMethod: "API_WALLET"
        });

        /* ========================================
           AUTO-EXECUTION (FULFILLMENT)
           Immediately trigger top-up after payment
        ======================================== */
        try {
            console.log(`[Service API] Auto-executing Order: ${orderId}`);

            // 1. Mark as processing
            newOrder.topupStatus = "processing";
            await newOrder.save();

            // 2. Call external fulfillment service
            const gameResp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api-service/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.API_SECRET_KEY,
                },
                body: JSON.stringify({
                    playerId: String(playerId),
                    zoneId: String(zoneId || ""),
                    productId: `${gameSlug}_${itemSlug}`,
                    currency: "USD",
                }),
            });

            const gameData = await gameResp.json();

            // 3. Update Order based on response
            const isSuccess = gameResp.ok &&
                (gameData?.success === true || gameData?.status === true || gameData?.result?.status === "SUCCESS");

            if (isSuccess) {
                newOrder.status = "success";
                newOrder.topupStatus = "success";
            } else {
                newOrder.status = "failed"; // Note: Wallet deduction remains, admin handles refund if needed
                newOrder.topupStatus = "failed";
            }

            newOrder.externalResponse = [gameData];
            await newOrder.save();

            return NextResponse.json({
                success: isSuccess,
                message: isSuccess ? "Order fulfilled successfully" : "Payment deducted, but fulfillment failed",
                order: {
                    orderId: newOrder.orderId,
                    itemName,
                    price,
                    status: newOrder.status,
                    topupStatus: newOrder.topupStatus,
                    deliveryResponse: gameData
                }
            });

        } catch (fulfillError) {
            console.error("Auto-Fulfillment Error:", fulfillError);
            // Even if fulfillment fails, the order record exists and wallet is deducted
            // Admin will see it as "pending/processing" or we mark as failed for manual review
            return NextResponse.json({
                success: true,
                message: "Order placed, but auto-execution encountered an error. Admin will process manually.",
                order: {
                    orderId: newOrder.orderId,
                    itemName,
                    price,
                    status: "pending",
                    topupStatus: "pending"
                }
            });
        }

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
