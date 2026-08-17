const cveLogos = [
  { name: "axios", src: "/logos/axios.svg", href: "https://osv.dev/vulnerability/MAL-2026-2307" },
  { name: "keyv", src: "/logos/keyv.svg", href: "https://osv.dev/vulnerability/MAL-2026-11524" },
  { name: "Hono", src: "/logos/hono.svg", href: "https://osv.dev/vulnerability/CVE-2026-71850", showName: true },
  { name: "Hugging Face Transformers", src: "/logos/hf-logo-with-title.svg", href: "https://osv.dev/vulnerability/PYSEC-2026-1988" },
  { name: "Django", src: "/logos/django-logo-positive.svg", href: "https://osv.dev/vulnerability/PYSEC-2026-630" },
  { name: "LiteLLM", emoji: "🚅", href: "https://osv.dev/vulnerability/MAL-2026-2144" },
]

export function RecentCvesMarquee() {
  return (
    <div className="group flex gap-4 overflow-hidden p-2 [--gap:2.5rem] [--duration:30s]">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-marquee flex shrink-0 items-center gap-4 [--gap:2.5rem]"
        >
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
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="h-9 w-auto max-w-40 object-contain"
                  />
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
  )
}