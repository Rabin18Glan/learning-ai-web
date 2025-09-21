import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/email-service";


export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
    }

    const { userId } = verifyToken(token, "verify");
    await connectDB();

    const user = await User.findOne({ email: userId, verificationToken: token });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/auth/login?verified=true", process.env.NEXT_PUBLIC_APP_URL));
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}