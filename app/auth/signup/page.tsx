"use client";

import type React from "react";
import { useState } from "react";
import Link

 from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, provider: "credentials" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/learnings" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
  

      <Card className="relative mx-auto max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-12 w-12 text-back" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-back">Create an Account</CardTitle>
          <CardDescription className="text-gray-600">Join EduSense AI today</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-back">Full Name</Label>
              <Input
                id="name"
                placeholder="Rabin Glan"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-back placeholder-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-back">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-back placeholder-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-back">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/10 border-white/20 text-back placeholder-gray-400 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                disabled={isLoading}
                className="border-white/20"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-back font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-back font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
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
                className="w-full bg-white/10 border-white/20 text-back hover:bg-white/20 transition-all"
              >
                         <img src={'/google.webp'} className="w-5 h-5"/>   Google
              </Button>
             
          </CardContent>
        </form>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 w-full">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-back font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}