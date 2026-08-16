import { ArrowRight, HandFist } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-6 px-6 py-16 lg:px-16">
        <h1 className="font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Stop guessing which dependency will bite you.
        </h1>
        <p className="max-w-md font-serif text-lg leading-relaxed text-muted-foreground">
          Scan any repository and see exactly which of your services resolve a
          compromised version, and when you were exposed.
        </p>
        <div>
          <a
            href="#"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Scan a repository
            <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <HandFist className="size-5" />
          <span>Powered by</span>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://hydradb.com/?utm_source=actik"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center rounded-md border border-border/60 bg-logo-chip p-0.5 dark:border-input dark:bg-input/30"
                />
              }
            >
              <img
                src="/hydra.png"
                alt="HydraDB"
                className="h-4 w-auto"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Hail Hydra</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-muted/50 lg:block">
        <img
          src="/boston.jpg"
          alt="Supply chain visualization"
          className="size-full object-cover"
        />
      </div>
    </section>
  )
}
