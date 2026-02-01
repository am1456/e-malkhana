import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import User from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password, fullName, policeStationName, badgeId, role } = body;

    // Check if any user exists
    const userCount = await User.countDocuments();

    // First user becomes SUPER_ADMIN automatically
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = await User.create({
        username,
        password: hashedPassword,
        fullName,
        policeStationName,
        badgeId,
        role: "SUPER_ADMIN",
      });

      return NextResponse.json(
        {
          success: true,
          message: "Super Admin created successfully",
          user: {
            id: superAdmin._id,
            username: superAdmin.username,
            role: superAdmin.role,
          },
        },
        { status: 201 }
      );
    }

    // Check authentication - only logged-in users can create other users
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN and ADMIN can create users
    if (token.role !== "SUPER_ADMIN" && token.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only admins can create users" },
        { status: 403 }
      );
    }

    // SUPER_ADMIN can create anyone (including ADMIN)
    // ADMIN can only create OFFICER
    if (token.role === "ADMIN" && (role === "SUPER_ADMIN" || role === "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "You can only create OFFICER accounts" },
        { status: 403 }
      );
    }

    // Prevent creating additional SUPER_ADMIN
    if (role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Cannot create additional Super Admin" },
        { status: 403 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }

    // Check if badge ID already exists
    const existingBadge = await User.findOne({ badgeId });
    if (existingBadge) {
      return NextResponse.json(
        { success: false, message: "Badge ID already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      fullName,
      policeStationName,
      badgeId,
      role: role || "OFFICER",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}