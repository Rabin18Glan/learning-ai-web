

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Provider } from 'react-redux';
import { store } from '@/store/store';


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduSense AI - Your Personal AI Tutor",
  description: "Learn smarter with AI-powered tutoring and document analysis",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <Providers>
       
          {children}
       
      
        </Providers>
      </body>
    </html>
  )
}
