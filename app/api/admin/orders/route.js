import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

/* =========================
   AUTH HELPER
========================= */
function verifyOwner(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.userType !== "owner") {
    throw { status: 403, message: "Forbidden" };
  }

  return decoded;
}

/* =========================
   GET ALL ORDERS (OWNER)
   + Pagination + Search + Filters
========================= */
export async function GET(req) {
  try {
    await connectDB();
    verifyOwner(req);

    /* ================= STATS (ORDERS) ================= */
    const now = new Date();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    /* ================= QUERY ================= */
    const [rev1dAgg, rev1wAgg, rev1mAgg, todayOrders, totalOrders] = await Promise.all([
      // Revenue Aggregations
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay }, status: "success" } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek }, status: "success" } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: "success" } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({})
    ]);

    const revenue = {
      day: rev1dAgg[0]?.total || 0,
      week: rev1wAgg[0]?.total || 0,
      month: rev1mAgg[0]?.total || 0,
    };

    return Response.json({
      success: true,
      total: totalOrders,
      orderStats: {
        revenue,
        todayCount: todayOrders,
      }
    });

  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}

/* =========================
   UPDATE ORDER STATUS
   (UNCHANGED)
========================= */
export async function PATCH(req) {
  try {
    await connectDB();
    verifyOwner(req);

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return Response.json(
        { success: false, message: "orderId and status required" },
        { status: 400 }
      );
    }

    const allowedStatus = ["pending", "success", "failed", "processing", "cancelled", "refund", "Refund", "REFUND"];
    if (!allowedStatus.includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const update = {
      status,
      updatedAt: new Date(),
    };

    if (status === "success") {
      update.paymentStatus = "success";
      update.topupStatus = "success";
    }

    if (status === "failed") {
      update.topupStatus = "failed";
    }

    if (status === "processing") {
      update.topupStatus = "processing";
    }

    if (status === "refund" || status === "REFUND" || status === "Refund") {
      update.topupStatus = "refund";
      update.paymentStatus = "refund";
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      update,
      { new: true }
    );

    if (!order) {
      return Response.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Order status updated",
      data: order,
    });

  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
