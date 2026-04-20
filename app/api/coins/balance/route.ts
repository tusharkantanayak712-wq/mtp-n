import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CoinTransaction from "@/models/CoinTransaction";
import { ADS_CONFIG } from "@/lib/adsConfig";

const STREAK_REWARDS = [2, 3, 5, 7, 10, 15, 25];

export async function GET(req: Request) {
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

    const userId = decoded.userId;
    const user = await User.findOne({ _id: userId }).select("coins lastCheckin checkinStreak userId");
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const url = new URL(req.url);
    const historyPage = parseInt(url.searchParams.get("historyPage") || "1");
    const historyLimit = parseInt(url.searchParams.get("historyLimit") || "5");
    const historySkip = (historyPage - 1) * historyLimit;

    // Get coin transactions & Ad rewards
    const [history, historyTotal, adRewards] = await Promise.all([
      CoinTransaction.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .skip(historySkip)
        .limit(historyLimit)
        .select("type coins source description referenceId createdAt"),
      CoinTransaction.countDocuments({ userId: user.userId }),
      // Fetch latest reward for each configured channel
      Promise.all(ADS_CONFIG.WATCH_EARN_CHANNELS.map(async (ch) => {
        const last = await CoinTransaction.findOne({ 
          userId: user.userId, 
          source: "ad_reward", 
          referenceId: ch.id 
        }).sort({ createdAt: -1 }).select("createdAt");
        return { id: ch.id, lastTime: last ? last.createdAt : null };
      }))
    ]);

    // IST-aware check-in status
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const todayIST = nowIST.toISOString().slice(0, 10);
    const yest = new Date(nowIST);
    yest.setDate(yest.getDate() - 1);
    const yesterdayIST = yest.toISOString().slice(0, 10);

    let checkedInToday = false;
    let effectiveStreak = user.checkinStreak || 0;

    if (user.lastCheckin) {
      const lastIST = new Date(user.lastCheckin.getTime() + 5.5 * 60 * 60 * 1000);
      const lastISTStr = lastIST.toISOString().slice(0, 10);
      checkedInToday = lastISTStr === todayIST;

      if (!checkedInToday && lastISTStr !== yesterdayIST) {
        effectiveStreak = 0;
      }
    } else {
      effectiveStreak = 0;
    }

    const potentialNextDay = checkedInToday 
      ? (effectiveStreak >= 7 ? 1 : effectiveStreak + 1)
      : (effectiveStreak === 0 ? 1 : effectiveStreak + 1);

    const nextReward = STREAK_REWARDS[Math.min(potentialNextDay - 1, 6)];

    return NextResponse.json({
      success: true,
      coins: user.coins || 0,
      checkedInToday,
      lastCheckin: user.lastCheckin,
      streak: effectiveStreak,
      nextReward,
      rewards: STREAK_REWARDS,
      adRewards, // Array of { id, lastTime }
      history,
      historyTotal,
      historyPage,
      historyPages: Math.ceil(historyTotal / historyLimit),
    });
  } catch (error) {
    console.error("[coins/balance] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
