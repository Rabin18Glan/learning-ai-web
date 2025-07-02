import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  variant?: ("simple" | "vibrant")
}
function Logo({ variant }: LogoProps) {
  if (variant == "vibrant") {
    return <>
      <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        EduSense AI
      </span></>
  }
  else {
    return <div className="flex items-center gap-2 font-bold text-xl">
      <BookOpen className="h-6 w-6 text-primary" />
      <Link href="/">EduSense AI</Link>
    </div>
  }
}

export default Logo