
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CheckCircle2, HelpCircle, Loader2, CreditCard } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

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
      price: 1000, // NPR (~$12 USD)
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
      price: 3000, // NPR (~$29 USD)
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
      price: 15300, // NPR (~$115 USD, 20% discount)
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
      price: 37300, // NPR (~$279 USD, 20% discount)
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

export default function PricingPage({ userId }: { userId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);

  // Fetch current plan
  useEffect(() => {
    async function fetchCurrentPlan() {
      try {
        const response = await fetch("/api/subscriptions/current");
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.plan);
        }
      } catch (error) {
        console.error("Error fetching current plan:", error);
        toast({
          title: "Error",
          description: "Failed to fetch current plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
      }
    }
    fetchCurrentPlan();
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    if (plan.price === 0) {
      router.push("/signup");
      return;
    }
    // Redirect to subscription page with plan details
    router.push(`/subscription?planId=${plan.id}&billingCycle=${plan.billingCycle}`);
  };

  if (isPageLoading) {
    return (
      <main className="flex-1 py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Skeleton className="h-12 w-64 rounded-3xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="rounded-3xl">
                    <CardHeader>
                      <Skeleton className="h-8 w-24 mb-2" />
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
                      <Skeleton className="h-10 w-full rounded-2xl" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-xl"
      >
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Simple, Transparent <span className="text-blue-600 dark:text-blue-300">Pricing</span>
          </h1>
          <p className="max-w-[800px] mx-auto text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-8">
            Choose the plan that's right for you and start learning smarter today
          </p>
          {currentPlan && (
            <p className="text-blue-600 dark:text-blue-300 font-medium">
              Current Plan: {currentPlan.name} ({currentPlan.billingCycle})
            </p>
          )}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20 bg-background"
      >
        <div className="container px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "monthly" | "annual")} className="w-full max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gradient-to-r from-slate-100/20 to-slate-200/20 dark:from-slate-950/20 dark:to-slate-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-3">
                <TabsTrigger
                  value="monthly"
                  className="py-3 px-6 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/50 data-[state=active]:to-indigo-500/50 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="annual"
                  className="py-3 px-6 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/50 data-[state=active]:to-indigo-500/50 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 dark:hover:bg-blue-900/10"
                >
                  Annual (Save 20%)
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="monthly" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.monthly.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden rounded-3xl border shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 ${
                            plan.name === "Pro"
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
                          <CardHeader className="pb-2">
                            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-300">{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <span className="text-4xl font-bold text-blue-600 dark:text-blue-300">NPR {plan.price}</span>
                              <span className="text-slate-500 dark:text-slate-400 ml-1">/{plan.billingCycle}</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                  <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => handlePlanSelect(plan)}
                              disabled={isLoading === plan.id || currentPlan?.id === plan.id}
                              className={`w-full ${
                                plan.name === "Pro"
                                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80"
                                  : "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80"
                              } text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-60`}
                            >
                              {isLoading === plan.id ? (
                                <>
                                  Processing <Loader2 className="ml-2 h-5 w-5 animate-spin text-blue-300" />
                                </>
                              ) : currentPlan?.id === plan.id ? (
                                "Current Plan"
                              ) : plan.price === 0 ? (
                                "Get Started"
                              ) : (
                                <>
                                  Select Plan <CreditCard className="ml-2 h-5 w-5" />
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annual" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.annual.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden rounded-3xl border shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 ${
                            plan.name === "Pro"
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
                          <CardHeader className="pb-2">
                            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-300">{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <span className="text-4xl font-bold text-blue-600 dark:text-blue-300">NPR {plan.price}</span>
                              <span className="text-slate-500 dark:text-slate-400 ml-1">/{plan.billingCycle}</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                  <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => handlePlanSelect(plan)}
                              disabled={isLoading === plan.id || currentPlan?.id === plan.id}
                              className={`w-full ${
                                plan.name === "Pro"
                                  ? "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80"
                                  : "bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80"
                              } text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-60`}
                            >
                              {isLoading === plan.id ? (
                                <>
                                  Processing <Loader2 className="ml-2 h-5 w-5 animate-spin text-blue-300" />
                                </>
                              ) : currentPlan?.id === plan.id ? (
                                "Current Plan"
                              ) : plan.price === 0 ? (
                                "Get Started"
                              ) : (
                                <>
                                  Select Plan <CreditCard className="ml-2 h-5 w-5" />
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-20 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-xl"
      >
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-[800px] mx-auto">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.",
              },
              {
                question: "Is there a refund policy?",
                answer: "We offer a 14-day money-back guarantee for all paid plans. Contact our support team for assistance.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept payments via eSewa for secure and convenient transactions in Nepal.",
              },
              {
                question: "Do you offer discounts for students?",
                answer: "Yes, we offer a 50% discount for verified students. Contact our support team with your student ID for verification.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="space-y-2 p-4 bg-gradient-to-br from-slate-100/10 to-slate-200/10 dark:from-slate-950/10 dark:to-slate-900/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-300">
                  <HelpCircle className="h-5 w-5" />
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="py-20 bg-background"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ready to Start Learning Smarter?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
              Choose the plan that works for you and begin your AI-powered learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
                >
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 dark:bg-slate-950/10 backdrop-blur-md border border-slate-200/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-900/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
  