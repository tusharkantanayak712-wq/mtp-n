import mongoose from "mongoose";

const CoinTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
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
    type: {
      type: String,
      enum: ["earn", "spend"],
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },
    source: {
      type: String,
      enum: [
        "purchase",       // Earned from buying a game top-up
        "checkin",        // Daily check-in
        "task",           // Completed a sponsored task
        "referral",       // Referral bonus
        "convert_to_wallet", // Spent coins → wallet
        "admin",          // Manual admin adjustment
      ],
      required: true,
    },
    description: {
      type: String,
      default: "Coin Transaction",
    },
    referenceId: {
      type: String, // orderId / taskId
      index: true,
    },
    performedBy: {
      type: String, // "system", "admin", "user"
      default: "system",
    },
  },
  { timestamps: true }
);

CoinTransactionSchema.index({ createdAt: -1 });
CoinTransactionSchema.index({ userId: 1, createdAt: -1 });
CoinTransactionSchema.index({ source: 1, createdAt: -1 });

export default mongoose.models.CoinTransaction ||
  mongoose.model("CoinTransaction", CoinTransactionSchema);
