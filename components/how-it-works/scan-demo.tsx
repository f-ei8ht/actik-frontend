"use client"

import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ScanDemo() {
  const [value, setValue] = useState("acme/shopping-cart")
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  const onScan = (event: React.FormEvent) => {
    event.preventDefault()
    if (!value.trim()) return
    setRunning(true)
    setDone(false)
    setTimeout(() => {
      setRunning(false)
      setDone(true)
    }, 1800)
  }

  return (
    <form onSubmit={onScan} className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="github.com/org/repo"
          className="flex-1 font-mono"
          aria-label="Repository"
        />
        <Button type="submit" className="shrink-0">
          Scan
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="rounded-lg border border-border/40 bg-muted/40 p-4">
        <p className="font-mono text-xs text-muted-foreground">
          {running && "resolving lockfiles…"}
          {!running && !done && "waiting for a repository…"}
          {!running && done && "scan complete"}
        </p>

        {done && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-emerald-500" />
              <span className="text-foreground">package-lock.json · npm · 1,248 resolved</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-emerald-500" />
              <span className="text-foreground">uv.lock · PyPI · 84 resolved</span>
            </div>
            <div className="mt-1 flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm">
              <ShieldCheck className="size-4 text-primary" />
              <span className="text-primary">2 services reachable · fix verified</span>
            </div>
          </div>
        )}

        {running && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="shimmer">tracing blast radius…</span>
          </div>
        )}
      </div>
    </form>
  )
}