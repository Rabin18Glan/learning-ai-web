"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, Check, CreditCard, Edit, Loader2, Lock, Save, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { SiteFooter } from "@/components/site-footer"

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.string().min(1, { message: "This field is required" }).email("This is not a valid email."),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "AI enthusiast and lifelong learner. Using EduSense AI to expand my knowledge in machine learning and data science.",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    })
    passwordForm.reset()
  }

  function handleAvatarUpload() {
    setIsUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8 pb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} className="max-w-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" disabled={!isEditing} className="max-w-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} className="max-w-md" />
                              </FormControl>
                              <FormDescription>
                                Brief description for your profile. Maximum 160 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {isEditing && <Button type="submit">Save Changes</Button>}
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Avatar</CardTitle>
                    <CardDescription>Click on the avatar to upload a custom one from your files.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <div className="relative mb-6">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile picture" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0">
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleAvatarUpload}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Premium Plan</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t px-6 py-4">
                    <div className="text-xs text-muted-foreground">
                      Member since <strong>May 2023</strong>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/subscription")}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscription
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your activity and usage statistics.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Documents</h4>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">4 uploaded this month</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Chat Sessions</h4>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">32 in the last 7 days</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Learning Hours</h4>
                      <div className="text-2xl font-bold">47.5</div>
                      <p className="text-xs text-muted-foreground">8.2 hours this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="max-w-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="max-w-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="max-w-md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">
                          <Lock className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-1 text-center font-medium">Two-factor authentication</h3>
                    <p className="mb-4 text-center text-sm text-muted-foreground">
                      Enhance your account security by enabling two-factor authentication.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Enable 2FA</Button>
                  </CardFooter>
                </Card>
              </div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                  <CardDescription>Manage your active sessions across devices.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Windows • Chrome • New York, USA</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Active now</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-muted-foreground">iOS • EduSense App • New York, USA</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Sign Out All Other Sessions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and activities on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[
                      {
                        action: "Document Upload",
                        item: "Machine Learning Basics.pdf",
                        date: "Today at 10:30 AM",
                      },
                      {
                        action: "Chat Session",
                        item: "Asked questions about neural networks",
                        date: "Yesterday at 3:45 PM",
                      },
                      {
                        action: "Visualization Created",
                        item: "Knowledge graph for Data Science concepts",
                        date: "May 12, 2023 at 2:15 PM",
                      },
                      {
                        action: "Learning Path Started",
                        item: "Advanced Python for Data Science",
                        date: "May 10, 2023 at 9:20 AM",
                      },
                      {
                        action: "Quiz Completed",
                        item: "Fundamentals of Machine Learning",
                        date: "May 8, 2023 at 4:30 PM",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.action}</h4>
                          <span className="text-sm text-muted-foreground">{activity.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.item}</p>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
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
