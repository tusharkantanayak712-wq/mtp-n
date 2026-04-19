import mongoose from "mongoose";

/**
 * CoinTaskClaim — tracks each user's attempt to claim a coin task.
 * Requires admin approval before coins are awarded.
 */
const CoinTaskClaimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    taskId: {
      type: String,
      required: true,
      index: true,
    },
    taskTitle: {
      type: String,
    },
    coins: {
      type: Number,
      required: true, // reward from task at time of claim
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    // Admin who reviewed it
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    // Optional: screenshot or proof URL submitted by user
    proofUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

CoinTaskClaimSchema.index({ status: 1, createdAt: -1 });
CoinTaskClaimSchema.index({ userId: 1, taskId: 1 }); // Fast duplicate check

export default mongoose.models.CoinTaskClaim ||
  mongoose.model("CoinTaskClaim", CoinTaskClaimSchema);
