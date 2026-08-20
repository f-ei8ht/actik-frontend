"use client"

import { ArrowRight, Activity, Bell, History, Radar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RepoProviderIcon } from "@/components/repo-provider-icon"
import { detectRepoHost, validateRepo } from "@/lib/repo"

const SCANS = [
  { icon: Radar, label: "Blast radius", url: "/scan" },
  { icon: Activity, label: "Worm simulation", url: "/packages" },
  { icon: History, label: "Time travel", url: "/packages" },
  { icon: Bell, label: "Live watch", url: "/watch" },
]

export function Scanner() {
  const router = useRouter()
  const [repo, setRepo] = useState("")
  const [error, setError] = useState<string | null>(null)

  const host = detectRepoHost(repo)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = repo.trim()
    const invalid = validateRepo(value)
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    router.push(`/scan?repo=${encodeURIComponent(value)}`)
  }

  return (
    <section id="scanner" className="border-t border-border/40">
      <div className="px-6 py-28 text-center lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Open source first
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
          Point it at a public repository.
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
              className="mx-auto flex w-full max-w-xl flex-col items-center gap-3"
            >
              <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    {host && <RepoProviderIcon host={host} className="size-5" />}
                  </span>
                  <Input
                    value={repo}
                    onChange={(event) => {
                      setRepo(event.target.value)
                      if (error) setError(null)
                    }}
                    placeholder="enter your GitHub or GitLab public repo"
                    className={`w-full ${host ? "pl-11" : ""}`}
                  />
                </div>
                <Button type="submit" className="shrink-0">
                  Scan
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
              {error && (
                <p className="w-full text-left text-sm text-destructive">
                  {error}
                </p>
              )}
            </form>

            <p className="text-sm text-muted-foreground">
              Currently works with GitHub and GitLab public repositories only.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {SCANS.map((scan) => (
                <Link key={scan.label} href={scan.url}>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <scan.icon data-icon="inline-start" />
                    {scan.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}