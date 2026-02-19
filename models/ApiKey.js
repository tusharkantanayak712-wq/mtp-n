import mongoose from "mongoose";

const ApiKeySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        keyHash: {
            type: String,
            required: true,
            unique: true,
        },
        lastFour: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "revoked"],
            default: "active",
        },
        lastUsed: {
            type: Date,
            default: null,
        },
        lastUsedIp: {
            type: String,
            default: null,
        },
        allowedIps: {
            type: [String],
            default: [], // Empty means all IPs allowed
        },
        dailyLimit: {
            type: Number,
            default: 25000, // Default 25k limit per day for safety
        },
        usedToday: {
            type: Number,
            default: 0,
        },
        lastResetDate: {
            type: Date,
            default: Date.now,
        },
        lastRequestAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ApiKey || mongoose.model("ApiKey", ApiKeySchema);
