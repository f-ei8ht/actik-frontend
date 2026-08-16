"use client"

import { Activity, Play } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { simulatePropagation } from "@/lib/api"
import type { PropagationResult } from "@/lib/types"

export function WormSimulation({
  name,
  version,
  ecosystem,
}: {
  name: string
  version: string
  ecosystem: string
}) {
  const [compromisedAt, setCompromisedAt] = useState("")
  const [perHopMs, setPerHopMs] = useState("360000")
  const [maxDepth, setMaxDepth] = useState("")
  const [result, setResult] = useState<PropagationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    if (!version) return
    setLoading(true)
    setError(null)
    try {
      const res = await simulatePropagation(name, version, ecosystem, {
        compromisedAt: compromisedAt || undefined,
        perHopMs: perHopMs ? Number(perHopMs) : undefined,
        maxDepth: maxDepth ? Number(maxDepth) : undefined,
      })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
        Worm-speed simulation
      </h2>
      <Card className="rounded-lg">
        <CardContent className="gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sim-compromisedAt">Compromised at (ISO)</Label>
              <Input
                id="sim-compromisedAt"
                value={compromisedAt}
                onChange={(e) => setCompromisedAt(e.target.value)}
                placeholder="2026-08-16T00:00:00Z"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sim-perHop">Per hop (ms)</Label>
              <Input
                id="sim-perHop"
                type="number"
                value={perHopMs}
                onChange={(e) => setPerHopMs(e.target.value)}
                placeholder="360000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sim-depth">Max depth</Label>
              <Input
                id="sim-depth"
                type="number"
                value={maxDepth}
                onChange={(e) => setMaxDepth(e.target.value)}
                placeholder="Unlimited"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={run} disabled={loading || !version} size="sm">
              <Play data-icon="inline-start" className={loading ? "animate-pulse" : ""} />
              {loading ? "Simulating&hellip;" : "Simulate"}
            </Button>
            {version && (
              <span className="font-mono text-xs text-muted-foreground">
                {name}@{version}
              </span>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Simulation failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-8 rounded" />
              ))}
            </div>
          )}

          {result && !loading && <SimulationResult result={result} />}
        </CardContent>
      </Card>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 px-3 py-2 text-center">
      <div className="text-lg font-semibold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  )
}

function formatTime(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleTimeString()
}

function SimulationResult({ result }: { result: PropagationResult }) {
  const spanMin = Math.round((result.spanMs ?? 0) / 60_000)
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total apps" value={String(result.totalApps)} />
        <Stat label="Direct" value={String(result.directApps)} />
        <Stat label="Transitive" value={String(result.transitiveApps)} />
        <Stat label="Max depth" value={String(result.maxDepth)} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Compromised at" value={formatTime(result.compromisedAt)} />
        <Stat label="First exposed" value={formatTime(result.firstExposedAt)} />
        <Stat label="Last exposed" value={formatTime(result.lastExposedAt)} />
        <Stat
          label="Span"
          value={spanMin > 0 ? `~${spanMin}m` : result.spanMs ? "<1m" : "—"}
        />
      </div>

      {result.timeline.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {result.timeline.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <span className="w-24 shrink-0 font-mono text-xs tabular-nums">
                {formatTime(point.exposedAt)}
              </span>
              <Badge variant="outline" className="w-14 shrink-0 justify-center">
                d{point.depth}
              </Badge>
              <span className="truncate">{point.repository}</span>
            </div>
          ))}
        </div>
      )}

      {result.apps.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Activity className="size-3.5" />
          <span className="mr-1">Exposure paths:</span>
          {result.apps.slice(0, 6).map((app, index) => (
            <span key={index} className="inline-flex items-center gap-1">
              {index > 0 && <span className="text-border">→</span>}
              <span className="rounded bg-muted px-1.5 py-0.5">
                {app.repository.split("/").slice(-2).join("/")}
              </span>
            </span>
          ))}
          {result.apps.length > 6 && (
            <span className="text-muted-foreground">
              +{result.apps.length - 6} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
