import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CoinTransaction from "@/models/CoinTransaction";
import { ADS_CONFIG } from "@/lib/adsConfig";

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

    const { adId } = await req.json().catch(() => ({ adId: "watch_1" }));
    if (!adId) return NextResponse.json({ success: false, message: "Ad ID required" }, { status: 400 });

    const userId = decoded.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Check cooldown specifically for this adId
    const lastAdReward = await CoinTransaction.findOne({
      userObjectId: user._id,
      source: "ad_reward",
      referenceId: adId
    }).sort({ createdAt: -1 });

    if (lastAdReward) {
      const timeSinceLast = Date.now() - new Date(lastAdReward.createdAt).getTime();
      if (timeSinceLast < ADS_CONFIG.COOLDOWN_MS) {
        const remainingMinutes = Math.ceil((ADS_CONFIG.COOLDOWN_MS - timeSinceLast) / 60000);
        return NextResponse.json({ 
          success: false, 
          message: `Please wait ${remainingMinutes}m before claiming again.` 
        }, { status: 429 });
      }
    }

    const balanceBefore = user.coins || 0;
    const balanceAfter = balanceBefore + ADS_CONFIG.REWARD_COINS;

    // Award coins
    await User.updateOne(
      { _id: userId },
      { $inc: { coins: ADS_CONFIG.REWARD_COINS } }
    );

    // Log transaction
    const transactionId = `AD${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    await CoinTransaction.create({
      transactionId,
      userId: user.userId,
      userObjectId: user._id,
      type: "earn",
      coins: ADS_CONFIG.REWARD_COINS,
      balanceBefore,
      balanceAfter,
      source: "ad_reward",
      referenceId: adId,
      description: `Adsterra Reward (${adId === "watch_1" ? "Channel 1" : adId === "watch_2" ? "Channel 2" : "Channel 3"})`,
      performedBy: "system",
    });

    return NextResponse.json({
      success: true,
      message: `Success! +${ADS_CONFIG.REWARD_COINS} BBC added.`,
      newBalance: balanceAfter
    });

  } catch (error) {
    console.error("[api/coins/ad-reward] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
