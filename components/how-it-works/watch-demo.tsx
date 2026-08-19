"use client"

import { Bell, Check, RefreshCw } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROWS = [
  {
    pkg: "event-stream@3.3.5",
    status: "new" as const,
    path: "billing-api → event-stream",
  },
  {
    pkg: "lodash@4.17.20",
    status: "resolved" as const,
    path: "payments-api → lodash",
  },
]

export function WatchDemo() {
  const [running, setRunning] = useState(false)
  const [active, setActive] = useState(0)

  const onRun = () => {
    if (running) return
    setRunning(true)
    setActive(0)
    const timers = ROWS.map((_, index) =>
      setTimeout(() => setActive(index + 1), 700 * (index + 1))
    )
    setTimeout(() => {
      setRunning(false)
      timers.forEach(clearTimeout)
    }, 700 * ROWS.length + 400)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <Bell className="size-4" />
          Live watch
        </span>
        <Button variant="outline" size="sm" onClick={onRun} disabled={running}>
          <RefreshCw
            data-icon="inline-start"
            className={cn(running && "animate-spin")}
          />
          {running ? "Watching…" : "Run watch"}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {ROWS.map((row, index) => {
          const revealed = active > index
          return (
            <div
              key={row.pkg}
              className={cn(
                "flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5 transition-opacity",
                !revealed && "opacity-40"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-xs text-foreground">
                  {row.pkg}
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.path}
                </span>
              </div>
              {revealed &&
                (row.status === "new" ? (
                  <Badge className="gap-1">
                    <Bell />
                    new
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 border-transparent bg-emerald-500/10 text-emerald-500">
                    <Check />
                    resolved
                  </Badge>
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}