import { ArrowRight } from "lucide-react"
import Link from "next/link"

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
        className="px-6 py-28 text-center"
        style={DOTS}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          See it in action
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
          Everything you need to catch a compromised dependency.
        </h2>
        <div className="mt-8">
          <Link
            href="/scan"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Scan a repository
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </div>

      <div className="relative border-t border-border/40">
        <img
          src="/art.jpg"
          alt="actik dashboard"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
          <video
            controls
            preload="metadata"
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-black shadow-2xl"
            aria-label="actik demo video"
          >
            <source src="/hydradb_saif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  )
}
