import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "your-smtp-user",
    pass: process.env.SMTP_PASS || "your-smtp-password",
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@yourapp.com",
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <h1>Welcome to EduSense AI!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@yourapp.com",
    to: email,
    subject: "Reset Your Password",
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateToken(userId: string, type: "verify" | "reset"): string {
  const secret = type === "verify" ? process.env.JWT_VERIFY_SECRET! : process.env.JWT_RESET_SECRET!;
  return jwt.sign({ userId, type }, secret, { expiresIn: type === "verify" ? "7d" : "1h" });
}

export function verifyToken(token: string, type: "verify" | "reset"): { userId: string } {
  const secret = type === "verify" ? process.env.JWT_VERIFY_SECRET! : process.env.JWT_RESET_SECRET!;
  return jwt.verify(token, secret) as { userId: string };
}