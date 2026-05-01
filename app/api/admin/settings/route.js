import { connectDB } from "@/lib/mongodb";
import AppSettings from "@/models/AppSettings";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/* ================= AUTH HELPERS ================= */
const requireOwner = (req) => {
    const auth = req.headers.get("authorization");

    if (!auth || !auth.startsWith("Bearer ")) {
        return { error: "Unauthorized", status: 401 };
    }

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType !== "owner") {
            return { error: "Forbidden", status: 403 };
        }

        return { decoded };
    } catch {
        return { error: "Invalid token", status: 401 };
    }
};

/* ================= GET SETTINGS ================= */
export async function GET(req) {
    try {
        await connectDB();

        const authCheck = requireOwner(req);
        if (authCheck.error) {
            return NextResponse.json(
                { success: false, message: authCheck.error },
                { status: authCheck.status }
            );
        }

        let settings = await AppSettings.findOne({});
        if (!settings) {
            settings = await AppSettings.create({ maintenanceMode: false });
        }

        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (err) {
        console.error("GET settings error:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

/* ================= UPDATE SETTINGS ================= */
export async function PATCH(req) {
    try {
        await connectDB();

        const authCheck = requireOwner(req);
        if (authCheck.error) {
            return NextResponse.json(
                { success: false, message: authCheck.error },
                { status: authCheck.status }
            );
        }

        const body = await req.json();
        const { maintenanceMode, mlbbWeeklyProvider } = body;

        let settings = await AppSettings.findOne({});
        if (!settings) {
            settings = new AppSettings({ maintenanceMode: false, mlbbWeeklyProvider: "1game" });
        }

        if (typeof maintenanceMode === "boolean") {
            settings.maintenanceMode = maintenanceMode;
        }

        if (mlbbWeeklyProvider && ["1game", "smileone"].includes(mlbbWeeklyProvider)) {
            settings.mlbbWeeklyProvider = mlbbWeeklyProvider;
        }

        await settings.save();
        revalidateTag("app-settings");
        revalidatePath("/", "layout");

        return NextResponse.json({
            success: true,
            message: "Settings updated successfully",
            data: settings,
        });
    } catch (err) {
        console.error("PATCH settings error:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
