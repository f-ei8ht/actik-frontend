"use client"

import { ArrowRight, Activity, Bell, History, Radar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const SCANS = [
  { icon: Radar, label: "Blast radius" },
  { icon: Activity, label: "Worm simulation" },
  { icon: History, label: "Time travel" },
  { icon: Bell, label: "Live watch" },
]

export function Scanner() {
  const router = useRouter()
  const [repo, setRepo] = useState("")

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = repo.trim()
    if (!value) return
    router.push(`/scan?repo=${encodeURIComponent(value)}`)
  }

  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-28 text-center lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Open source first
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
          Point it at any public repository.
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-muted-foreground">
          Paste a link and actik reads the lockfiles, resolves the exact
          versions, and traces which of your services would be exposed.
        </p>

        <Card className="mx-auto mt-12 max-w-3xl rounded-2xl">
          <CardContent className="gap-6">
            <p className="text-lg font-medium text-foreground">
              Scan a repository
            </p>

            <form
              onSubmit={onSubmit}
              className="mx-auto flex w-full max-w-xl items-center gap-3"
            >
              <Input
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
                placeholder="github.com/org/repo"
                className="flex-1"
              />
              <Button type="submit" className="shrink-0">
                Scan
                <ArrowRight data-icon="inline-end" />
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Works with GitHub, GitLab, Bitbucket, and Codeberg.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {SCANS.map((scan) => (
                <Button
                  key={scan.label}
                  variant="outline"
                  size="sm"
                >
                  <scan.icon data-icon="inline-start" />
                  {scan.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
