import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import QRCode from "qrcode";
import dbConnect from "@/lib/dbConnect";
import Case from "@/models/Case.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
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

    const { propertyId } = await params;

    const caseData = await Case.findOne({
      "properties._id": propertyId,
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
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

    const qrData = {
      propertyId: property._id,
      caseId: caseData._id,
      crimeNumber: caseData.crimeNumber,
      category: property.category,
      location: property.location,
      url: `${process.env.NEXTAUTH_URL}/dashboard/cases/${caseData._id}`
    };

    const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: "H",
      width: 300,
    });

    if (!property.qrCode) {
      property.qrCode = qrCodeBase64;
      await caseData.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeBase64,
        propertyId: property._id,
        crimeNumber: caseData.crimeNumber,
      },
    });
  } catch (error: any) {
    console.error("QR code generation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}