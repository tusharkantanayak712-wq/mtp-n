import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema(
  {
    game: {
      type: String,
      required: true,
      // e.g. "mlbb", "freefire", "codm"
    },
    title: { type: String, required: true },       // "5v5 Squad Scrims"
    subtitle: { type: String, default: "" },        // short tagline
    format: { type: String, required: true },       // "5v5 · Best of 3"
    prize: { type: String, default: "Weekly Pass" }, // prize label
    slots: { type: Number, required: true },
    slotsFilled: { type: Number, default: 0 },
    entryCoins: { type: Number, default: 0 },       // 0 = Free, >0 = via BBC coins
    status: {
      type: String,
      enum: ["open", "upcoming", "closed", "ended"],
      default: "upcoming",
    },
    startsAt: { type: Date, default: null },        // Event start date/time
    endsAt: { type: Date, default: null },          // optional end date/time
    roomId: { type: String, default: "" },          // Game Room ID
    roomPassword: { type: String, default: "" },    // Room Password
  },
  { timestamps: true }
);

TournamentSchema.index({ game: 1, status: 1 });
TournamentSchema.index({ createdAt: -1 });

export default mongoose.models.Tournament ||
  mongoose.model("Tournament", TournamentSchema);
