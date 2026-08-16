import type { Severity } from "@/lib/types"

export const SEVERITY_ORDER: Severity[] = [
  "CRITICAL",
  "HIGH",
  "MODERATE",
  "LOW",
  "UNKNOWN",
]

export const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-destructive/10 text-destructive",
  HIGH: "bg-chart-3/10 text-chart-3",
  MODERATE: "bg-chart-2/10 text-chart-2",
  LOW: "bg-chart-1/10 text-chart-1",
  UNKNOWN: "bg-muted text-muted-foreground",
}

export const SEVERITY_RING: Record<string, string> = {
  CRITICAL: "text-destructive",
  HIGH: "text-chart-3",
  MODERATE: "text-chart-2",
  LOW: "text-chart-1",
  CLEAN: "text-primary",
  UNKNOWN: "text-muted-foreground",
}

export const SEVERITY_HEX: Record<string, string> = {
  CRITICAL: "hsl(358 62% 47%)",
  HIGH: "hsl(25 95% 53%)",
  MODERATE: "hsl(45 93% 47%)",
  LOW: "hsl(220 91% 54%)",
  UNKNOWN: "hsl(0 0% 60%)",
}
