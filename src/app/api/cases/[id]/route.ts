import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

// GET - Get single case by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed
) {
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

    await dbConnect();

    const { id } = await params;  // ← Await params

    const caseData = await Case.findById(id).populate(
      "createdBy",
      "fullName badgeId policeStationName"
    );

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseData,
    });
  } catch (error: any) {
    console.error("Get case error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed
) {
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

    await dbConnect();

    const body = await request.json();
    const { id } = await params;  // ← Await params

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Case updated successfully",
      data: updatedCase,
    });
  } catch (error: any) {
    console.error("Update case error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Changed
) {
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

    if (token.role !== "SUPER_ADMIN" && token.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only admins can delete cases" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id } = await params;  // ← Await params

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    await Case.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete case error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}