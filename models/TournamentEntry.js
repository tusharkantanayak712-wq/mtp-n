import mongoose from "mongoose";

const TournamentEntrySchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    gameIds: {
      type: [String], // Array of game IDs (1 for solo, 4 for 4v4, etc.)
      required: true,
    },
    coinsPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "confirmed", // Auto-confirmed for now since coins are deducted
    },
  },
  { timestamps: true }
);

export default mongoose.models.TournamentEntry ||
  mongoose.model("TournamentEntry", TournamentEntrySchema);
