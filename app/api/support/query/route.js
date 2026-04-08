import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";

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
