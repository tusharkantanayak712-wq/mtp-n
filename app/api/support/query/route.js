import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));

    if (!email) {
      return Response.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const [queries, total] = await Promise.all([
      SupportQuery.find({ email })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("type message status orderId adminReply createdAt")
        .lean(),
      SupportQuery.countDocuments({ email }),
    ]);

    return Response.json({
      success: true,
      queries,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { email, phoneNo, orderId, type, message } = body;

    if (!type || !message || !phoneNo) {
      return Response.json(
        { success: false, message: "Phone number, query type and message are required" },
        { status: 400 }
      );
    }

    const newQuery = await SupportQuery.create({
      email: email || null,
      phone: phoneNo.trim(),
      phoneNo: phoneNo.trim(),
      orderId: orderId ? orderId.trim() : null,
      type,
      message,
    });

    return Response.json(
      { success: true, message: "Query submitted", id: newQuery._id },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
