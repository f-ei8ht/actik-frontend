import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DOTS = {
  backgroundImage:
    "radial-gradient(color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
}

export function Platform() {
  return (
    <section className="border-t border-border/40">
      <div
        className="px-6 py-20 text-center"
        style={DOTS}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          See it in action
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
          Everything you need to catch a compromised dependency.
        </h2>
        <div className="mt-8">
          <a
            href="#"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Scan a repository
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-border/40">
        <img
          src="/art.jpg"
          alt="actik dashboard"
          className="w-full object-cover"
        />
      </div>
    </section>
  )
}
