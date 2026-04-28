import { connectDB } from "@/lib/mongodb";
import SupportQuery from "@/models/SupportQuery";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) throw { status: 401, message: "Unauthorized" };
  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.userType !== "admin" && decoded.userType !== "owner") {
    throw { status: 403, message: "Forbidden" };
  }
  return decoded;
}

export async function PATCH(req) {
  try {
    await connectDB();
    verifyAdmin(req);

    const { id, adminReply, status } = await req.json();

    if (!id || !adminReply?.trim()) {
      return Response.json(
        { success: false, message: "Query ID and reply are required" },
        { status: 400 }
      );
    }

    const update = { adminReply: adminReply.trim() };
    if (status) update.status = status;

    const updated = await SupportQuery.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      return Response.json({ success: false, message: "Query not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Reply saved", data: updated });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message || "Server error" },
      { status: err.status || 500 }
    );
  }
}
