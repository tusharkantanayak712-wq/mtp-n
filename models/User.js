import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    /* ================= CORE IDS ================= */
    userId: {
      type: String,
      unique: true,
      required: true, // your generated userId
    },

    /* ================= BASIC INFO ================= */
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows google-only users
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // allows email-only users
    },

    /* ================= AUTH ================= */
    password: {
      type: String,
      default: null, // 👈 important for Google users
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String, // Google profile image
    },

    /* ================= APP DATA ================= */
    wallet: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    /* ================= REFERRAL SYSTEM ================= */
    referralUsed: {
      type: Boolean,
      default: false, // true if this user has already used someone else's code
    },

    referralCount: {
      type: Number,
      default: 0, // how many users used this user's code
    },

    referredBy: {
      type: String, // userId of the referrer
      sparse: true,
      index: true,
    },

    userType: {
      type: String,
      enum: ["user", "admin", "owner", "member"],
      default: "user",
    },

    /* ================= FORGOT PASSWORD ================= */
    resetOtp: String,
    resetOtpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
