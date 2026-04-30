import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/* ── Auth helper ── */
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

/* ── GET /api/tournaments — public, filter by ?game=mlbb ── */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const game = searchParams.get("game");

    const query = {};
    if (game) query.game = game;

    const tournaments = await Tournament.find(query).sort({ createdAt: -1 }).lean();

    // Fetch winners for all tournaments
    const TournamentEntry = (await import("@/models/TournamentEntry")).default;
    const User = (await import("@/models/User")).default;

    const dataWithWinners = await Promise.all(tournaments.map(async (t) => {
      const winnerEntry = await TournamentEntry.findOne({ tournamentId: t._id, isWinner: true })
        .populate({ path: "userId", select: "name", model: User })
        .lean();
      
      return {
        ...t,
        winner: winnerEntry ? (winnerEntry.teamName || winnerEntry.userId?.name || "Anonymous") : null
      };
    }));

    return NextResponse.json({ success: true, data: dataWithWinners });
  } catch (err) {
    console.error("GET /api/tournaments", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── POST /api/tournaments — admin creates a tournament ── */
export async function POST(req) {
  try {
    await connectDB();
    const auth = requireOwner(req);
    if (auth.error)
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });

    const body = await req.json();
    const { game, title, subtitle, format, prize, slots, entryCoins, status, endsAt } = body;

    if (!game || !title || !format || !slots)
      return NextResponse.json({ success: false, message: "game, title, format, slots are required" }, { status: 400 });

    const tournament = await Tournament.create({
      game,
      title,
      subtitle,
      format,
      prize: prize || "Weekly Pass",
      slots,
      slotsFilled: 0,
      entryCoins: entryCoins ?? 0,
      status: status || "upcoming",
      endsAt: endsAt || null,
    });

    return NextResponse.json({ success: true, data: tournament }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tournaments", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
