"use client"

import { ArrowLeft, Bell, RefreshCw, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Suspense, useCallback, useEffect, useState } from "react"

import { PageFrame } from "@/components/page-frame"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SeverityBadge } from "@/components/scan/severity-badge"
import { getRecentIncidents, getWatchStatus, runLiveWatch } from "@/lib/api"
import type { Incident, WatchStatus } from "@/lib/types"

export default function WatchPage() {
  return (
    <Suspense fallback={<WatchLoading />}>
      <WatchClient />
    </Suspense>
  )
}

function WatchLoading() {
  return (
    <PageFrame>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="shimmer text-sm text-muted-foreground">
          Loading live watch&hellip;
        </p>
        <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-4 h-10 w-64 rounded-full" />
      </div>
    </PageFrame>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 px-4 py-3 text-center">
      <div className="text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function WatchClient() {
  const [status, setStatus] = useState<WatchStatus | null>(null)
  const [incidents, setIncidents] = useState<Incident[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [watch, incidentList] = await Promise.all([
        getWatchStatus(),
        getRecentIncidents(20),
      ])
      setStatus(watch)
      setIncidents(incidentList)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleRun = async () => {
    setRunning(true)
    setError(null)
    try {
      const watch = await runLiveWatch()
      setStatus(watch)
      const incidentList = await getRecentIncidents(20)
      setIncidents(incidentList)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

  return (
    <PageFrame>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Live watch
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Polls OSV for every version your scanned apps resolve and records
              newly-flagged advisories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/scan">
              <Button variant="outline" size="sm">
                <ArrowLeft data-icon="inline-start" />
                Back to scan
              </Button>
            </Link>
            <Button onClick={handleRun} disabled={running} size="sm">
              <RefreshCw data-icon="inline-start" className={running ? "animate-spin" : ""} />
              {running ? "Running&hellip;" : "Run watch"}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Watch failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Last run"
            value={status?.lastRunAt ? new Date(status.lastRunAt).toLocaleString() : "Never"}
          />
          <StatCard
            label="Versions checked"
            value={status ? String(status.lastChecked) : "—"}
          />
          <StatCard
            label="New alerts"
            value={status ? String(status.lastNew) : "—"}
          />
          <StatCard
            label="Existing"
            value={status ? String(status.lastExisting) : "—"}
          />
        </div>

        {status?.lastError && (
          <Alert variant="destructive">
            <AlertTitle>Last run errored</AlertTitle>
            <AlertDescription>{status.lastError}</AlertDescription>
          </Alert>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            Recent incidents
          </h2>
          {!incidents ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : incidents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <Bell className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No alerts recorded yet. Run a watch to detect new advisories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {incidents.map((incident) => (
                <IncidentCard key={`${incident.advisoryId}-${incident.package}@${incident.version}`} incident={incident} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageFrame>
  )
}

function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={incident.severity} />
            <span className="text-sm font-semibold text-foreground">
              {incident.package}@{incident.version}
            </span>
            <Badge variant="outline">{incident.ecosystem || "npm"}</Badge>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {incident.firstSeenAt
              ? new Date(incident.firstSeenAt).toLocaleString()
              : ""}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{incident.summary}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldAlert className="size-3.5" />
            {incident.advisoryId}
          </span>
          {incident.fixedVersion && <span>fix: {incident.fixedVersion}</span>}
          {incident.repositories.length > 0 && (
            <span>
              {incident.repositories.length} repo
              {incident.repositories.length === 1 ? "" : "s"}
            </span>
          )}
          {incident.lockfiles.length > 0 && (
            <span>
              {incident.lockfiles.length} lockfile
              {incident.lockfiles.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {incident.exposurePath.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {incident.exposurePath.map((step, index) => (
              <span key={index} className="inline-flex items-center gap-1">
                {index > 0 && <span className="text-border">→</span>}
                <span className="rounded bg-muted px-1.5 py-0.5">{step}</span>
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
