"use client"

import { useState } from "react"
import { ExternalLink, Menu, X } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PROJECT_URL = "https://github.com/f-ei8ht/actik-backend"

const NAV_LINKS = [
  { title: "Packages", url: "/packages" },
  { title: "Scan", url: "/scan" },
  { title: "Watch", url: "/watch" },
  { title: "How it works", url: "/how-it-works" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <a
          href="#"
          className="font-newsreader text-xl font-medium tracking-tight"
        >
          actik
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.title}
              href={link.url}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={PROJECT_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden gap-2 sm:inline-flex"
            )}
          >
            <ExternalLink data-icon="inline-start" />
            GitHub
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/40 bg-background/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.url}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.title}
              </a>
            ))}
            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-2 gap-2 justify-center sm:hidden"
              )}
            >
              <ExternalLink data-icon="inline-start" />
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  )
}