import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; propertyId: string }> }
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
    const { id, propertyId } = await params;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    const property = caseData.properties.id(propertyId);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    Object.assign(property, body);
    await caseData.save();

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
      data: caseData,
    });
  } catch (error: any) {
    console.error("Update property error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; propertyId: string }> }
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

    const { id, propertyId } = await params;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    caseData.properties.pull(propertyId);
    await caseData.save();

    return NextResponse.json({
      success: true,
      message: "Property removed successfully",
      data: caseData,
    });
  } catch (error: any) {
    console.error("Delete property error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}