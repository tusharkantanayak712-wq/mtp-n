import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, amount, action } = await req.json();

        if (!email || !amount || !action) {
            return Response.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (amount <= 0) {
            return Response.json(
                { success: false, message: "Amount must be positive" },
                { status: 400 }
            );
        }

        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer "))
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner")
            return Response.json({ message: "Forbidden" }, { status: 403 });

        /* ================= FIND USER ================= */
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found with this email" },
                { status: 404 }
            );
        }

        /* ================= UPDATE WALLET ================= */
        const updateAmount = action === "add" ? amount : -amount;

        // Prevent negative balance if removing
        if (action === "remove" && user.wallet < amount) {
            return Response.json(
                { success: false, message: "Insufficient balance to remove" },
                { status: 400 }
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $inc: { wallet: updateAmount } },
            { new: true }
        );

        /* ================= RESPONSE ================= */
        return Response.json({
            success: true,
            message: `Successfully ${action === "add" ? "added" : "removed"} ${amount} credits`,
            data: updatedUser,
        });
    } catch (err) {
        console.error("Wallet update failed", err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
