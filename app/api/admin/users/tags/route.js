import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectDB();

        /* ================= AUTH ================= */
        const auth = req.headers.get("authorization");
        if (!auth?.startsWith("Bearer "))
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner")
            return Response.json({ message: "Forbidden" }, { status: 403 });

        const { userId, tags } = await req.json();

        // Body check
        if (!userId) {
            return Response.json({ success: false, message: "UserId is required" }, { status: 400 });
        }

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not fully established.");
        }
        const collection = db.collection("users");

        const isObjectId = mongoose.Types.ObjectId.isValid(userId);
        
        // Try to update using either _id (MongoDB) or our custom userId
        const query = {
            $or: [
                ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(userId) }] : []),
                { userId: userId }
            ]
        };

        const result = await collection.findOneAndUpdate(
            query,
            { $set: { tags: Array.isArray(tags) ? tags : [tags] } },
            { returnDocument: "after" }
        );

        console.log(`Tag Native Update: User ${userId} Result: ${!!result}`);

        if (!result) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Tags updated successfully",
            tags: result.tags
        });
    } catch (err) {
        console.error(err);
        return Response.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
