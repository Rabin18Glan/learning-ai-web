"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage("Registration successful! Please log in with your credentials.");
    }

    const errorType = searchParams?.get("error");
    if (errorType) {
      switch (errorType) {
        case "CredentialsSignin":
          setError("Invalid email or password");
          break;
        default:
          setError("An error occurred during login");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      dispatch(
        loginSuccess({
          user: { id: "", name: "", email: email },
          token: "",
          // isAuthenticated: true,
        })
      );
      router.push("/learnings");
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/learnings" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
    

      <Card className="relative mx-auto max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-12 w-12 text-black" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-black">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">Sign in to your EduSense account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {successMessage && (
              <Alert className="bg-green-500/20 border-green-500/50 text-green-100">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/10 border-white/40 text-black placeholder-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black">Password</Label>
                <Link href="/forgot-password" className="text-sm text-black/80 hover:text-black transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/10  border-white/40 text-black placeholder-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/10 px-3 text-gray-600">Or continue with</span>
              </div>
            </div>
           
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                className="w-full bg-white/10 border-white/20 text-black hover:bg-white/20 transition-all"
              >
            <img src={'/google.webp'} className="w-5 h-5"/>   Google
              </Button>
          
            
          </CardContent>
        </form>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 w-full">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-black font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}