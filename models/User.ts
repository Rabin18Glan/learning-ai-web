import mongoose, { type Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  profilePicture?: string;
  bio?: string;
  role: "user" | "admin";
  subscriptionPlan: "free" | "pro" | "premium";
  subscriptionId?: string;
  subscriptionStatus: "active" | "inactive" | "trial" | "past_due" | "canceled";
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  provider?: "google" | "credentials"; 
  verifyPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: false, // Allow OAuth users without passwords
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profilePicture: {
      type: String,
      default: "/images/default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    subscriptionId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "trial", "past_due", "canceled"],
      default: "inactive",
    },
    subscriptionEndDate: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    provider: {
      type: String,
      enum: ["google", "credentials"],
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving (only if password exists)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to verify password
UserSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // No password for OAuth users
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);