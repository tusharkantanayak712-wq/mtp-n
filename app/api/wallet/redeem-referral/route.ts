import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";

export async function POST(req: Request) {
    try {
        await connectDB();

        // ============ AUTHENTICATION ============
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const userId = decoded.userId;

        // ============ GET USER INFO ============
        let user = await User.findById(userId);
        if (!user) {
            user = await User.findOne({ userId });
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.referralUsed) {
            return NextResponse.json(
                { success: false, message: "You have already redeemed a referral code." },
                { status: 400 }
            );
        }

        // ============ CHECK 24 HOUR LIMIT ============
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const accountAge = Date.now() - new Date(user.createdAt).getTime();

        if (accountAge > ONE_DAY_MS) {
            return NextResponse.json(
                { success: false, message: "Referral codes can only be added within 24 hours of account creation." },
                { status: 400 }
            );
        }

        // ============ GET REFERRAL CODE ============
        const { referralCode } = await req.json();

        if (!referralCode) {
            return NextResponse.json(
                { success: false, message: "Referral code is required" },
                { status: 400 }
            );
        }

        // ============ VALIDATE REFERRAL CODE ============
        // Check if code is their own
        if (referralCode === user.userId) {
            return NextResponse.json(
                { success: false, message: "You cannot use your own referral code." },
                { status: 400 }
            );
        }

        // Find referrer
        const referrer = await User.findOne({ userId: referralCode });
        if (!referrer) {
            return NextResponse.json(
                { success: false, message: "Invalid referral code." },
                { status: 404 }
            );
        }

        // ============ PROCESS REWARD ============
        // 0 Coin Reward (Tracking only)
        const REWARD_AMOUNT = 0;

        // 🔒 ATOMIC UPDATE: Prevent Race Conditions
        // Only update if referralUsed is FALSE
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: user._id,
                referralUsed: false
            },
            {
                $set: {
                    referralUsed: true,
                    referredBy: referrer.userId
                },
                $inc: { wallet: REWARD_AMOUNT }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "Referral already redeemed or request failed." },
                { status: 400 }
            );
        }

        // Create Transaction for User
        if (REWARD_AMOUNT > 0) {
            await WalletTransaction.create({
                transactionId: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                userId: updatedUser.userId,
                userObjectId: updatedUser._id,
                type: "credit",
                amount: REWARD_AMOUNT,
                balanceBefore: updatedUser.wallet - REWARD_AMOUNT,
                balanceAfter: updatedUser.wallet,
                description: `Referral Bonus (Used code: ${referralCode})`,
                status: "success",
                performedBy: "system"
            });
        }

        // Update Referrer (Atomic $inc)
        // We don't worry as much about race conditions here since counting multiple is "okay" 
        // but we still use $inc for safety.
        const updatedReferrer = await User.findOneAndUpdate(
            { _id: referrer._id },
            {
                $inc: {
                    wallet: REWARD_AMOUNT,
                    referralCount: 1
                }
            },
            { new: true }
        );

        // Create Transaction for Referrer
        if (updatedReferrer && REWARD_AMOUNT > 0) {
            await WalletTransaction.create({
                transactionId: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}-R`,
                userId: updatedReferrer.userId,
                userObjectId: updatedReferrer._id,
                type: "credit",
                amount: REWARD_AMOUNT,
                balanceBefore: updatedReferrer.wallet - REWARD_AMOUNT,
                balanceAfter: updatedReferrer.wallet,
                description: `Referral Bonus (Referred user: ${updatedUser.userId})`,
                status: "success",
                performedBy: "system"
            });
        }

        return NextResponse.json({
            success: true,
            message: "Referral code added successfully.",
            newBalance: updatedUser.wallet
        });

    } catch (error) {
        console.error("Referral redemption error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
