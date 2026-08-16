"use client"

import dynamic from "next/dynamic"

import { themeColor } from "@/lib/oklch"
import type { DependencyGraph } from "@/lib/types"

const SigmaGraph = dynamic(() => import("./blast-graph-inner"), { ssr: false })

const LEGEND = [
  { label: "Root package", color: () => themeColor("--ring") },
  { label: "Package", color: () => themeColor("--primary") },
  { label: "Advisory", color: () => themeColor("--destructive") },
  { label: "Repository", color: () => themeColor("--muted-foreground") },
]

export function BlastGraph({ data, height = 420 }: { data: DependencyGraph; height?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/40 bg-background">
      <div style={{ height }}>
        <SigmaGraph data={data} />
      </div>
      <div className="flex flex-wrap gap-4 border-t border-border/40 px-4 py-2">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color() }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
