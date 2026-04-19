import mongoose from "mongoose";

const CoinTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["url_visit", "yt_watch", "app_install", "wp_join", "custom"],
      required: true,
    },
    url: {
      type: String, // Link user opens to complete task
      required: true,
    },
    reward: {
      type: Number, // Coins to give on completion
      required: true,
      min: 1,
    },
    // How many seconds user must wait before claiming (anti-cheat timer)
    waitSeconds: {
      type: Number,
      default: 10, // Default 10s
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null = never expires
    },
    completedBy: {
      type: [String], // Array of userIds who completed this task
      default: [],
    },
    // B2B sponsorship data
    sponsorName: {
      type: String, // e.g. "Garena", "App XYZ"
      default: null,
    },
    // Display order (lower = shown first)
    priority: {
      type: Number,
      default: 0,
    },
    // Total completions limit (null = unlimited)
    maxCompletions: {
      type: Number,
      default: null,
    },
    createdBy: {
      type: String, // "admin" or admin userId
      default: "admin",
    },

    // Secret verification code hidden in the task content (video, post, page)
    // If set, user must enter this code to submit their claim
    // null = no code required (timer-only tasks)
    verificationCode: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

CoinTaskSchema.index({ active: 1, priority: -1 });
CoinTaskSchema.index({ expiresAt: 1 });

export default mongoose.models.CoinTask ||
  mongoose.model("CoinTask", CoinTaskSchema);
