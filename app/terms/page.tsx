import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Last updated: April 29, 2025
        </p>
      </div>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to EduSense AI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use
          of the EduSense AI website, applications, and services (collectively, the "Services").
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms,
          you may not access or use the Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Using Our Services</h2>
        <h3 className="text-xl font-bold mt-6 mb-3">2.1 Account Registration</h3>
        <p>
          To access certain features of the Services, you may be required to register for an account. You agree to
          provide accurate, current, and complete information during the registration process and to update such
          information to keep it accurate, current, and complete.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">2.2 Account Security</h3>
        <p>
          You are responsible for safeguarding your password and for all activities that occur under your account. You
          agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Content and Intellectual Property</h2>
        <h3 className="text-xl font-bold mt-6 mb-3">3.1 Your Content</h3>
        <p>
          You retain ownership of any content that you upload, submit, or display on or through the Services ("Your
          Content"). By uploading Your Content, you grant us a worldwide, non-exclusive, royalty-free license to use,
          reproduce, modify, adapt, publish, translate, and distribute Your Content in connection with providing and
          improving the Services.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">3.2 Our Content</h3>
        <p>
          The Services and all content, features, and functionality thereof, including but not limited to all
          information, software, text, displays, images, video, and audio, and the design, selection, and arrangement
          thereof (collectively, "Our Content"), are owned by us, our licensors, or other providers and are protected by
          copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Prohibited Uses</h2>
        <p>
          You may use the Services only for lawful purposes and in accordance with these Terms. You agree not to use the
          Services:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
          <li>
            To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail,"
            "chain letter," "spam," or any other similar solicitation.
          </li>
          <li>
            To impersonate or attempt to impersonate us, our employees, another user, or any other person or entity.
          </li>
          <li>
            To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or
            which may harm us or users of the Services.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Services immediately, without prior notice or
          liability, for any reason whatsoever, including without limitation if you breach these Terms.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Disclaimer of Warranties</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
        <p>
          IN NO EVENT WILL WE, OUR AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR
          DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR
          USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to Terms</h2>
        <p>
          We may revise and update these Terms from time to time in our sole discretion. All changes are effective
          immediately when we post them. Your continued use of the Services following the posting of revised Terms means
          that you accept and agree to the changes.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">9. Governing Law</h2>
        <p>
          These Terms and any dispute or claim arising out of or related to them, their subject matter, or their
          formation shall be governed by and construed in accordance with the laws of the state of California, without
          giving effect to any choice or conflict of law provision or rule.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Information</h2>
        <p>
          Questions or comments about the Services or these Terms may be directed to us at the email address
          support@edusense.ai or through our contact form.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/contact">
          <Button variant="outline" className="mr-4">
            Contact Us
          </Button>
        </Link>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}
