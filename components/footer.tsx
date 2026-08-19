import { Star } from "lucide-react"

import { ThemeCycle } from "@/components/theme-cycle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const REPO = "https://github.com/f-ei8ht/actik-backend"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Scanner", href: "#scanner" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "GitHub", href: REPO },
      { label: "Contact", href: "mailto:saif.khan16@outlook.com" },
      { label: "llms.txt", href: "/llms.txt" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
]

export function Footer() {
  return (
    <footer>
      <div className="border-t border-border/40 px-6 pt-28 lg:px-16">
        <div className="flex flex-wrap justify-between gap-12 pb-10">
          <div className="max-w-xs">
            <a
              href="#"
              className="font-newsreader text-2xl font-medium tracking-tight text-foreground"
            >
              actik
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Know exactly which of your services are exposed the moment a
              dependency is compromised. Blast radius, powered by HydraDB.
            </p>
            <div className="mt-6">
              <ThemeCycle />
            </div>
          </div>

          <div className="flex flex-wrap gap-16">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {column.title}
                </h4>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
          <span>© 2026 actik.</span>
          <div className="flex items-center gap-4">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              <Star data-icon="inline-start" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-16 h-64 w-full overflow-hidden">
        <img
          src="/field.jpg"
          alt=""
          className="absolute inset-x-0 bottom-0 w-full object-cover"
          style={{ height: "133.33%" }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
      </div>
    </footer>
  )
}
