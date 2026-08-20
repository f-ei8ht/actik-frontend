import {
  ArrowRight,
  Network,
  Radar,
  ShieldCheck,
  Timer,
  Zap,
} from "lucide-react"
import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { BackLink } from "@/components/back-link"
import { Card, CardContent } from "@/components/ui/card"
import { GraphDemo } from "@/components/how-it-works/graph-demo"
import { ScanDemo } from "@/components/how-it-works/scan-demo"
import { WatchDemo } from "@/components/how-it-works/watch-demo"
import { WormDemo } from "@/components/how-it-works/worm-demo"
import { cn } from "@/lib/utils"

const TRACK_QUESTIONS = [
  {
    icon: Radar,
    title: "What is the complete blast radius?",
    body: "Given a compromised package version, actik walks the reverse dependency closure in HydraDB and tells you every service that resolves it, directly or transitively, with the exact repository to lockfile to package chain.",
  },
  {
    icon: Network,
    title: "What are the transitive exposure paths?",
    body: "The graph stores the precise path from advisory to package to the repository that resolved it, not just a package list. Every finding is cross-checked against Google OSV, so you can verify the affected range yourself.",
  },
  {
    icon: Timer,
    title: "What was exposed while the advisory was live?",
    body: "Time travel replays the graph as-of any date and compares each scan timestamp against the advisory's published and modified window, showing which applications resolved the bad version at the moment it mattered.",
  },
  {
    icon: Zap,
    title: "How fast does a compromise spread?",
    body: "The worm-speed simulation walks the reverse dependency closure and computes exactly when each service is exposed based on its distance from the compromised package. That is the '09:00 compromised, 09:06 exposed' scenario.",
  },
  {
    icon: ShieldCheck,
    title: "What is the fewest change that clears it?",
    body: "actik returns a minimal-fix set: the smallest set of package upgrades that clears the whole blast radius, each verified by re-traversing HydraDB to confirm the target resolves to zero advisories.",
  },
]

const FAQS = [
  {
    question: "Where does HydraDB come in?",
    answer:
      "Everything actik does runs on a graph inside HydraDB: which package versions depend on each other, which versions an advisory affects, and which repositories resolved them. Blast radius, time travel and worm propagation are graph traversals, questions a vector or relational database structurally cannot answer.",
  },
  {
    question: "What is time travel?",
    answer:
      "For any advisory, actik replays the graph as-of a date and tells you which applications resolved the affected version while the advisory was live, comparing each scan's timestamp against the advisory's published and modified window.",
  },
  {
    question: "How does the worm simulation work?",
    answer:
      "Compromise a package at 09:00 and actik walks the reverse dependency closure, computing exactly when each service is exposed based on its distance from the compromised package. That is the '09:00 compromised, 09:06 exposed' scenario.",
  },
  {
    question: "Which hosts can I scan?",
    answer:
      "GitHub and GitLab, for now. actik reads the lockfiles directly from the repository, so there is no cloning, no API token, and no setup.",
  },
  {
    question: "What does the exposure score mean?",
    answer:
      "A 0-100 score weighted by advisory severity and the number of reachable, affected packages in your dependency graph. Critical findings drive the score up fastest.",
  },
  {
    question: "How is actik different from Snyk or Dependabot?",
    answer:
      "Most tools report a list of vulnerable packages from a static database. actik answers graph questions: which of your services are transitively exposed, which applications resolved the compromised version while it was live, and how fast a compromise spreads across your graph.",
  },
]

function Section({
  eyebrow,
  title,
  lede,
  demo,
  bg,
  flip = false,
}: {
  eyebrow: string
  title: string
  lede: string
  demo: React.ReactNode
  bg: string
  flip?: boolean
}) {
  return (
    <section className="border-t border-border/40">
      <div className="grid lg:grid-cols-2">
        <div
          className={cn(
            "flex flex-col justify-center px-6 py-24 lg:px-16",
            flip && "lg:order-2"
          )}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-muted-foreground">
            {lede}
          </p>
        </div>

        <div
          className={cn(
            "relative min-h-96 overflow-hidden bg-muted/50",
            flip && "lg:order-1"
          )}
        >
          <img
            src={bg}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-background/30" />
          <div className="relative flex h-full items-center justify-center p-10">
            <Card className="w-full max-w-md rounded-2xl shadow-2xl">
              <CardContent className="gap-5">{demo}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-svh justify-center px-4">
      <div className="flex w-full max-w-7xl flex-col border border-border/40">
        <main className="flex flex-1 flex-col">
          <section className="px-6 py-24 lg:px-16">
            <BackLink className="-ml-2" />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              How it works
            </p>
            <h1 className="mt-6 max-w-3xl font-newsreader text-5xl font-normal leading-tight text-foreground sm:text-6xl">
              A supply-chain graph, not a stale list.
            </h1>
            <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
              actik treats your software supply chain as what it actually is: a
              graph. Every scan, blast radius, time travel, and worm
              simulation is a traversal over that graph, powered by HydraDB.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/scan"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Scan a repository
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/packages"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Explore the graph
              </Link>
            </div>
          </section>

          <Section
            eyebrow="Step 1 · Scan"
            title="Point it at a public repository."
            lede="actik reads the lockfiles directly from GitHub or GitLab. No cloning, no API token, no setup."
            bg="/art.jpg"
            demo={<ScanDemo />}
          />

          <Section
            flip
            eyebrow="Step 2 · The graph"
            title="Every dependency is an edge."
            lede="Advisories affect package versions, versions depend on each other, and applications resolve them. actik stores all of this in HydraDB and traverses it, not a flat database."
            bg="/boston.jpg"
            demo={<GraphDemo />}
          />

          <Section
            eyebrow="Step 3 · Keep watching"
            title="Know the moment something goes live."
            lede="Poll OSV for every scanned version and get first-seen alerts, each with its exposure path, the instant a dependency is flagged."
            bg="/cloud.jpg"
            demo={<WatchDemo />}
          />

          <Section
            flip
            eyebrow="Step 4 · Propagation"
            title="Watch a compromise spread in real time."
            lede="Simulate a package being compromised at a moment in time and see exactly which services get exposed, and when, as a per-hop graph traversal."
            bg="/field.jpg"
            demo={<WormDemo />}
          />

          <section className="border-t border-border/40">
            <div className="px-6 py-24 lg:px-16">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Questions the graph answers
              </p>
              <h2 className="mt-4 max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
                The tracking questions.
              </h2>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {TRACK_QUESTIONS.map((item) => (
                  <Card key={item.title} className="rounded-lg border-none">
                    <CardContent>
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="size-5" />
                      </span>
                      <h3 className="mt-4 text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="border-t border-border/40">
            <div className="px-6 py-24 lg:px-16">
              <div className="mx-auto max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  FAQ
                </p>
                <h2 className="mt-4 font-newsreader text-4xl font-normal text-foreground sm:text-5xl">
                  Common questions
                </h2>
                <Accordion className="mt-10 border-t border-border/40">
                  {FAQS.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-border/40"
                    >
                      <AccordionTrigger className="cursor-pointer items-center text-base hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="leading-relaxed text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}