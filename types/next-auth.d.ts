import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image: string;
      bio?: string;
      subscriptionPlan: string;
      subscriptionStatus: string;
      isActive: boolean;
      provider?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image: string;
    bio?: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    isActive: boolean;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    image: string;
    bio?: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    isActive: boolean;
    provider?: string;
  }
}