import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/apiKeyAuth";

export async function POST(req) {
    try {
        const auth = await validateApiKey(req);
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const body = await req.json();

        // Forward to the external region check API as requested
        const response = await fetch("https://game-off-ten.vercel.app/api/v1/check-region", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_SECRET_KEY,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // Forward the external API response directly
        return NextResponse.json(data);

    } catch (error) {
        console.error("Service Region Check API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
