import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { PageFrame } from "@/components/page-frame"

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using actik, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the service.",
  },
  {
    title: "2. Description of service",
    body: "actik scans public repositories and dependency lockfiles to help you understand the blast radius of compromised dependencies. We provide the service 'as is' and 'as available'.",
  },
  {
    title: "3. Acceptable use",
    body: "You agree not to misuse the service, attempt to gain unauthorized access, disrupt the service, or use it for any unlawful purpose. You are responsible for the repositories and data you submit for scanning.",
  },
  {
    title: "4. No warranty",
    body: "The scan results, exposure scores, and recommendations are provided for informational purposes only. actik makes no warranties, express or implied, about the accuracy, completeness, or reliability of the results. Always verify findings against authoritative sources such as OSV and your own audit.",
  },
  {
    title: "5. Limitation of liability",
    body: "To the maximum extent permitted by law, actik and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising out of or in connection with your use of the service.",
  },
  {
    title: "6. Third-party content and trademarks",
    body: "actik references third-party names, logos, and products (such as HydraDB, OSV, npm, PyPI, GitHub, GitLab, and various AI providers) for identification purposes only. These are the property of their respective owners, and are used here for identification, description, and interoperability. Their presence does not imply endorsement or affiliation, and they are not sponsored by actik. Photographs displayed on this site are used for illustrative purposes and belong to their respective owners and platforms such as Unsplash. All rights remain with their respective owners.",
  },
  {
    title: "7. Changes to terms",
    body: "We may update these Terms of Service from time to time. Continued use of actik after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    title: "8. Governing law",
    body: "These terms are governed by the laws applicable in the jurisdiction in which actik operates, without regard to conflict-of-law principles.",
  },
]

export default function TermsPage() {
  return (
    <PageFrame>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft data-icon="inline-start" />
        Back
      </Link>

      <h1 className="mt-6 font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-3 font-serif text-base leading-relaxed text-muted-foreground">
        Last updated: August 19, 2026
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-2xl rounded-lg border border-border/40 px-5 py-4 text-sm text-muted-foreground">
        Questions about these terms? Contact us at{" "}
        <a
          href="mailto:saif.khan16@outlook.com"
          className="text-primary underline-offset-2 hover:underline"
        >
          saif.khan16@outlook.com
        </a>
        .
      </div>
    </PageFrame>
  )
}