const cveLogos = [
  { name: "axios", src: "/logos/axios-light.svg", srcDark: "/logos/axios.svg", href: "https://osv.dev/vulnerability/MAL-2026-2307" },
  { name: "keyv", src: "/logos/keyv.svg", srcDark: "/logos/keyv-dark.svg", href: "https://osv.dev/vulnerability/MAL-2026-11524" },
  { name: "Hono", src: "/logos/hono.svg", href: "https://osv.dev/vulnerability/CVE-2026-71850", showName: true },
  { name: "Hugging Face Transformers", src: "/logos/hf-logo-with-title.svg", srcDark: "/logos/hf-logo-with-title-dark.svg", href: "https://osv.dev/vulnerability/PYSEC-2026-1988" },
  { name: "Django", src: "/logos/django-logo-positive.svg", href: "https://osv.dev/vulnerability/PYSEC-2026-630" },
  { name: "LiteLLM", emoji: "🚅", href: "https://osv.dev/vulnerability/MAL-2026-2144" },
]

export function RecentCvesMarquee() {
  return (
    <div className="group relative flex overflow-hidden p-2 [--gap:2.5rem] [--duration:30s]">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - var(--gap) / 2)); }
        }
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
          will-change: transform;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      <div className="animate-marquee flex w-max shrink-0 items-center gap-4 [--gap:2.5rem]">
        {[0, 1].map((i) => (
          <div key={i} className="flex shrink-0 items-center gap-4 [--gap:2.5rem]">
            {cveLogos.map((brand, index) => (
              <a
                key={index}
                href={brand.href}
                target="_blank"
                rel="noreferrer"
                title={brand.name}
                className="mx-6 lg:mx-10"
              >
                {brand.src ? (
                  <span className="inline-flex items-center gap-2">
                    {brand.srcDark ? (
                      <>
                        <img
                          src={brand.src}
                          alt={brand.name}
                          className="h-9 w-auto max-w-40 object-contain dark:hidden"
                        />
                        <img
                          src={brand.srcDark}
                          alt={brand.name}
                          className="hidden h-9 w-auto max-w-40 object-contain dark:block"
                        />
                      </>
                    ) : (
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="h-9 w-auto max-w-40 object-contain"
                      />
                    )}
                    {brand.showName && (
                      <span className="whitespace-nowrap text-xl font-semibold text-foreground">
                        {brand.name}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-2xl font-semibold text-foreground">
                    <span className="leading-none">🚅</span>
                    <span>LiteLLM</span>
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}