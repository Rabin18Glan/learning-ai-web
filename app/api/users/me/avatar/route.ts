import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBucket } from "@/lib/bucket";
import { default as connectDB, default as connectToDatabase } from "@/lib/db";
import User from "@/models/User";
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }


    await connectToDatabase()
    const bucket = await getBucket("avatar");
    const uploadStream = bucket.openUploadStream(`${Date.now()}-${file.name}`, {
      contentType: file.type,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    uploadStream.end(buffer);

    // Wait for completion
    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", () => resolve());
      uploadStream.on("error", reject);
    });


    const fileId = uploadStream.id;
    const fileUrl = `/api/users/me/avatar/${fileId.toString()}`;
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.profilePicture = fileUrl;
    await user.save();

    return NextResponse.json({ success: true, profilePicture: fileUrl });
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
