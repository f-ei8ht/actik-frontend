import { RecentCvesMarquee } from "@/components/recent-cves-marquee"

export function LogoCloud() {
  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Recent CVEs
        </p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <RecentCvesMarquee />
        </div>
      </div>

      <div className="flex h-[86px] border-t border-border/40">
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="flex-1 border-r border-border/60 last:border-r-0"
          />
        ))}
      </div>
    </section>
  )
}