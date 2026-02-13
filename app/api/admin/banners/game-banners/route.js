import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function GET() {
  try {
    await connectDB();

    const banners = await Banner.find() // 👈 FILTER HERE
      .sort({ bannerDate: -1 })
      .lean();

    return NextResponse.json({
      statusCode: 200,
      success: true,
      message: "All banners retrieved",
      data: banners,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load banners",
      },
      { status: 500 }
    );
  }
}




