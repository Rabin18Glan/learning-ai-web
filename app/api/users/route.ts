import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;


    if (!user || user.role !== "admin") {
        console.log(user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5", 10);

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    // Fetch paginated users
    const users = await User.find()
      .select("name email role subscriptionPlan isActive lastLogin createdAt bio profilePicture")
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    const totalItems = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const formattedUsers = users.map((user) => ({
      _id: user._id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      bio: user.bio,
      profilePicture: user.profilePicture,
    }));

    return NextResponse.json({
      users: formattedUsers,
      currentPage: page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
      stats: {
        totalUsers: totalItems,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { isActive } = await req.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    targetUser.isActive = isActive;
    await targetUser.save();

    return NextResponse.json({ message: `User ${isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}