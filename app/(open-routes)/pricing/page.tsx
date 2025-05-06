import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
  return (
  

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground text-lg md:text-xl mb-8">
              Choose the plan that's right for you and start learning smarter today
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="monthly" className="w-full max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <Card className="border shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Free</CardTitle>
                      <CardDescription>For casual learners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>5 document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Basic AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Simple visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>100 AI messages/month</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="border shadow-xl relative bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                      Popular
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Pro</CardTitle>
                      <CardDescription>For dedicated students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$12</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>50 document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Advanced AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Interactive visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>1,000 AI messages/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Learning analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Voice interaction</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full">Subscribe Now</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="border shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Premium</CardTitle>
                      <CardDescription>For power users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$29</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Unlimited document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Premium AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Advanced visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Unlimited AI messages</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Comprehensive analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Custom learning paths</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full">
                          Subscribe Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="annual" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <Card className="border shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Free</CardTitle>
                      <CardDescription>For casual learners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground ml-1">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>5 document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Basic AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Simple visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>100 AI messages/month</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="border shadow-xl relative bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                      Popular
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Pro</CardTitle>
                      <CardDescription>For dedicated students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$115</span>
                        <span className="text-muted-foreground ml-1">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>50 document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Advanced AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Interactive visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>1,000 AI messages/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Learning analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Voice interaction</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full">Subscribe Now</Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="border shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Premium</CardTitle>
                      <CardDescription>For power users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">$279</span>
                        <span className="text-muted-foreground ml-1">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Unlimited document uploads</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Premium AI tutoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Advanced visualizations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Unlimited AI messages</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Comprehensive analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Custom learning paths</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full">
                          Subscribe Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* FAQ Item 1 */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I switch plans later?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your
                  next billing cycle.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Is there a refund policy?
                </h3>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our
                  support team.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and select regional payment methods. All payments are
                  securely processed.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Do you offer discounts for students?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 50% discount for verified students. Contact our support team with your student ID for
                  verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-[900px] mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Ready to Start Learning Smarter?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Choose the plan that works for you and begin your AI-powered learning journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

   
  )
}
