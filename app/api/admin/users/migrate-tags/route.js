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

        /* ================= MIGRATION ================= */
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not fully established. Please try again.");
        }
        const collection = db.collection("users");

        // Broad scan: find any user who doesn't have a tags array with at least one item
        // or where tags is simply missing/null
        const query = {
            $or: [
                { tags: { $exists: false } },
                { tags: null },
                { tags: { $type: 10 } }, // null type
                { tags: { $size: 0 } },
                { tags: { $not: { $type: "array" } } }
            ]
        };

        const result = await collection.updateMany(
            query,
            { $set: { tags: ["new"] } }
        );

        // Debug: Get a few sample IDs that were considered for update
        const samples = await collection.find(query).limit(5).toArray();

        console.log(`Native Migration: Matched ${result.matchedCount}, Modified ${result.modifiedCount}`);

        return Response.json({
            success: true,
            message: `Sync complete! Force-updated ${result.modifiedCount} records.`,
            meta: {
                matched: result.matchedCount,
                modified: result.modifiedCount,
                samples: samples.map(s => s.userId || s._id)
            }
        });
    } catch (err) {
        console.error("Migration error:", err);
        return Response.json(
            { success: false, message: "Server error during migration" },
            { status: 500 }
        );
    }
}
