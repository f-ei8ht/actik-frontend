"use client"

import { Activity } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const TIMELINE = [
  { time: "09:00", label: "event-stream@3.3.5 compromised", tone: "danger" },
  { time: "09:03", label: "billing-api exposed (d1)", tone: "danger" },
  { time: "09:06", label: "payments-api exposed (d2)", tone: "danger" },
  { time: "09:08", label: "notification-service exposed (d2)", tone: "danger" },
] as const

const TONE_CLASS = {
  danger: "text-destructive",
  ok: "text-emerald-500",
} as const

export function WormDemo() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timers = TIMELINE.map((_, index) =>
      setTimeout(() => setActive(index + 1), 900 * (index + 1))
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const running = active < TIMELINE.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          Worm-speed propagation
        </span>
        {running && (
          <span className="shimmer ml-auto font-mono text-xs text-muted-foreground">
            simulating…
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {TIMELINE.map((row, index) => {
          const revealed = active > index
          return (
            <div
              key={row.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2 transition-opacity",
                !revealed && "opacity-40"
              )}
            >
              <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {row.time}
              </span>
              <span className={cn("text-sm", TONE_CLASS[row.tone])}>
                {row.label}
              </span>
            </div>
          )
        })}
      </div>

      {active >= TIMELINE.length && (
        <p className="text-sm text-muted-foreground">
          Compromised at 09:00, three services exposed by 09:08. Blast radius
          computed as a graph traversal, per hop.
        </p>
      )}
    </div>
  )
}