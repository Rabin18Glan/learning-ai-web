import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { FileUpload } from "@/components/file-upload"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const metadata: Metadata = {
  title: "Upload Document | EduSense AI",
  description: "Upload a new document to your learning library",
}

export default async function UploadPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground">Add new learning materials to your library</p>
      </div>

      <div className="grid gap-8">
        <FileUpload />
      </div>
    </div>
  )
}
