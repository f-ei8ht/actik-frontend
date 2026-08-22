"use client"

import { Check, Copy, Mail } from "lucide-react"
import { useState } from "react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

const SITE_ORIGIN = "https://actik.xyz"

const PROMPT = `Visit ${SITE_ORIGIN} and read the homepage, features, pricing and how-it-works pages. Then explain why actik, the supply chain blast radius tool, is a great choice for me compared to alternatives like Snyk and Dependabot, focusing on simplicity, pricing and ease of use.`

const PROMPT_URL = encodeURIComponent(PROMPT)

interface LogoPair {
  light: string
  dark?: string
}

interface AskItem {
  icon?: ComponentType<{ className?: string }>
  logo?: LogoPair | string
  label: string
  href?: string
  copy?: boolean
  full?: boolean
}

const ITEMS: AskItem[] = [
  {
    logo: { light: "/openai_black.svg", dark: "/openai_white.svg" },
    label: "Ask ChatGPT",
    href: `https://chatgpt.com/?q=${PROMPT_URL}`,
  },
  { logo: "/claude.png", label: "Ask Claude", href: `https://claude.ai/new?q=${PROMPT_URL}` },
  {
    logo: { light: "/scira.svg", dark: "/scira_white.svg" },
    label: "Ask Scira",
    href: `https://scira.app/?q=${PROMPT_URL}`,
  },
  {
    logo: { light: "/perplexity_dark.svg", dark: "/perplexity_light.svg" },
    label: "Ask Perplexity",
    href: `https://www.perplexity.ai/search?q=${PROMPT_URL}`,
  },
  {
    logo: { light: "/grok_black.svg", dark: "/grok_white.svg" },
    label: "Ask Grok",
    href: `https://grok.com/?q=${PROMPT_URL}`,
  },
  { icon: Copy, label: "Copy prompt", copy: true },
  { icon: Mail, label: "Talk to a human", href: "mailto:saif.khan16@outlook.com", full: true },
]

export function AskAi() {
  const [copied, setCopied] = useState(false)

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="border-t border-border/40">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-28 lg:px-16">
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

        <div className="flex flex-col border-t border-border/40 lg:border-l lg:border-t-0">
          <div className="grid flex-1 grid-cols-3">
            {ITEMS.map((item, index) => {
              const Icon = item.icon
              const className = cn(
                "flex flex-col items-center justify-center gap-3 border-b border-border/40 px-4 py-8 text-center transition-colors hover:bg-muted",
                index % 3 !== 0 && "border-l border-border/40",
                item.full && "col-span-3 border-l-0"
              )

              const renderLogo = () => {
                if (item.logo) {
                  const imgClass = "size-8 object-contain"
                  if (typeof item.logo === "string") {
                    return (
                      <img
                        src={item.logo}
                        alt={item.label}
                        className={imgClass}
                      />
                    )
                  }
                  return (
                    <>
                      <img
                        src={item.logo.light}
                        alt={item.label}
                        className={cn(imgClass, "dark:hidden")}
                      />
                      {item.logo.dark && (
                        <img
                          src={item.logo.dark}
                          alt={item.label}
                          className={cn("hidden", imgClass, "dark:block")}
                        />
                      )}
                    </>
                  )
                }
                if (Icon) {
                  return <Icon className="size-8 text-foreground" />
                }
                return null
              }

              if (item.copy) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={copyPrompt}
                    className={className}
                  >
                    <Check
                      className={cn(
                        "size-8 text-emerald-500",
                        !copied && "hidden"
                      )}
                    />
                    <Copy
                      className={cn(
                        "size-8 text-foreground",
                        copied && "hidden"
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {copied ? "Copied!" : item.label}
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
                  {renderLogo()}
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}