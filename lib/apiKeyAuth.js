import crypto from "crypto";
import { connectDB } from "./mongodb";
import ApiKey from "@/models/ApiKey";
import User from "@/models/User";

export async function validateApiKey(req) {
    try {
        await connectDB();
        const apiKey = req.headers.get("x-api-key") || req.nextUrl?.searchParams?.get("api_key");

        if (!apiKey) {
            return { success: false, message: "API key is missing" };
        }

        const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
        const keyDoc = await ApiKey.findOne({ keyHash, status: "active" });

        if (!keyDoc) {
            return { success: false, message: "Invalid or revoked API key" };
        }

        const user = await User.findById(keyDoc.userId);
        if (!user) {
            return { success: false, message: "Associated user not found" };
        }

        const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "unknown";

        // 1. IP Whitelisting
        if (keyDoc.allowedIps && keyDoc.allowedIps.length > 0) {
            if (!keyDoc.allowedIps.includes(clientIp)) {
                return { success: false, message: `Access denied. Authorized IPs only.` };
            }
        }

        // 2. Daily Limit Check & Auto-Reset
        // NOTE: The actual $inc for usedToday happens in the order route atomically.
        // Here we just do a pre-flight read-check so we can return a helpful error early.
        // The real enforcement is the atomic $inc + findOneAndUpdate in the order route.
        const today = new Date().setHours(0, 0, 0, 0);
        const lastReset = keyDoc.lastResetDate
            ? new Date(keyDoc.lastResetDate).setHours(0, 0, 0, 0)
            : 0;

        let usedToday = keyDoc.usedToday || 0;
        if (today > lastReset) {
            // New day — treat as 0 (order route will reset atomically)
            usedToday = 0;
        }

        const dailyLimit = keyDoc.dailyLimit || 25000;
        if (usedToday >= dailyLimit) {
            return { success: false, message: "Daily API spend limit reached." };
        }

        // 3. Update last-used metadata (fire-and-forget, non-blocking)
        // We do NOT await this — it's just for audit/display purposes and
        // should never block or fail a legitimate order.
        ApiKey.findByIdAndUpdate(keyDoc._id, {
            lastUsed: new Date(),
            lastUsedIp: clientIp,
        }).exec();

        return {
            success: true,
            user: {
                id: user._id,
                userId: user.userId,
                userType: user.userType,
                wallet: user.wallet,
                name: user.name,
            },
            key: {
                id: keyDoc._id,
                name: keyDoc.name,
                dailyLimit,
                usedToday,
            }
        };
    } catch (error) {
        console.error("API Key Validation error:", error);
        return { success: false, message: "Identification failure" };
    }
}
