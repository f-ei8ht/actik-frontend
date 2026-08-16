import { cn } from "@/lib/utils"
import { SEVERITY_RING } from "@/lib/severity"

interface ScoreRingProps {
  score: number
  severity: string
  size?: number
  stroke?: number
}

export function ScoreRing({ score, severity, size = 140, stroke = 10 }: ScoreRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const filled = Math.max(0, Math.min(100, score)) / 100
  const color = SEVERITY_RING[severity] ?? "text-muted-foreground"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - filled)}
          className={cn("stroke-current transition-all", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums text-foreground">{score}</span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">exposure</span>
      </div>
    </div>
  )
}
