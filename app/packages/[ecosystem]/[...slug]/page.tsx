"use client"

import { AlertTriangle, ExternalLink, Search } from "lucide-react"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { BackLink } from "@/components/back-link"
import { PageFrame } from "@/components/page-frame"
import { BlastGraph } from "@/components/scan/blast-graph"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SeverityBadge } from "@/components/scan/severity-badge"
import { TimeTravel } from "@/components/scan/time-travel"
import { WormSimulation } from "@/components/scan/worm-simulation"
import { getDependencyGraph } from "@/lib/api"
import { advisoryUrl } from "@/lib/advisory"
import { investigationKey, useInvestigationStore } from "@/lib/stores/investigations"
import type { DependencyGraph } from "@/lib/types"

export default function PackagePage() {
  return (
    <Suspense fallback={<PackageLoading />}>
      <PackageClient />
    </Suspense>
  )
}

function PackageLoading() {
  return (
    <PageFrame>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="shimmer text-sm text-muted-foreground">
          Investigating package&hellip;
        </p>
        <div className="mt-6 flex w-full max-w-3xl flex-col gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    </PageFrame>
  )
}

function PackageClient() {
  const params = useParams<{ ecosystem: string; slug: string[] }>()
  const slug = Array.isArray(params.slug) ? params.slug : []
  const last = slug[slug.length - 1] ?? ""
  const hasVersion = /^\d/.test(last)
  const version = hasVersion ? last : ""
  const name = hasVersion ? slug.slice(0, -1).join("/") : slug.join("/")
  const ecosystem = params.ecosystem ?? ""
  const key = investigationKey(ecosystem, name, version)

  const load = useInvestigationStore((state) => state.load)
  const result = useInvestigationStore((state) => state.get(key))
  const loading = useInvestigationStore((state) => state.isPending(key))
  const error = useInvestigationStore((state) => state.getError(key))

  useEffect(() => {
    if (!name) return
    load(key, ecosystem, name, version).catch(() => {
      // Error is stored in the store and surfaced via getError(key).
    })
  }, [key, ecosystem, name, version, load])

  const [graph, setGraph] = useState<DependencyGraph | null>(null)
  const resolvedVersion = result?.version ?? version

  useEffect(() => {
    if (!name || !resolvedVersion) return
    let cancelled = false
    getDependencyGraph(ecosystem, name, resolvedVersion)
      .then((data) => {
        if (!cancelled) setGraph(data)
      })
      .catch(() => {
        if (!cancelled) setGraph(null)
      })
    return () => {
      cancelled = true
    }
  }, [ecosystem, name, resolvedVersion])

  if (loading) return <PackageLoading />

  if (error) {
    return (
      <PageFrame>
        <div className="mx-auto max-w-lg py-20">
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Investigation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <BackLink />
          </div>
        </div>
      </PageFrame>
    )
  }

  if (!result) return null

  return (
    <PageFrame>
      <div className="flex flex-col gap-10">
        <div>
        <BackLink />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            <span className="font-mono">{result.package}</span>
            <span className="text-destructive">@{result.version}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.ecosystem}
          </p>
        </div>

        {result.recommendations.length > 0 && (
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="gap-2">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="text-sm text-foreground/80">
                  {recommendation}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {result.advisories.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Advisories
            </h2>
            <div className="flex flex-col gap-3">
              {result.advisories.map((advisory) => {
                const url = advisoryUrl(advisory.id)
                const fix = advisory.fixedVersions[result.package]
                const introduced = advisory.introducedVersions[result.package]
                return (
                  <Card key={advisory.id} className="rounded-lg">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="font-mono text-base">
                          {advisory.id}
                        </CardTitle>
                        <SeverityBadge severity={advisory.severity} />
                      </div>
                    </CardHeader>
                    <CardContent className="gap-3">
                      <div className="text-sm leading-relaxed text-foreground/80">
                        {advisory.summary}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                          >
                            OSV entry
                            <ExternalLink data-icon="inline-end" />
                          </a>
                        )}
                        {introduced && (
                          <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                            vulnerable since {introduced}
                          </code>
                        )}
                        {fix && (
                          <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                            fixed in {fix}
                          </code>
                        )}
                      </div>
                      <TimeTravel advisoryId={advisory.id} />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {result.blastRadius && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Blast radius
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Dependents", value: result.blastRadius.count },
                { label: "Max depth", value: result.blastRadius.maxDepth },
                {
                  label: "Repositories",
                  value: result.blastRadius.affectedRepositories.length,
                },
                {
                  label: "Applications",
                  value: result.blastRadius.applications.length,
                },
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
            {result.blastRadius.affectedRepositories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.blastRadius.affectedRepositories.map((repo) => (
                  <Badge key={repo} variant="outline">
                    {repo}
                  </Badge>
                ))}
              </div>
            )}
            {graph && (
              <div className="mt-6">
                <BlastGraph data={graph} />
              </div>
            )}
          </section>
        )}

        {result.maintainerRisk.maintainers.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Maintainer risk
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {result.maintainerRisk.maintainers.map((maintainer) => (
                  <Badge key={maintainer} variant="outline">
                    {maintainer}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {result.maintainerRisk.totalPackages} other package
                {result.maintainerRisk.totalPackages === 1 ? "" : "s"} share
                these maintainers,{" "}
                {result.maintainerRisk.presentInRepositories} of which appear
                in repositories.
              </p>
            </div>
          </section>
        )}

        {result.typosquats.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Possible typosquats
            </h2>
            <div className="flex flex-col gap-2">
              {result.typosquats.map((candidate) => (
                <div
                  key={candidate.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/40 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-foreground">
                      {candidate.name}
                    </span>
                    <SeverityBadge severity={candidate.level} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      {Math.round(candidate.similarity * 100)}% similar
                    </span>
                    <span className="flex items-center gap-1">
                      <Search className="size-4" />
                      {candidate.reason}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {result.blastRadius && (
          <WormSimulation
            name={result.package}
            version={result.version}
            ecosystem={result.ecosystem}
          />
        )}
      </div>
    </PageFrame>
  )
}
