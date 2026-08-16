export function LogoCloud() {
  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-18 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Recent CVEs
        </p>
        <div className="mt-9 flex items-center justify-center gap-10">
          <a
            href="https://hydradb.com/?utm_source=actik"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-border/60 bg-logo-chip p-1 dark:border-input dark:bg-input/30"
          >
            <img src="/hydra.png" alt="HydraDB" className="h-5 w-auto" />
          </a>
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
