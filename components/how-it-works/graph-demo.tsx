"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { getDependencyGraph } from "@/lib/api"
import type { DependencyGraph } from "@/lib/types"

const SigmaGraph = dynamic(
  () => import("@/components/how-it-works/graph-canvas"),
  { ssr: false }
)

export function GraphDemo() {
  const [data, setData] = useState<DependencyGraph | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDependencyGraph("npm", "lodash", "4.17.20")
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Could not load the dependency graph right now.
      </p>
    )
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="shimmer font-mono text-xs text-muted-foreground">
          loading graph from HydraDB…
        </span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/40 bg-background">
      <div className="h-72">
        <SigmaGraph data={data} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {data.nodes.length} nodes · {data.edges.length} edges · {data.root}
        </span>
      </div>
    </div>
  )
}