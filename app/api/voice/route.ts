import { type NextRequest, NextResponse } from "next/server"
import { speechToText } from "@/lib/voice-utils"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Process audio to text
    const text = await speechToText(audioFile)

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in voice API:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
