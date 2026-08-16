import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SEVERITY_BADGE } from "@/lib/severity"

export function SeverityBadge({ severity, className }: { severity: string; className?: string }) {
  const normalized = severity.toUpperCase()
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        SEVERITY_BADGE[normalized] ?? SEVERITY_BADGE.UNKNOWN,
        className
      )}
    >
      {normalized}
    </Badge>
  )
}
