import { getBucket } from "@/lib/bucket";
import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { id } =await  (await context).params;

    await connectToDatabase();
    const bucket = await getBucket("uploads");
    const fileId = new ObjectId(id);

    // Find file info first
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return new Response("File not found", { status: 404 });
    }

    const file = files[0];

    // Stream file
    const downloadStream = bucket.openDownloadStream(fileId);

    return new Response(downloadStream as any, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${file.filename}"`,
      },
    });
  } catch (err) {
    console.error("Error streaming file:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
