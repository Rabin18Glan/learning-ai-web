import Link from "next/link"


function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} EduSense AI. All rights reserved.
      </p>
      <div className="flex gap-4">
        <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
          Terms
        </Link>
        <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
          Privacy
        </Link>
        <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
          Contact
        </Link>
      </div>
    </div>
  </footer>
  )
}

export default Footer