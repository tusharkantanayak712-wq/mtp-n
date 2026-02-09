import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateUserId } from "@/lib/generateUserId";
import { sendOtpMail } from "@/lib/sendOtpMail";

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email } = await request.json();

        if (!email) {
            return Response.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Auto-register if not exists
            const name = normalizedEmail.split("@")[0];
            const dummyPhone = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            const userId = generateUserId(name, dummyPhone);

            user = await User.create({
                userId,
                name,
                email: normalizedEmail,
                provider: "local",
                wallet: 0,
                order: 0,
                userType: "user",
                resetOtp: otp,
                resetOtpExpiry: expiry
            });
        } else {
            user.resetOtp = otp;
            user.resetOtpExpiry = expiry;
            await user.save();
        }

        await sendOtpMail(normalizedEmail, otp);

        return Response.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        console.error("STP Send Error:", error);
        return Response.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
    }
}
