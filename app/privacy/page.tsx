import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="space-y-2 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Last updated: April 29, 2025
        </p>
      </div>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
        <p>
          At EduSense AI ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
          our website, applications, and services (collectively, the "Services").
        </p>
        <p>
          Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
          do not access or use our Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
        <h3 className="text-xl font-bold mt-6 mb-3">2.1 Personal Data</h3>
        <p>
          We may collect personal information that you voluntarily provide to us when you register for an account,
          express interest in obtaining information about us or our Services, or otherwise contact us. The personal
          information we collect may include:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Password</li>
          <li>Educational background</li>
          <li>Learning preferences</li>
          <li>Profile information</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">2.2 Usage Data</h3>
        <p>
          We automatically collect certain information when you visit, use, or navigate our Services. This information
          does not reveal your specific identity but may include:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Device and browser information</li>
          <li>IP address</li>
          <li>Usage patterns and preferences</li>
          <li>Time spent on pages</li>
          <li>Referring URLs</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">2.3 User Content</h3>
        <p>
          We collect and store the documents, messages, and other content that you upload, submit, or create while using
          our Services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including to:</p>
        <ul className="list-disc pl-6 my-4">
          <li>Provide, maintain, and improve our Services</li>
          <li>Process and complete transactions</li>
          <li>Send administrative information, such as updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
          <li>Detect, prevent, and address technical issues</li>
          <li>Protect against harmful or unlawful activity</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Share Your Information</h2>
        <p>We may share your information in the following situations:</p>
        <ul className="list-disc pl-6 my-4">
          <li>
            <strong>With Service Providers:</strong> We may share your information with third-party vendors, service
            providers, contractors, or agents who perform services for us.
          </li>
          <li>
            <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during
            negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our
            business.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may disclose your information for any other purpose with your
            consent.
          </li>
          <li>
            <strong>Legal Obligations:</strong> We may disclose your information where required to do so by law or in
            response to valid requests by public authorities.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to protect the
          security of any personal information we process. However, please also remember that we cannot guarantee that
          the internet itself is 100% secure.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Retention</h2>
        <p>
          We will retain your personal information only for as long as is necessary for the purposes set out in this
          Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal
          obligations, resolve disputes, and enforce our policies.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Privacy Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
        <ul className="list-disc pl-6 my-4">
          <li>The right to access the personal information we have about you</li>
          <li>The right to request that we correct or update any personal information we have about you</li>
          <li>The right to request that we delete any personal information we have about you</li>
          <li>The right to opt-out of marketing communications</li>
        </ul>
        <p>To exercise these rights, please contact us using the contact information provided below.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
        <p>
          Our Services are not intended for children under the age of 13. We do not knowingly collect personal
          information from children under 13. If you are a parent or guardian and you believe your child has provided us
          with personal information, please contact us.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p className="mt-2">
          Email: privacy@edusense.ai
          <br />
          Or through our contact form.
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
