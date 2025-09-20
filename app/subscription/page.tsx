"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Download, FileText, Info, Loader2, CreditCard } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { SiteFooter } from "@/components/site-footer";

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  description: string;
  features: string[];
}

interface CurrentPlan {
  id: string;
  name: string;
  billingCycle: "monthly" | "annual";
  price: number;
  status: string;
  startDate: string;
  endDate: string;
  verified: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const plans: Record<string, Plan[]> = {
  monthly: [
    {
      id: "free-monthly",
      name: "Free",
      price: 0,
      billingCycle: "monthly",
      description: "For casual learners",
      features: [
        "5 document uploads",
        "Basic AI tutoring",
        "Simple visualizations",
        "100 AI messages/month",
      ],
    },
    {
      id: "pro-monthly",
      name: "Pro",
      price: 1000,
      billingCycle: "monthly",
      description: "For dedicated students",
      features: [
        "50 document uploads",
        "Advanced AI tutoring",
        "Interactive visualizations",
        "1,000 AI messages/month",
        "Learning analytics",
        "Voice interaction",
      ],
    },
    {
      id: "premium-monthly",
      name: "Premium",
      price: 3000,
      billingCycle: "monthly",
      description: "For power users",
      features: [
        "Unlimited document uploads",
        "Premium AI tutoring",
        "Advanced visualizations",
        "Unlimited AI messages",
        "Comprehensive analytics",
        "Priority support",
        "Custom learning paths",
      ],
    },
  ],
  annual: [
    {
      id: "free-annual",
      name: "Free",
      price: 0,
      billingCycle: "annual",
      description: "For casual learners",
      features: [
        "5 document uploads",
        "Basic AI tutoring",
        "Simple visualizations",
        "100 AI messages/month",
      ],
    },
    {
      id: "pro-annual",
      name: "Pro",
      price: 15300,
      billingCycle: "annual",
      description: "For dedicated students",
      features: [
        "50 document uploads",
        "Advanced AI tutoring",
        "Interactive visualizations",
        "1,000 AI messages/month",
        "Learning analytics",
        "Voice interaction",
      ],
    },
    {
      id: "premium-annual",
      name: "Premium",
      price: 37300,
      billingCycle: "annual",
      description: "For power users",
      features: [
        "Unlimited document uploads",
        "Premium AI tutoring",
        "Advanced visualizations",
        "Unlimited AI messages",
        "Comprehensive analytics",
        "Priority support",
        "Custom learning paths",
      ],
    },
  ],
};

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Get plan details from query params
  useEffect(() => {
    const planId = searchParams.get("planId");
    const billingCycle = searchParams.get("billingCycle");
    if (planId && billingCycle) {
      setSelectedPlanId(planId);
      setIsAnnual(billingCycle === "annual");
    }
  }, [searchParams]);

