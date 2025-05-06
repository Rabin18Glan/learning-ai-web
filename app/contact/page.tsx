"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Mail, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    submitted: false,
    loading: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState({ ...formState, loading: true })

    // Simulate form submission
    setTimeout(() => {
      setFormState({
        ...formState,
        submitted: true,
        loading: false,
      })

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })
    }, 1500)
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Contact Us</h1>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact
          information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {formState.submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Thank you for reaching out. We'll respond to your inquiry shortly.
                  </p>
                  <Button
                    onClick={() =>
                      setFormState({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                        submitted: false,
                        loading: false,
                      })
                    }
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={(value) => setFormState({ ...formState, subject: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feedback">Product Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={5}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            {!formState.submitted && (
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={formState.loading}>
                  {formState.loading ? "Sending..." : "Send Message"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    <a href="mailto:info@edusense.ai" className="hover:underline">
                      info@edusense.ai
                    </a>
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    <a href="mailto:support@edusense.ai" className="hover:underline">
                      support@edusense.ai
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    <a href="tel:+1-800-123-4567" className="hover:underline">
                      +1 (800) 123-4567
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monday - Friday, 9am - 5pm PST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Office</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    123 Innovation Way
                    <br />
                    San Francisco, CA 94107
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">What are your business hours?</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Our support team is available Monday through Friday from 9am to 5pm Pacific Time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">How quickly do you respond to inquiries?</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  We aim to respond to all inquiries within 24 business hours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Do you offer educational discounts?</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Yes! We offer special pricing for educational institutions. Please contact our sales team for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
