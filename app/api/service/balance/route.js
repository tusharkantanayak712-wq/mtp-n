import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { validateApiKey } from "@/lib/apiKeyAuth";

export async function GET(req) {
    try {
        const auth = await validateApiKey(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(auth.user.id);

        return NextResponse.json({
            success: true,
            wallet: user.wallet,
            userType: user.userType,
            name: user.name,
            userId: user.userId
        });

    } catch (error) {
        console.error("Balance API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
