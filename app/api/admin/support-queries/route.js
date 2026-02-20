import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";
import jwt from "jsonwebtoken";

/* ================= AUTH (ADMIN ONLY) ================= */
function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.userType !== "admin" && decoded.userType !== "owner") {
    throw { status: 403, message: "Forbidden" };
  }

  return decoded;
}

/* ================= GET ALL QUERIES ================= */
export async function GET(req) {
  try {
    await connectDB();
    verifyAdmin(req);

    /* ================= STATS ================= */
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

    const [totalQueries, openCount, todayCount] = await Promise.all([
      SupportQuery.countDocuments({}),
      SupportQuery.countDocuments({ status: { $in: ["open", "in_progress"] } }),
      SupportQuery.countDocuments({ createdAt: { $gte: startOfDay } }),
    ]);

    return Response.json({
      success: true,
      stats: {
        total: totalQueries,
        open: openCount,
        today: todayCount,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
