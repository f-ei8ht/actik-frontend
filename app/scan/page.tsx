"use client"

import {
  AlertTriangle,
  Check,
  RefreshCw,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { BackLink } from "@/components/back-link"
import { RepoProviderIcon } from "@/components/repo-provider-icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BreakdownChart } from "@/components/scan/breakdown-chart"
import { FindingCard } from "@/components/scan/finding-card"
import { ScoreRing } from "@/components/scan/score-ring"
import { detectRepoHost, validateRepo } from "@/lib/repo"
import { useScanStore } from "@/lib/stores/scans"

export default function ScanPage() {
  return (
    <Suspense fallback={<ScanLoading />}>
      <ScanClient />
    </Suspense>
  )
}

function ScanFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh justify-center px-4">
      <div className="flex w-full max-w-7xl flex-col border border-border/40">
        <main className="flex-1 px-6 py-12 lg:px-16">{children}</main>
      </div>
    </div>
  )
}

function ScanLoading() {
  return (
    <ScanFrame>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="shimmer text-sm text-muted-foreground">
          Scanning repository and resolving lockfiles&hellip;
        </p>
        <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-4 h-10 w-64 rounded-full" />
        <div className="mt-2 flex w-full max-w-3xl flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    </ScanFrame>
  )
}

function ScanClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const repo = searchParams.get("repo") ?? ""

  const [input, setInput] = useState(repo)
  const [error, setError] = useState<string | null>(null)

  const scan = useScanStore((state) => state.scan)
  const result = useScanStore((state) => state.getScan(repo))
  const loading = useScanStore((state) => state.getPending(repo))
  const scanError = useScanStore((state) => state.getError(repo))

  useEffect(() => {
    if (!repo) return
    scan(repo).catch(() => {
      // Error is stored in the store and surfaced via getError(repo).
    })
  }, [repo, scan])

  const rescan = (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    const invalid = validateRepo(value)
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    router.push(`/scan?repo=${encodeURIComponent(value)}`)
  }

  const repoInput = (
    <div className="relative w-full">
      {detectRepoHost(input) && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <RepoProviderIcon host={detectRepoHost(input)} className="size-5" />
        </span>
      )}
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          if (error) setError(null)
        }}
        placeholder="enter your GitHub or GitLab public repo"
        className={`w-full ${detectRepoHost(input) ? "pl-11" : ""}`}
      />
    </div>
  )

  if (!repo) {
    return (
      <ScanFrame>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
          <BackLink className="self-start" />
          <p className="text-lg font-medium text-foreground">Scan a repository</p>
          <form onSubmit={rescan} className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full items-center gap-3">
              <div className="flex-1">{repoInput}</div>
              <Button type="submit" className="shrink-0">
                Scan
              </Button>
            </div>
            {error && (
              <p className="w-full text-left text-sm text-destructive">{error}</p>
            )}
          </form>
          <p className="text-sm text-muted-foreground">
            Currently works with GitHub and GitLab public repositories only.
          </p>
        </div>
      </ScanFrame>
    )
  }

  if (loading) return <ScanLoading />

  if (scanError) {
    return (
      <ScanFrame>
        <div className="mx-auto max-w-lg py-20">
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Scan failed</AlertTitle>
            <AlertDescription>{scanError}</AlertDescription>
          </Alert>
          <div className="mt-6 flex items-center gap-3">
            <BackLink />
            <form onSubmit={rescan} className="flex flex-1 flex-col gap-2">
              <div className="flex w-full items-center gap-2">
                <div className="flex-1">{repoInput}</div>
                <Button type="submit" variant="outline" className="shrink-0">
                  <RefreshCw data-icon="inline-start" />
                  Retry
                </Button>
              </div>
              {error && (
                <p className="text-left text-sm text-destructive">{error}</p>
              )}
            </form>
          </div>
        </div>
      </ScanFrame>
    )
  }

  if (!result) return null

  const { exposure, fixSet, lockfiles } = result
  const score = exposure.score

  return (
    <ScanFrame>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <BackLink />
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {result.repo.label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              scanned {new Date(result.repo.scannedAt).toLocaleString()} ·{" "}
              {result.latencyMs}ms
            </p>
          </div>
          <form onSubmit={rescan} className="flex w-full max-w-sm flex-col items-stretch gap-2">
            <div className="flex w-full items-center gap-2">
              <div className="flex-1">{repoInput}</div>
              <Button type="submit" variant="outline" className="shrink-0">
                Rescan
              </Button>
            </div>
            {error && (
              <p className="text-left text-sm text-destructive">{error}</p>
            )}
          </form>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Exposure score</CardTitle>
          </CardHeader>
          <CardContent className="gap-8">
            <div className="flex flex-wrap items-center justify-center gap-10 lg:justify-start">
              <ScoreRing score={score.total} severity={score.severity} />
              <div className="flex-1 basis-56">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Severity breakdown
                </p>
                <div className="mt-3">
                  <BreakdownChart breakdown={score.breakdown} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Vulnerable", value: exposure.vulnerable },
                  { label: "Clean", value: exposure.clean },
                  { label: "Linked", value: exposure.linked },
                  { label: "Unlinked", value: exposure.unlinked.length },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border/40 px-4 py-3 text-center"
                  >
                    <div className="text-2xl font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 rounded-lg border border-border/40 px-5 py-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Vulnerable</span>: a
            resolved version with at least one known advisory.{" "}
            <span className="font-medium text-foreground">Clean</span>: no
            known advisory.{" "}
            <span className="font-medium text-foreground">Linked</span>: in the
            ingested HydraDB graph.{" "}
            <span className="font-medium text-foreground">Unlinked</span>: not
            in the graph, so actik checked it live against Google OSV.
          </p>
          <p>
            Every finding is cross-checked against Google OSV and the npm /
            PyPI advisory feeds. Each advisory links to its canonical{" "}
            <a
              href="https://osv.dev"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              OSV entry
            </a>
            , so you can verify the affected range yourself.
          </p>
        </div>

        {exposure.findings.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Findings
              </h2>
              <span className="text-sm text-muted-foreground">
                {exposure.findings.length}{" "}
                {exposure.findings.length === 1 ? "advisory" : "advisories"}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {exposure.findings.map((finding, index) => (
                <FindingCard key={`${finding.advisory.id}-${index}`} finding={finding} />
              ))}
            </div>
          </section>
        )}

        {fixSet.upgrades.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Minimal fix set
            </h2>
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Minimal fix set</CardTitle>
              </CardHeader>
              <CardContent className="gap-2">
                {fixSet.upgrades.map((upgrade) => (
                  <div
                    key={`${upgrade.ecosystem}:${upgrade.package}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">
                        {upgrade.package}{" "}
                        <span className="text-destructive">{upgrade.from}</span>
                        <span className="text-muted-foreground"> → </span>
                        <span className="text-primary">{upgrade.to}</span>
                      </span>
                      {upgrade.verified && (
                        <Badge variant="outline" className="gap-1 border-transparent bg-primary/10 text-primary">
                          <Check />
                          verified
                        </Badge>
                      )}
                    </div>
                    <code className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-foreground">
                      {upgrade.command}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            Lockfiles
          </h2>
          <div className="flex flex-col gap-2">
            {lockfiles.map((lockfile) => (
              <div
                key={lockfile.path}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 px-4 py-3"
              >
                <span className="font-mono text-sm text-foreground">{lockfile.path}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{lockfile.ecosystem}</span>
                  {typeof lockfile.resolved === "number" && (
                    <span>{lockfile.resolved} resolved</span>
                  )}
                  {typeof lockfile.linked === "number" && (
                    <span>{lockfile.linked} linked</span>
                  )}
                  {lockfile.status === "error" && (
                    <span className="text-destructive">{lockfile.message}</span>
                  )}
                </div>
              </div>
            ))}
            {exposure.unlinked.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {exposure.unlinked.length} resolved version
                {exposure.unlinked.length > 1 ? "s" : ""} outside the ingested
                graph
              </p>
            )}
          </div>
        </section>
      </div>
    </ScanFrame>
  )
}
