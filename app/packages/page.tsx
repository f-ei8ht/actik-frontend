"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { PageFrame } from "@/components/page-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { usePackagesStore } from "@/lib/stores/packages"

export default function PackagesPage() {
  const router = useRouter()
  const [ecosystem, setEcosystem] = useState("npm")
  const [name, setName] = useState("")
  const [version, setVersion] = useState("")

  const fetchPackages = usePackagesStore((state) => state.fetch)
  const packages = usePackagesStore((state) => state.packages)
  const loaded = usePackagesStore((state) => state.loaded)

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanVersion = version.trim()
    if (!cleanName || !cleanVersion) return
    router.push(`/packages/${ecosystem}/${cleanName}/${cleanVersion}`)
  }

  const visible = packages.filter((pkg) => pkg.ecosystem === ecosystem)

  return (
    <PageFrame>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => router.push("/")}
      >
        <ArrowLeft data-icon="inline-start" />
        Back
      </Button>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
        Look up a package
      </h1>

      <Card className="mt-6 max-w-xl">
        <CardContent className="gap-5">
          <ToggleGroup
            value={[ecosystem]}
            onValueChange={(value) => {
              const next = value[value.length - 1]
              if (next) {
                setEcosystem(next)
                setName("")
                setVersion("")
              }
            }}
          >
            <ToggleGroupItem value="npm">npm</ToggleGroupItem>
            <ToggleGroupItem value="PyPI">PyPI</ToggleGroupItem>
          </ToggleGroup>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={
                ecosystem === "npm"
                  ? "package name (e.g. lodash)"
                  : "package name (e.g. requests)"
              }
              className="font-mono"
            />
            <div className="flex items-center gap-3">
              <Input
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder={
                  ecosystem === "npm"
                    ? "version (e.g. 4.17.20)"
                    : "version (e.g. 2.31.0)"
                }
                className="flex-1 font-mono"
              />
              <Button type="submit" className="shrink-0">
                Investigate
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Packages in the graph
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {!loaded
            ? Array.from({ length: 12 }, (_, i) => (
                <Skeleton key={i} className="h-7 w-24 rounded-full" />
              ))
            : visible.map((pkg) => (
                <Link
                  key={pkg.name}
                  href={`/packages/${ecosystem}/${pkg.name}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer font-mono text-xs transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {pkg.name}
                  </Badge>
                </Link>
              ))}
        </div>
      </div>
    </PageFrame>
  )
}