  // Fetch current plan and invoices
  useEffect(() => {
    async function fetchData() {
      try {
        const [planResponse, invoicesResponse] = await Promise.all([
          fetch("/api/subscriptions/current"),
          fetch("/api/subscriptions/invoices"),
        ]);

        if (planResponse.ok) {
          const data = await planResponse.json();
          setCurrentPlan(data.plan);
        } else {
          throw new Error("Failed to fetch current plan");
        }

        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          setInvoices(invoicesData.invoices);
        } else {
          throw new Error("Failed to fetch invoices");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePayment = async (plan: Plan) => {
    if (plan.price === 0) {
      router.push("/dashboard");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/subscriptions/pay-with-esewa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user-id", // Replace with actual user ID
          plan: plan.name.toLowerCase() as "free" | "pro" | "premium",
          billingCycle: plan.billingCycle,
          amount: plan.price,
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate payment");

      const { formData, actionUrl } = await response.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlan = selectedPlanId
    ? plans[isAnnual ? "annual" : "monthly"].find((p) => p.id === selectedPlanId)
    : null;

  // Map API plan to static plans ID
  const getPlanId = (plan: CurrentPlan | null) => {
    if (!plan) return null;
    return `${plan.name.toLowerCase()}-${plan.billingCycle}`;
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-10 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex justify-center mb-8">
              <Skeleton className="h-12 w-96 rounded-3xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-36 mb-4" />
                      <div className="space-y-2">
                        {Array(4)
                          .fill(0)
                          .map((_, j) => (
                            <Skeleton key={j} className="h-4 w-full" />
                          ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Subscription
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your subscription plan and billing information.
            </p>
          </div>

          <Tabs defaultValue="current-plan" className="w-full">
            <TabsList className="mb-8 bg-gradient-to-r from-slate-100/20 to-slate-200/20 dark:from-slate-950/20 dark:to-slate-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-3">
              {currentPlan && (
                <TabsTrigger
                  value="current-plan"
                  className="py-3 px-6 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
                >
                  Current Plan
                </TabsTrigger>
              )}
              <TabsTrigger
                value="plans"
                className="py-3 px-6 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
              >
                Plans
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="py-3 px-6 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
              >
                Invoices
              </TabsTrigger>
            </TabsList>

            {currentPlan && (
              <TabsContent value="current-plan">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>You are currently on the {currentPlan.name} plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300">
                            {currentPlan.name} Plan
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Billed {currentPlan.billingCycle}
                          </p>
                        </div>
                        <Badge className="bg-blue-600 hover:bg-blue-600/80">{currentPlan.status}</Badge>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Start Date</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                            {new Date(currentPlan.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Next Billing Date</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                            {new Date(currentPlan.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-300">Amount</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                            NPR {currentPlan.price}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-blue-600 dark:text-blue-300">Features</h4>
                        <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          {plans[currentPlan.billingCycle]
                            .find((p) => p.id === getPlanId(currentPlan))
                            ?.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-300" />
                                {feature}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/contact")}
                        className="bg-white/10 dark:bg-slate-950/10 border-slate-200/30 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl transition-all duration-300"
                      >
                        Contact Support
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => toast({ title: "Subscription Cancelled", description: "Your subscription has been cancelled." })}
                        className="bg-red-600/80 hover:bg-red-700/80 border border-white/20 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
                      >
                        Cancel Subscription
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            <TabsContent value="plans">
              <div className="flex flex-col gap-8">
                <div className="flex justify-end">
                  <div className="inline-flex items-center rounded-lg border border-slate-200/30 dark:border-slate-700/30 p-1 mb-4 bg-gradient-to-r from-slate-100/20 to-slate-200/20 dark:from-slate-950/20 dark:to-slate-900/20 backdrop-blur-md">
                    <Button
                      variant={!isAnnual ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setIsAnnual(false)}
                      className={
                        !isAnnual
                          ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white rounded-xl"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={isAnnual ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setIsAnnual(true)}
                      className={
                        isAnnual
                          ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white rounded-xl"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      Annual (Save 20%)
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {plans[isAnnual ? "annual" : "monthly"].map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        className={`relative overflow-hidden rounded-3xl border shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 ${
                          plan.id === selectedPlanId
                            ? "border-blue-600 dark:border-blue-300"
                            : plan.name === "Pro"
                            ? "bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30"
                            : "bg-gradient-to-br from-slate-100/20 to-slate-200/20 dark:from-slate-950/20 dark:to-slate-900/20 border-slate-200/30 dark:border-slate-700/30"
                        } backdrop-blur-md`}
                      >
                        {plan.name === "Pro" && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg shadow-lg">
                            Popular
                          </div>
                        )}
                        {currentPlan?.id === plan.id && (
                          <div className="absolute top-8 right-0 bg-blue-600/80 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg shadow-lg">
                            Current
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-300">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">NPR {plan.price}</span>
                            <span className="text-slate-600 dark:text-slate-300">/{plan.billingCycle}</span>
                          </div>
                          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-300" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white border border-white/20 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
                            variant={currentPlan?.id === getPlanId(currentPlan) && currentPlan?.id === plan.id ? "outline" : "default"}
                            onClick={() => setSelectedPlanId(plan.id)}
                            disabled={currentPlan?.id === getPlanId(currentPlan) && currentPlan?.id === plan.id}
                          >
                            {currentPlan?.id === getPlanId(currentPlan) && currentPlan?.id === plan.id ? "Current Plan" : "Select Plan"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {selectedPlan && selectedPlan.id !== getPlanId(currentPlan) && selectedPlan.price > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="mt-6 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
                      <CardHeader>
                        <CardTitle>Confirm Payment</CardTitle>
                        <CardDescription>
                          Proceed with your {selectedPlan.name} ({selectedPlan.billingCycle}) subscription.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Alert>
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          <AlertTitle>Important</AlertTitle>
                          <AlertDescription className="text-slate-600 dark:text-slate-300">
                            Your subscription will be updated immediately. You will be charged NPR {selectedPlan.price} on
                            your next billing date.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white border border-white/20 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
                          onClick={() => handlePayment(selectedPlan)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              Processing <Loader2 className="ml-2 h-5 w-5 animate-spin text-blue-300" />
                            </>
                          ) : (
                            <>
                              Pay with eSewa <CreditCard className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="invoices">
              <Card className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View and download your past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between rounded-lg border p-4 bg-gradient-to-br from-slate-100/10 to-slate-200/10 dark:from-slate-950/10 dark:to-slate-900/10"
                      >
                        <div>
                          <div className="font-medium text-blue-600 dark:text-blue-300">{invoice.id}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">{invoice.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-blue-600 dark:text-blue-300">{invoice.amount}</div>
                            <div className="text-sm text-blue-600 dark:text-blue-300">{invoice.status}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
                          >
                            <Download className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 dark:bg-slate-950/10 border-slate-200/30 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl transition-all duration-300"
                  >
                    <FileText className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-300" />
                    Download All Invoices
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <SiteFooter />
    </div>
  );
}