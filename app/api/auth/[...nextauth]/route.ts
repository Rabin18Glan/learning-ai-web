import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User, { IUser } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email }).select("+password");

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isActive) {
            throw new Error("Account is inactive");
          }

          const isPasswordValid = await user.verifyPassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profilePicture,
            bio: user.bio,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStatus: user.subscriptionStatus,
            isActive: user.isActive,
            provider: user.provider,
          };
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.bio = user.bio;
        token.subscriptionPlan = user.subscriptionPlan;
        token.subscriptionStatus = user.subscriptionStatus;
        token.isActive = user.isActive;
        token.provider = user.provider;
      }
      if (account) {
        token.provider = account.provider; // e.g., google, github
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        session.user.bio = token.bio as string | undefined;
        session.user.subscriptionPlan = token.subscriptionPlan as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.isActive = token.isActive as boolean;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            // Create new user for OAuth sign-in
            dbUser = await User.create({
              email: user.email,
              name: user.name || profile?.name || `User_${Date.now()}`,
              profilePicture: user.image || "/images/default-avatar.png",
              role: "user",
              subscriptionPlan: "free",
              subscriptionStatus: "inactive",
              isActive: true,
              provider: account.provider,
              lastLogin: new Date(),
            });
          } else {
            // Update existing user
            dbUser.lastLogin = new Date();
            dbUser.profilePicture = user.image || dbUser.profilePicture;
            dbUser.name = user.name || dbUser.name;
            dbUser.provider = account.provider;
            dbUser.isActive = true;
            await dbUser.save();
          }

          user.id = dbUser._id.toString();
          user.role = dbUser.role;
          user.bio = dbUser.bio;
          user.subscriptionPlan = dbUser.subscriptionPlan;
          user.subscriptionStatus = dbUser.subscriptionStatus;
          user.isActive = dbUser.isActive;
          user.provider = dbUser.provider;
          return true;
        } catch (error) {
          console.error("Error during OAuth sign-in:", error);
          return false;
        }
      }
      return true; // Allow Credentials sign-in
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };