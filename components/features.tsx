import {
  Activity,
  Bell,
  History,
  Network,
  Radar,
  ShieldCheck,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    icon: Radar,
    title: "Blast radius in seconds",
    description:
      "Paste any repository and see exactly which of your services resolve a compromised version, through a transitive reverse-dependency closure.",
  },
  {
    icon: Network,
    title: "Transitive exposure paths",
    description:
      "The exact repository to lockfile to package chain that leads back to the bad version, not just a package list.",
  },
  {
    icon: History,
    title: "Time travel",
    description:
      "Which applications resolved the compromised version while the advisory was live? Replay the graph as-of any date.",
  },
  {
    icon: Activity,
    title: "Worm-speed simulation",
    description:
      "Compromised at 09:00, know which services are exposed by 09:06 with per-hop propagation timing.",
  },
  {
    icon: Bell,
    title: "Live watch",
    description:
      "Poll OSV for every scanned version and get first-seen alerts, each with its exposure path.",
  },
  {
    icon: ShieldCheck,
    title: "Proven fixes",
    description:
      "The fewest upgrades that clear the blast radius, each verified by re-traversing HydraDB.",
  },
]

export function Features() {
  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-28 lg:px-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="rounded-lg border-none">
              <CardContent>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
