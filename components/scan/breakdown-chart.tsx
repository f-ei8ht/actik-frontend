"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { SEVERITY_HEX, SEVERITY_ORDER } from "@/lib/severity"

export function BreakdownChart({ breakdown }: { breakdown: Record<string, number> }) {
  const data = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: breakdown[severity] ?? 0,
  })).filter((entry) => entry.count > 0)

  if (data.length === 0) return null

  const config: ChartConfig = Object.fromEntries(
    data.map((entry) => [
      entry.severity.toLowerCase(),
      { label: entry.severity, color: SEVERITY_HEX[entry.severity] },
    ])
  )

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-44">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="severity"
          innerRadius={48}
          outerRadius={72}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.severity} fill={`var(--color-${entry.severity.toLowerCase()})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
