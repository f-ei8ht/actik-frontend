import { ExternalLink } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PROJECT_URL = "https://github.com/f-ei8ht/actik-backend"

const NAV_LINKS = [
  { title: "Packages", url: "/packages" },
  { title: "Scan", url: "/scan" },
  { title: "Watch", url: "/watch" },
  { title: "How it works", url: "#" },
]

export function Header() {
  return (
    <nav className="sticky top-0 z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center border-b border-border/40 bg-background/80 px-6 py-5 backdrop-blur-md">
      <a
        href="#"
        className="justify-self-start font-newsreader text-xl font-medium tracking-tight"
      >
        actik
      </a>

      <div className="flex items-center gap-8">
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

      <div className="flex justify-self-end">
        <a
          href={PROJECT_URL}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2"
          )}
        >
          <ExternalLink data-icon="inline-start" />
          GitHub
        </a>
      </div>
    </nav>
  )
}
