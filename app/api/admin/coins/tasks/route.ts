import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import CoinTask from "@/models/CoinTask";
import CoinTransaction from "@/models/CoinTransaction";

// ===== Auth Helper =====
async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const decoded: any = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
    // lookup by _id because decoded.userId contains the MongoDB ObjectId
    const user = await User.findOne({ _id: decoded.userId }).select("userType");
    if (!user || !["admin", "owner"].includes(user.userType)) return null;
    return decoded;
  } catch {
    return null;
  }
}

// ===== GET: List all tasks (admin view with completion count) =====
export async function GET(req: Request) {
  try {
    await connectDB();
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      CoinTask.find({})
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CoinTask.countDocuments({}),
    ]);

    const enriched = tasks.map((t: any) => ({
      ...t.toObject(),
      completionCount: t.completedBy.length,
    }));

    return NextResponse.json({ 
      success: true, 
      tasks: enriched,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[admin/coins/tasks GET]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ===== POST: Create a new task =====
export async function POST(req: Request) {
  try {
    await connectDB();
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, description, type, url, reward, waitSeconds, sponsorName, priority, maxCompletions, expiresAt } = body;

    if (!title || !type || !url || !reward) {
      return NextResponse.json({ success: false, message: "title, type, url, and reward are required" }, { status: 400 });
    }

    const taskId = `TASK${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const task = await CoinTask.create({
      taskId,
      title,
      description: description || "",
      type,
      url,
      reward: Number(reward),
      waitSeconds: Number(waitSeconds) || 10,
      sponsorName: sponsorName || null,
      priority: Number(priority) || 0,
      maxCompletions: maxCompletions ? Number(maxCompletions) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: true,
      completedBy: [],
      createdBy: admin.userId,
    });

    return NextResponse.json({ success: true, message: "Task created!", task });
  } catch (error) {
    console.error("[admin/coins/tasks POST]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ===== PATCH: Update/toggle a task =====
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { taskId, ...updates } = body;

    if (!taskId) return NextResponse.json({ success: false, message: "taskId required" }, { status: 400 });

    // Prevent overwriting completedBy accidentally
    delete updates.completedBy;
    delete updates.createdBy;
    delete updates.taskId;

    const task = await CoinTask.findOneAndUpdate(
      { taskId },
      { $set: updates },
      { new: true }
    );

    if (!task) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Task updated!", task });
  } catch (error) {
    console.error("[admin/coins/tasks PATCH]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ===== DELETE: Remove a task =====
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const { taskId } = await req.json();
    if (!taskId) return NextResponse.json({ success: false, message: "taskId required" }, { status: 400 });

    await CoinTask.findOneAndDelete({ taskId });

    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("[admin/coins/tasks DELETE]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
