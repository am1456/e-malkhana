import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

// GET - List all cases with optional filters
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

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let filter: any = {};

    if (status && (status === "PENDING" || status === "DISPOSED")) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { crimeNumber: { $regex: search, $options: "i" } },
        { investigatingOfficerName: { $regex: search, $options: "i" } },
        { policeStationName: { $regex: search, $options: "i" } },
      ];
    }

    const cases = await Case.find(filter)
      .populate("createdBy", "fullName badgeId")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: cases,
    });
  } catch (error: any) {
    console.error("Get cases error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new case
export async function POST(request: NextRequest) {
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
    const {
      policeStationName,
      investigatingOfficerName,
      investigatingOfficerId,
      crimeNumber,
      crimeYear,
      dateOfFIR,
      dateOfSeizure,
      actAndLaw,
      sectionOfLaw,
      properties,
    } = body;

    // Check if crime number already exists
    const existingCase = await Case.findOne({ crimeNumber });
    if (existingCase) {
      return NextResponse.json(
        { success: false, message: "Crime number already exists" },
        { status: 400 }
      );
    }

    // Create case
    const newCase = await Case.create({
      policeStationName,
      investigatingOfficerName,
      investigatingOfficerId,
      crimeNumber,
      crimeYear,
      dateOfFIR,
      dateOfSeizure,
      actAndLaw,
      sectionOfLaw,
      properties: properties || [],
      custodyLogs: [],
      status: "PENDING",
      createdBy: token.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Case created successfully",
        data: newCase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create case error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}