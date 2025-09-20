// app/payment-failure/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border border-red-200/30 dark:border-red-700/30 bg-gradient-to-br from-red-100/20 to-rose-100/20 dark:from-red-950/20 dark:to-rose-950/20 backdrop-blur-md rounded-3xl">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-600 dark:text-red-300" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              We're sorry, but your payment could not be processed.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your payment details and try again, or contact support if the problem persists.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/subscription")}
              className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/contact")}
              className="bg-white/10 dark:bg-slate-950/10 border-slate-200/30 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl transition-all duration-300"
            >
              Contact Support
            </Button>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}