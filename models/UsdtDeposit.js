import mongoose from "mongoose";

const UsdtDepositSchema = new mongoose.Schema(
    {
        depositId: {
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
        // Amount in USDT that user claims to send
        usdtAmount: {
            type: Number,
            required: true,
        },
        // Coins to credit (usdtAmount * USDT_TO_COINS_RATE)
        coinsToCredit: {
            type: Number,
            required: true,
        },
        // Network: TRC20 or ERC20
        network: {
            type: String,
            enum: ["BEP20"],
            default: "BEP20",
        },
        // USDT wallet address the user should send to
        depositAddress: {
            type: String,
            required: true,
        },
        // TX hash submitted by user
        txHash: {
            type: String,
            default: null,
            index: true,
        },
        status: {
            type: String,
            enum: ["waiting", "submitted", "confirmed", "failed", "expired"],
            default: "waiting",
        },
        // Who confirmed it
        confirmedBy: {
            type: String, // "admin" | "auto"
            default: null,
        },
        notes: {
            type: String,
            default: null,
        },
        // Expiry: 20 minutes from creation
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 20 * 60 * 1000),
            index: { expireAfterSeconds: 0 },
        },
    },
    { timestamps: true }
);

UsdtDepositSchema.index({ status: 1, createdAt: -1 });
UsdtDepositSchema.index({ userId: 1, status: 1 });

if (mongoose.models.UsdtDeposit) {
    delete mongoose.models.UsdtDeposit;
}

export default mongoose.model("UsdtDeposit", UsdtDepositSchema);
