"use client"

import { History } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { getExposureWindow } from "@/lib/api"
import type { ExposureWindowResult } from "@/lib/types"

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString()
}

export function TimeTravel({ advisoryId }: { advisoryId: string }) {
  const [asOf, setAsOf] = useState("")
  const [result, setResult] = useState<ExposureWindowResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getExposureWindow(advisoryId, asOf || undefined)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border/40 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`tt-${advisoryId}`}>Replay as of (date)</Label>
          <Input
            id={`tt-${advisoryId}`}
            type="date"
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
            className="w-48"
          />
        </div>
        <Button onClick={load} disabled={loading} size="sm" variant="outline">
          <History data-icon="inline-start" className={loading ? "animate-pulse" : ""} />
          {loading ? "Replaying&hellip;" : "Replay"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Time travel failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 rounded" />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">window</Badge>
            <span>{formatDate(result.window.start)}</span>
            <span className="text-border">→</span>
            <span>{formatDate(result.window.end)}</span>
            {result.window.live && <Badge variant="outline">live</Badge>}
          </div>

          {result.conclusions.exposed.length > 0 && (
            <div className="text-sm">
              <span className="mr-2 font-medium text-destructive">
                Exposed while live ({result.conclusions.exposed.length}):
              </span>
              <span className="text-muted-foreground">
                {result.conclusions.exposed.join(", ")}
              </span>
            </div>
          )}

          {result.conclusions.atRisk.length > 0 && (
            <div className="text-sm">
              <span className="mr-2 font-medium text-foreground">
                At risk ({result.conclusions.atRisk.length}):
              </span>
              <span className="text-muted-foreground">
                {result.conclusions.atRisk.join(", ")}
              </span>
            </div>
          )}

          {result.affectedApps.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {result.affectedApps.length} affected app
              {result.affectedApps.length === 1 ? "" : "s"} as of this date.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
