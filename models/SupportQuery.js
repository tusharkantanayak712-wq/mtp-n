import mongoose from "mongoose";

const SupportQuerySchema = new mongoose.Schema(
  {
    email: { type: String, default: null },
    phone: { type: String, default: null },
    phoneNo: { type: String, required: true },
    orderId: { type: String, default: null },
    type: { type: String, required: true },
    message: { type: String, required: true },
    adminReply: { type: String, default: null },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// Always use the latest schema (avoids stale cache in dev hot-reload)
delete mongoose.models.SupportQuery;
export default mongoose.model("SupportQuery", SupportQuerySchema);

