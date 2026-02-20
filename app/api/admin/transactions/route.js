import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    /* ================= AUTH ================= */
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Owner only
    if (decoded.userType !== "owner") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ================= STATS ================= */
    const now = new Date();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    /* ================= BASE FILTER ================= */
    let filter = {
      paymentStatus: { $in: ["success", "completed", "paid"] },
    };

    /* ================= QUERY ================= */
    const [totalTx, count1d, count7d, count30d] = await Promise.all([
      Order.countDocuments(filter),
      Order.countDocuments({ ...filter, createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ ...filter, createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ ...filter, createdAt: { $gte: startOfMonth } }),
    ]);

    return Response.json({
      success: true,
      total: totalTx,
      stats: {
        count1d,
        count7d,
        count30d,
      }
    });
  } catch (err) {
    console.error("Transaction API Error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
