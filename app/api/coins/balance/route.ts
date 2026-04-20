import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CoinTransaction from "@/models/CoinTransaction";

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

    const userId = decoded.userId; // This is actually _id (MongoDB ObjectId) from the JWT
    const user = await User.findOne({ _id: userId }).select("coins lastCheckin checkinStreak userId");
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const url = new URL(req.url);
    const historyPage = parseInt(url.searchParams.get("historyPage") || "1");
    const historyLimit = parseInt(url.searchParams.get("historyLimit") || "10");
    const historySkip = (historyPage - 1) * historyLimit;

    // Get coin transactions — CoinTransaction stores the custom userId string
    const [history, historyTotal, lastAdTx] = await Promise.all([
      CoinTransaction.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .skip(historySkip)
        .limit(historyLimit)
        .select("type coins source description referenceId createdAt"),
      CoinTransaction.countDocuments({ userId: user.userId }),
      CoinTransaction.findOne({ userId: user.userId, source: "ad_reward" })
        .sort({ createdAt: -1 })
        .select("createdAt"),
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

      // Reset streak display if they missed yesterday
      if (!checkedInToday && lastISTStr !== yesterdayIST) {
        effectiveStreak = 0;
      }
    } else {
      effectiveStreak = 0;
    }

    // Next reward = for the next potential check-in day
    const nextDay = checkedInToday
      ? (effectiveStreak >= 7 ? 1 : effectiveStreak + 1)
      : 1; // If not checked in today, their NEXT check-in will be Day 1 (if they missed) or Day X+1
    
    // BUT we want to show what they will get IF they check in right now
    const potentialNextDay = checkedInToday 
      ? (effectiveStreak >= 7 ? 1 : effectiveStreak + 1) // next day's reward
      : (effectiveStreak === 0 ? 1 : effectiveStreak + 1); // today's reward if they click now

    const nextReward = STREAK_REWARDS[Math.min(potentialNextDay - 1, 6)];

    return NextResponse.json({
      success: true,
      coins: user.coins || 0,
      checkedInToday,
      lastCheckin: user.lastCheckin,
      streak: effectiveStreak,
      nextReward,
      rewards: STREAK_REWARDS,
      lastAdReward: lastAdTx ? lastAdTx.createdAt : null,
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
