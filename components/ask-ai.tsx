"use client"

import { Bot, Copy, Search, Sparkles, Star, Zap } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

const SITE_ORIGIN = "https://actik.xyz"

const PROMPT = `Go to ${SITE_ORIGIN}, get the latest data from their website and explain why actik, the supply chain blast radius tool, is a great choice for me compared to Snyk, Dependabot etc. in terms of simplicity, pricing and ease of use?`

const PROMPT_URL = encodeURIComponent(PROMPT)

interface AskItem {
  icon: ComponentType<{ className?: string }>
  label: string
  href?: string
  copy?: boolean
}

const ITEMS: AskItem[] = [
  { icon: Sparkles, label: "Ask ChatGPT", href: `https://chatgpt.com/?q=${PROMPT_URL}` },
  { icon: Bot, label: "Ask Claude", href: `https://claude.ai/new?q=${PROMPT_URL}` },
  { icon: Star, label: "Ask Gemini", href: `https://gemini.google.com/app?q=${PROMPT_URL}` },
  { icon: Search, label: "Ask Perplexity" },
  { icon: Zap, label: "Ask Grok" },
  { icon: Copy, label: "Copy prompt", copy: true },
]

export function AskAi() {
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(PROMPT)
  }

  return (
    <section className="border-t border-border/40">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 lg:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Ask AI
          </p>
          <h2 className="mt-4 font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
            Still not sure?
          </h2>
          <p className="mt-4 max-w-sm font-serif text-base leading-relaxed text-muted-foreground">
            Don&apos;t just take our word for it. See what your favorite AI
            says about actik.
          </p>
        </div>

        <div className="lg:border-l lg:border-border/40">
          <div className="grid grid-cols-3">
            {ITEMS.map((item, index) => {
              const Icon = item.icon
              const className = cn(
                "flex flex-col items-center justify-center gap-3 border-b border-border/40 px-4 py-8 text-center transition-colors hover:bg-muted",
                index % 3 !== 0 && "border-l border-border/40"
              )
              if (item.copy) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={copyPrompt}
                    className={className}
                  >
                    <Icon className="size-6 text-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                  </button>
                )
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  aria-disabled={!item.href}
                >
                  <Icon className="size-6 text-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </a>
              )
            })}
          </div>

          <a
            href="mailto:saif.khan16@outlook.com"
            className="block py-5 text-center text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Talk to a human
          </a>
        </div>
      </div>
    </section>
  )
}
