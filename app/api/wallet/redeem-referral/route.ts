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

        // ============ CHECK IF ALREADY REDEEMED ============
        if (user.referralUsed) {
            return NextResponse.json(
                { success: false, message: "You have already redeemed a referral code." },
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
        // 1 Coin Reward
        const REWARD_AMOUNT = 1;

        // Update User (Referee)
        const userBalanceBefore = user.wallet || 0;
        const userBalanceAfter = userBalanceBefore + REWARD_AMOUNT;

        user.wallet = userBalanceAfter;
        user.referralUsed = true;
        user.referredBy = referrer.userId;
        await user.save();

        // Create Transaction for User
        await WalletTransaction.create({
            transactionId: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            userId: user.userId,
            userObjectId: user._id,
            type: "credit",
            amount: REWARD_AMOUNT,
            balanceBefore: userBalanceBefore,
            balanceAfter: userBalanceAfter,
            description: `Referral Bonus (Used code: ${referralCode})`,
            status: "success",
            performedBy: "system"
        });

        // Update Referrer
        const referrerBalanceBefore = referrer.wallet || 0;
        const referrerBalanceAfter = referrerBalanceBefore + REWARD_AMOUNT;

        referrer.wallet = referrerBalanceAfter;
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        await referrer.save();

        // Create Transaction for Referrer
        await WalletTransaction.create({
            transactionId: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}-R`,
            userId: referrer.userId,
            userObjectId: referrer._id,
            type: "credit",
            amount: REWARD_AMOUNT,
            balanceBefore: referrerBalanceBefore,
            balanceAfter: referrerBalanceAfter,
            description: `Referral Bonus (Referred user: ${user.userId})`,
            status: "success",
            performedBy: "system"
        });

        return NextResponse.json({
            success: true,
            message: "Referral code redeemed! 1 coin added to your wallet.",
            newBalance: userBalanceAfter
        });

    } catch (error) {
        console.error("Referral redemption error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
