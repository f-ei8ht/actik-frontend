import { BackLink } from "@/components/back-link"

import { PageFrame } from "@/components/page-frame"

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: "actik scans public repositories you submit and reads their lockfiles to resolve dependency versions. We do not require an account and we do not collect personal information beyond what is necessary to provide the service. We may collect basic analytics such as pages visited and request metadata to operate and improve the service.",
  },
  {
    title: "2. How we use information",
    body: "The data you submit is used to perform dependency and supply-chain analysis, return scan results, and improve the product. We do not sell your personal information.",
  },
  {
    title: "3. Third-party services",
    body: "actik relies on third-party services such as HydraDB, Google OSV, npm, and PyPI to resolve and verify dependency data. These services have their own privacy policies. We are not responsible for their practices.",
  },
  {
    title: "4. Data retention",
    body: "Scan inputs and results may be retained for the duration needed to provide and improve the service, and to support security research. We delete data when it is no longer needed for these purposes.",
  },
  {
    title: "5. Your rights",
    body: "Where applicable, you may request access to, correction of, or deletion of personal data we hold about you by contacting us at the email address listed below.",
  },
  {
    title: "6. Security",
    body: "We take reasonable measures to protect the information we process. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "7. Changes to this policy",
    body: "We may update this Privacy Policy from time to time. Material changes will be reflected on this page. Your continued use of actik after changes constitutes acceptance of the updated policy.",
  },
]

export default function PrivacyPage() {
  return (
    <PageFrame>
      <BackLink />

      <h1 className="mt-6 font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
        Privacy Policy
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
        Questions about this policy? Contact us at{" "}
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