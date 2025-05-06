"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, CreditCard, Download, FileText, Info, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { SiteFooter } from "@/components/site-footer"

const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be 16 digits." })
    .max(19, { message: "Card number must not exceed 19 digits." }),
  cardName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  expiryMonth: z.string().min(1, { message: "Required" }),
  expiryYear: z.string().min(1, { message: "Required" }),
  cvc: z.string().min(3, { message: "CVC must be 3-4 digits." }).max(4, { message: "CVC must be 3-4 digits." }),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

export default function SubscriptionPage() {
  const router = useRouter()
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

  function onSubmit(data: PaymentFormValues) {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Payment successful",
        description: "Your subscription has been updated.",
      })
      router.push("/dashboard")
    }, 2000)
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic features for students and casual users.",
      price: { monthly: 0, annual: 0 },
      features: [
        "5 document uploads per month",
        "Basic AI chat assistance",
        "Standard visualizations",
        "1 learning path",
      ],
      current: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for serious learners.",
      price: { monthly: 12.99, annual: 129.99 },
      features: [
        "50 document uploads per month",
        "Advanced AI chat assistance",
        "All visualization types",
        "Unlimited learning paths",
        "Priority support",
      ],
      current: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Complete access for professionals and educators.",
      price: { monthly: 29.99, annual: 299.99 },
      features: [
        "Unlimited document uploads",
        "Premium AI models",
        "Advanced analytics",
        "Team collaboration features",
        "API access",
        "Dedicated support",
      ],
      current: false,
    },
  ]

  const invoices = [
    {
      id: "INV-001",
      date: "May 1, 2023",
      amount: "$12.99",
      status: "Paid",
    },
    {
      id: "INV-002",
      date: "Apr 1, 2023",
      amount: "$12.99",
      status: "Paid",
    },
    {
      id: "INV-003",
      date: "Mar 1, 2023",
      amount: "$12.99",
      status: "Paid",
    },
    {
      id: "INV-004",
      date: "Feb 1, 2023",
      amount: "$12.99",
      status: "Paid",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8 pb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
            <p className="text-muted-foreground">Manage your subscription plan and billing information.</p>
          </div>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="flex flex-col gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>You are currently on the Pro plan.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">Billed monthly</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Next billing date</span>
                        <span className="text-sm font-medium">June 1, 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Amount</span>
                        <span className="text-sm font-medium">$12.99</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => router.push("/contact")}>
                      Contact Support
                    </Button>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </CardFooter>
                </Card>

                <div className="flex justify-end">
                  <div className="inline-flex items-center rounded-lg border p-1 mb-4">
                    <Button variant={!isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(false)}>
                      Monthly
                    </Button>
                    <Button variant={isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(true)}>
                      Annual (Save 20%)
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={`relative ${selectedPlan === plan.id ? "border-primary" : ""}`}>
                      {plan.current && (
                        <div className="absolute -top-3 left-0 right-0 flex justify-center">
                          <Badge className="bg-primary hover:bg-primary">Current Plan</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-3xl font-bold">
                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {plan.price.monthly > 0 ? (isAnnual ? "/year" : "/month") : ""}
                          </span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={plan.current ? "outline" : "default"}
                          onClick={() => setSelectedPlan(plan.id)}
                          disabled={plan.current}
                        >
                          {plan.current ? "Current Plan" : "Select Plan"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {selectedPlan !== "free" && selectedPlan !== plans.find((p) => p.current)?.id && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>Enter your payment details to change your subscription.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input {...field} placeholder="1234 5678 9012 3456" className="pl-10" />
                                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on Card</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="John Doe" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name="expiryMonth"
                                render={({ field }) => (
                                  <FormItem className="col-span-1">
                                    <FormLabel>Expiry Month</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {months.map((month) => (
                                          <SelectItem key={month} value={month}>
                                            {month}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="expiryYear"
                                render={({ field }) => (
                                  <FormItem className="col-span-1">
                                    <FormLabel>Expiry Year</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {years.map((year) => (
                                          <SelectItem key={year} value={year}>
                                            {year}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="cvc"
                                render={({ field }) => (
                                  <FormItem className="col-span-1">
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="123" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Important</AlertTitle>
                            <AlertDescription>
                              Your subscription will be updated immediately. You will be charged the new rate on your
                              next billing date.
                            </AlertDescription>
                          </Alert>
                          <Button type="submit" className="w-full" disabled={isProcessing}>
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>Update Subscription</>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods and billing address.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <RadioGroup defaultValue="card1">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card1" id="card1" />
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-5 w-5 text-muted-foreground" />
                              <label htmlFor="card1" className="font-medium">
                                •••• •••• •••• 4242
                              </label>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">Expires 04/2025</div>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                    <div className="rounded-lg border p-4">
                      <p>John Doe</p>
                      <p>123 Main Street</p>
                      <p>Apt 4B</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                    </div>
                    <Button variant="outline" className="mt-4">
                      Update Billing Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View and download your past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">{invoice.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div>{invoice.amount}</div>
                            <div className="text-sm text-green-600">{invoice.status}</div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download All Invoices
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
