"use client"

import { Check, Copy, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SeverityBadge } from "@/components/scan/severity-badge"
import { advisoryUrl } from "@/lib/advisory"
import type { ScanFinding } from "@/lib/types"

export function FindingCard({ finding }: { finding: ScanFinding }) {
  const copyFix = async () => {
    if (!finding.fix) return
    await navigator.clipboard.writeText(finding.fix)
    toast.add({ title: "Fix copied to clipboard." })
  }

  const url = advisoryUrl(finding.advisory.id)
  const published = finding.advisory.publishedAt
    ? new Date(finding.advisory.publishedAt).toLocaleDateString()
    : null

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="font-mono text-base">
              <a
                href={`/packages/${finding.ecosystem}/${finding.package}/${finding.resolvedVersion}`}
                className="text-foreground underline-offset-2 hover:underline"
              >
                {finding.package}
              </a>
              <span className="text-destructive">@{finding.resolvedVersion}</span>
            </CardTitle>
            <SeverityBadge severity={finding.severity} />
            <Tooltip>
              <TooltipTrigger render={<span className="text-xs text-muted-foreground" />}>
                {finding.source === "graph" ? "graph" : "OSV live"}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {finding.source === "graph"
                    ? "Advisory ingested into HydraDB from OSV / npm / PyPI"
                    : "Flagged by a live Google OSV check"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          {finding.depth > 0 && (
            <span className="text-xs text-muted-foreground">
              transitive · {finding.depth} hop{finding.depth > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <div className="text-sm leading-relaxed text-foreground/80">
          {finding.advisory.summary || finding.advisory.id}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
            >
              {finding.advisory.id}
              <ExternalLink data-icon="inline-end" />
            </a>
          ) : (
            <span>{finding.advisory.id}</span>
          )}
          {published && <span>· published {published}</span>}
        </div>

        {finding.fix && (
          <>
            <Separator />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <code className="rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs text-foreground">
                {finding.fix}
              </code>
              <Button type="button" variant="outline" size="sm" onClick={copyFix}>
                <Copy data-icon="inline-start" />
                Copy fix
              </Button>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-1 font-mono text-xs text-muted-foreground">
          {finding.paths[0]?.map((segment, index, arr) => (
            <span key={index} className="flex items-center gap-1">
              <span className={index === 0 ? "text-foreground" : ""}>{segment}</span>
              {index < arr.length - 1 && <span className="text-muted-foreground/50">→</span>}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
