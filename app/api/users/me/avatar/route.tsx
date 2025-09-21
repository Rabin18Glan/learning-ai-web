import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Simulate file upload (in production, use a service like AWS S3)
    // For now, we'll assume the file is processed and returns a URL
    const profilePicture = `/uploads/avatars/${session.user.id}-${Date.now()}.jpg`;

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.profilePicture = profilePicture;
    await user.save();

    return NextResponse.json({ success: true, profilePicture });
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}