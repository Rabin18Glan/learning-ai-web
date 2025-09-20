import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Unauthorized</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
          <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline mt-4 inline-block">
            Return to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}