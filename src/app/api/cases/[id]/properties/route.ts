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

    await dbConnect();

    const body = await request.json();
    const { id } = await params;
    
    const {
      category,
      belongingTo,
      nature,
      quantity,
      location,
      description,
      photoUrl,
    } = body;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    caseData.properties.push({
      category,
      belongingTo,
      nature,
      quantity,
      location,
      description,
      photoUrl,
    });

    await caseData.save();

    return NextResponse.json(
      {
        success: true,
        message: "Property added successfully",
        data: caseData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add property error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}