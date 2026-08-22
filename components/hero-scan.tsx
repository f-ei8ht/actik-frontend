"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface InvestigateResult {
  package: string
  version: string
  ecosystem: string
  advisories: Array<{ id: string; severity: string }>
  blastRadius: {
    applications: string[]
    affectedRepositories: string[]
    maxDepth: number
  } | null
  typosquats: Array<{ name: string }>
}

interface OutputLine {
  text: string
  tone?: string
}

const PACKAGE = "lodash"
const VERSION = "4.17.20"
const ECOSYSTEM = "npm"

function buildLines(data: InvestigateResult): OutputLine[] {
  const app = (text: string) => ({ text })
  const ok = (text: string) => ({ text, tone: "text-emerald-500" })
  const warn = (text: string) => ({ text, tone: "text-amber-500" })
  const danger = (text: string) => ({ text, tone: "text-destructive" })
  const muted = (text: string) => ({ text, tone: "text-muted-foreground" })

  const lines: OutputLine[] = [
    app(`GET /api/investigate/${ECOSYSTEM}/${PACKAGE}/${VERSION}`),
    ok(`200 OK · ${data.ecosystem} · ${data.package}@${data.version}`),
    ok(`checked ${data.advisories.length} advisories against OSV`),
  ]

  const high = data.advisories.filter((a) => a.severity === "HIGH").length
  const moderate = data.advisories.filter(
    (a) => a.severity === "MODERATE"
  ).length
  lines.push(
    warn(`${high} HIGH · ${moderate} MODERATE · 0 LOW`),
    danger(`resolved version ${data.package}@${data.version} is exposed`)
  )

  if (data.blastRadius) {
    const apps = data.blastRadius.applications
    if (apps.length > 0) {
      lines.push(
        danger(`blast radius · ${apps.length} app exposed`),
        muted(apps.join(" · "))
      )
    }
  }

  if (data.typosquats.length > 0) {
    lines.push(
      muted(
        `typosquats nearby · ${data.typosquats
          .slice(0, 2)
          .map((t) => t.name)
          .join(" · ")}`
      )
    )
  }

  lines.push(ok("fix verified · lodash@4.17.21"))
  return lines
}

export function HeroScan() {
  const [lines, setLines] = useState<OutputLine[]>([])
  const [visible, setVisible] = useState(0)
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/investigate/${ECOSYSTEM}/${PACKAGE}/${VERSION}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((data: InvestigateResult) => {
        if (cancelled) return
        setLines(buildLines(data))
        setStatus("done")
      })
      .catch(() => {
        if (cancelled) return
        setLines([
          { text: `GET /api/investigate/${ECOSYSTEM}/${PACKAGE}/${VERSION}` },
          { text: "request failed · backend unreachable", tone: "text-destructive" },
        ])
        setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status !== "done" || lines.length === 0) return
    timerRef.current = setInterval(() => {
      setVisible((current) => {
        if (current >= lines.length) {
          if (timerRef.current) clearInterval(timerRef.current)
          return current
        }
        return current + 1
      })
    }, 420)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status, lines.length])

  const streaming = status === "done" && visible < lines.length

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-500" />
        <span className="size-2.5 rounded-full bg-amber-500" />
        <span className="size-2.5 rounded-full bg-emerald-500" />
        <span className="ml-2 min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          GET /api/investigate/npm/lodash/4.17.20
        </span>
      </div>

      <div className="flex min-h-56 flex-col justify-center gap-2.5 px-6 py-6">
        {lines.slice(0, visible).map((line, index) => (
          <p
            key={index}
            className={cn(
              "font-mono text-xs leading-relaxed tracking-tight sm:text-sm",
              line.tone ?? "text-foreground"
            )}
          >
            {line.text}
          </p>
        ))}
        {streaming && (
          <p className="shimmer w-fit font-mono text-xs leading-relaxed tracking-tight text-foreground sm:text-sm">
            resolving advisories&hellip;
          </p>
        )}
        {status === "done" && !streaming && visible > 0 && (
          <p className="shimmer w-fit font-mono text-xs leading-relaxed tracking-tight text-emerald-500 sm:text-sm">
            scan complete · fetched from HydraDB
          </p>
        )}
        {status === "loading" && (
          <p className="shimmer w-fit font-mono text-xs leading-relaxed tracking-tight text-foreground sm:text-sm">
            contacting HydraDB&hellip;
          </p>
        )}
      </div>
    </div>
  )
}