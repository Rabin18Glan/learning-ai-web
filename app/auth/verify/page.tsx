"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("No verification token provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`, {
          method: "GET",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Verification failed");
        }

        setSuccess("Email verified successfully! You can now log in.");
        setTimeout(() => router.push("/auth/login?verified=true"), 3000);
      } catch (err: any) {
        setError(err.message || "An error occurred during verification");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
            {isLoading ? (
              <Loader2 className="h-12 w-12 text-back animate-spin" />
            ) : success ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </motion.div>
          <CardTitle className="text-3xl font-bold text-back">Email Verification</CardTitle>
          <CardDescription className="text-gray-600">
            {isLoading ? "Verifying your email..." : success ? "Verification Successful" : "Verification Failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-500/20 border-green-500/50 text-green-100">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600 w-full">
            {success ? (
              <>
                Redirecting to{" "}
                <Link href="/auth/login" className="text-back font-semibold hover:underline">
                  Sign in
                </Link>
                ...
              </>
            ) : (
              <>
                Back to{" "}
                <Link href="/auth/login" className="text-back font-semibold hover:underline">
                  Sign in
                </Link>{" "}
                |{" "}
                <Link href="/auth/signup" className="text-back font-semibold hover:underline">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <Suspense fallback={<Loader2 className="h-12 w-12 text-back animate-spin" />}>
        <VerifyEmailView />
      </Suspense>
    </div>
  );
}