import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { success: false, message: "Only admins can dispose cases" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { id } = await params;
    
    const { disposalType, courtOrderReference, dateOfDisposal, remarks } = body;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    if (caseData.status === "DISPOSED") {
      return NextResponse.json(
        { success: false, message: "Case is already disposed" },
        { status: 400 }
      );
    }

    caseData.disposal = {
      disposalType,
      courtOrderReference,
      dateOfDisposal,
      remarks,
    };
    caseData.status = "DISPOSED";

    await caseData.save();

    return NextResponse.json({
      success: true,
      message: "Case disposed successfully",
      data: caseData,
    });
  } catch (error: any) {
    console.error("Disposal error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { success: false, message: "Only admins can update disposal" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { id } = await params;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    if (caseData.status !== "DISPOSED") {
      return NextResponse.json(
        { success: false, message: "Case is not disposed yet" },
        { status: 400 }
      );
    }

    if (caseData.disposal) {
      Object.assign(caseData.disposal, body);
      await caseData.save();
    }

    return NextResponse.json({
      success: true,
      message: "Disposal info updated successfully",
      data: caseData,
    });
  } catch (error: any) {
    console.error("Update disposal error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}