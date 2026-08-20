"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const ORDER = ["light", "dark", "hydra", "system"] as const

const LABEL: Record<(typeof ORDER)[number], string> = {
  light: "Light",
  dark: "Dark",
  hydra: "Hydra",
  system: "System",
}

export function ThemeCycle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const current = (ORDER.includes(theme as (typeof ORDER)[number])
    ? theme
    : "system") as (typeof ORDER)[number]
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Theme: ${LABEL[current]}. Click to switch to ${LABEL[next]}`}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {LABEL[current]}
    </button>
  )
}