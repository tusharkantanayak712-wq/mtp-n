import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import CoinTask from "@/models/CoinTask";

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

    const userId = decoded.userId; // MongoDB _id stored in JWT

    // We need the user's custom string userId to check completedBy array
    const user = await import("@/models/User").then(m => m.default.findOne({ _id: userId }).select("userId"));
    const userStringId = user?.userId || String(userId);

    const now = new Date();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const query = {
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    };

    const [tasks, total] = await Promise.all([
      CoinTask.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("taskId title description type url reward waitSeconds sponsorName priority maxCompletions completedBy expiresAt verificationCode"),
      CoinTask.countDocuments(query),
    ]);

    // IMPORTANT: never expose the actual verificationCode to the client
    // Only tell the user whether a code is required (hasCode: true/false)
    const enriched = tasks.map((task: any) => ({
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      type: task.type,
      url: task.url,
      reward: task.reward,
      waitSeconds: task.waitSeconds,
      sponsorName: task.sponsorName,
      priority: task.priority,
      expiresAt: task.expiresAt,
      completed: task.completedBy.includes(userStringId),
      maxReached: task.maxCompletions !== null && task.completedBy.length >= task.maxCompletions,
      // Tell user IF a code is required, but NOT what the code is
      hasCode: !!task.verificationCode,
    }));

    return NextResponse.json({ 
      success: true, 
      tasks: enriched,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[coins/tasks] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
