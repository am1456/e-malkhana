import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
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

    await dbConnect();

    // Get counts
    const totalCases = await Case.countDocuments();
    const disposedCases = await Case.countDocuments({ status: "DISPOSED" });
    const pendingCases = await Case.countDocuments({ status: "PENDING" });

    return NextResponse.json({
      success: true,
      data: {
        totalCases,
        disposedCases,
        pendingCases,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}