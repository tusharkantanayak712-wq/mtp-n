import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ApiKey from "@/models/ApiKey";

async function getUser(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await User.findById(decoded.userId);
    } catch (err) {
        return null;
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const user = await getUser(req);
        const { id } = await params;

        if (!user || (user.userType !== "member" && user.userType !== "owner")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const key = await ApiKey.findOneAndDelete({ _id: id, userId: user._id });

        if (!key) {
            return NextResponse.json({ success: false, message: "Key not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Key revoked successfully" });
    } catch (error) {
        console.error("DELETE Key Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const user = await getUser(req);
        const { id } = await params;

        if (!user || (user.userType !== "member" && user.userType !== "owner")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Generate a new secure API key
        const rawKey = crypto.randomBytes(32).toString("hex");
        const prefix = "TK_";
        const fullKey = `${prefix}${rawKey}`;

        // Hash the new key
        const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");
        const lastFour = fullKey.slice(-4);

        // Update existing document - this automatically invalidates the old one
        const updatedKeyDoc = await ApiKey.findOneAndUpdate(
            { _id: id, userId: user._id },
            { keyHash, lastFour, lastUsed: null },
            { new: true }
        );

        if (!updatedKeyDoc) {
            return NextResponse.json({ success: false, message: "Key not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            key: {
                ...updatedKeyDoc.toObject(),
                rawKey: fullKey
            }
        });
    } catch (error) {
        console.error("PATCH Key Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const user = await getUser(req);
        const { id } = await params;

        if (!user || (user.userType !== "member" && user.userType !== "owner")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { name, allowedIps, dailyLimit } = await req.json();
        const updateData = {};

        if (name) updateData.name = name;
        if (dailyLimit !== undefined) updateData.dailyLimit = Number(dailyLimit);
        if (allowedIps && Array.isArray(allowedIps)) {
            updateData.allowedIps = allowedIps.filter(ip => typeof ip === 'string' && ip.trim() !== '');
        }

        const updatedKeyDoc = await ApiKey.findOneAndUpdate(
            { _id: id, userId: user._id },
            updateData,
            { new: true }
        );

        if (!updatedKeyDoc) {
            return NextResponse.json({ success: false, message: "Key not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, key: updatedKeyDoc });
    } catch (error) {
        console.error("PUT Key Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
