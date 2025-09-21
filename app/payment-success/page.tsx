// app/payment-success/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border border-blue-200/30 dark:border-blue-700/30 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-md rounded-3xl">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-300" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Your subscription has been activated successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Thank you for choosing our service. You can now enjoy all the features of your plan.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => router.push("/learnings")}
              className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
            >
              Go to Learnings
            </Button>
          </CardFooter>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}