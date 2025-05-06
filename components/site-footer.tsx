import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                EduSense AI
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Transforming education with AI-powered learning tools and document analysis.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  API Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Subscribe to our newsletter</h3>
              <div className="flex max-w-md">
                <Input type="email" placeholder="Enter your email" className="rounded-r-none" />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 md:text-right">
              © {new Date().getFullYear()} EduSense AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
