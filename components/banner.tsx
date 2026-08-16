import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Banner() {
  return (
    <section className="border-t border-border/40">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src="/cloud.jpg"
          alt=""
          className="size-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="px-6 py-24 text-center lg:px-16">
        <h2 className="mx-auto max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
          Catch the next worm before it spreads.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-serif text-base leading-relaxed text-muted-foreground">
          Scan any repository and know exactly which of your services are
          exposed, the moment a package is compromised.
        </p>
        <a
          href="#"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2")}
        >
          Scan a repository
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  )
}
