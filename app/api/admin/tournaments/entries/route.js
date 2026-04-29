import { connectDB } from "@/lib/mongodb";
import TournamentEntry from "@/models/TournamentEntry";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const requireOwner = (req) => {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer "))
    return { error: "Unauthorized", status: 401 };
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.userType !== "owner") return { error: "Forbidden", status: 403 };
    return { decoded };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

export async function GET(req) {
  try {
    await connectDB();
    const auth = requireOwner(req);
    if (auth.error)
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json({ success: false, message: "Missing tournamentId" }, { status: 400 });
    }

    const entries = await TournamentEntry.find({ tournamentId })
      .populate("userId", "name email phone userId")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: entries });
  } catch (err) {
    console.error("Admin entries fetch error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── PATCH /api/admin/tournaments/entries — Update an entry ── */
export async function PATCH(req) {
  try {
    await connectDB();
    const auth = requireOwner(req);
    if (auth.error)
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });

    const body = await req.json();
    const { entryId, action, roomId, roomPassword } = body; // action: "promote", "eliminate", "reset", "updateRoom", "winner"

    if (!entryId) {
      return NextResponse.json({ success: false, message: "Missing entryId" }, { status: 400 });
    }

    const entry = await TournamentEntry.findById(entryId);
    if (!entry) {
      return NextResponse.json({ success: false, message: "Entry not found" }, { status: 404 });
    }

    if (action === "promote") {
      entry.currentRound += 1;
      entry.isEliminated = false;
    } else if (action === "demote") {
      if (entry.currentRound > 1) entry.currentRound -= 1;
      entry.isEliminated = false;
    } else if (action === "eliminate") {
      entry.isEliminated = true;
      entry.isWinner = false;
    } else if (action === "reset") {
      entry.currentRound = 1;
      entry.isEliminated = false;
      entry.isWinner = false;
      entry.assignedRoomId = "";
      entry.assignedRoomPassword = "";
    } else if (action === "updateRoom") {
      entry.assignedRoomId = roomId || "";
      entry.assignedRoomPassword = roomPassword || "";
    } else if (action === "winner") {
      entry.isWinner = !entry.isWinner;
      if (entry.isWinner) entry.isEliminated = false;
    } else {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    await entry.save();
    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error("Admin entry update error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
