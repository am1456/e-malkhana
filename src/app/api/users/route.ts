import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN and ADMIN can view users
    if (token.role !== "SUPER_ADMIN" && token.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only admins can view users" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let filter: any = {
      role: { $ne: "SUPER_ADMIN" } 
    };


    if (role && ["ADMIN", "OFFICER"].includes(role)) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}