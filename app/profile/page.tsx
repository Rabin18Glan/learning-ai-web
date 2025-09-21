"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, CreditCard, Edit, Loader2, Lock, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: z.string().email("This is not a valid email.").optional(),
  bio: z.string().max(160, { message: "Bio must not exceed 160 characters." }).optional(),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    provider: string;
    subscriptionPlan: string;
    createdAt: string;
  } | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
        form.reset({
          name: data.name,
          email: data.email,
          bio: data.bio,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    try {
      const response = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await fetch("/api/users/me/avatar", {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload avatar");
      const data = await response.json();
      setUser((prev) => (prev ? { ...prev, profilePicture: data.profilePicture } : prev));
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-10 px-4">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid gap-8 md:grid-cols-3">
            <Skeleton className="h-64 md:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20">
              <TabsTrigger value="general">General</TabsTrigger>
              {user?.provider === "credentials" && <TabsTrigger value="security">Security</TabsTrigger>}
            </TabsList>

            <TabsContent value="general">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
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
                        className={isEditing ? "bg-blue-600 hover:bg-blue-700" : ""}
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
                                <Input {...field} type="email" disabled className="max-w-md" />
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
                        {isEditing && (
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Save Changes
                          </Button>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
                  <CardHeader>
                    <CardTitle>Your Avatar</CardTitle>
                    <CardDescription>Upload a custom avatar from your files.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <div className="relative mb-6">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.profilePicture || "/placeholder.svg?height=128&width=128"} alt="Profile picture" />
                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0">
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                          disabled={isUploading}
                          asChild
                        >
                          <label>
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                          </label>
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.subscriptionPlan} Plan</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t px-6 py-4">
                    <div className="text-xs text-muted-foreground">
                      Member since{" "}
                      <strong>
                        {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/subscription")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscription
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {user?.provider === "credentials" && (
              <TabsContent value="security">
                <Card className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-700/30">
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
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          <Lock className="mr-2 h-4 w-4" />
                          Change Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}