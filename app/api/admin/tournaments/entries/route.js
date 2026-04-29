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
