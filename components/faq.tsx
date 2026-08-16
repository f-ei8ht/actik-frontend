import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "How is actik different from Snyk or Dependabot?",
    answer:
      "Most tools report a list of vulnerable packages from a static database. actik answers graph questions: which of your services are transitively exposed, which applications resolved the compromised version while it was live, and how fast a compromise spreads across your graph.",
  },
  {
    question: "What does the exposure score mean?",
    answer:
      "A 0-100 score weighted by advisory severity and the number of reachable, affected packages in your dependency graph. Critical findings drive the score up fastest.",
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
    question: "How do I fix my dependencies?",
    answer:
      "actik returns a minimal-fix set: the fewest package upgrades that clear the whole blast radius, each one verified by re-traversing HydraDB to confirm the target version resolves to zero advisories.",
  },
  {
    question: "Which hosts can I scan?",
    answer:
      "GitHub, GitLab, Bitbucket, and Codeberg. actik reads the lockfiles directly from the repository, so there is no cloning, no API token, and no setup.",
  },
  {
    question: "Where does HydraDB come in?",
    answer:
      "Everything actik does runs on a graph inside HydraDB: which package versions depend on each other, which versions an advisory affects, and which repositories resolved them. Blast radius, time travel and worm propagation are graph traversals, questions a vector or relational database structurally cannot answer.",
  },
]

export function Faq() {
  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-28 lg:px-16">
        <div className="mx-auto max-w-2xl text-left">
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
  )
}
