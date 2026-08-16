import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { LogoCloud } from "@/components/logo-cloud"
import { Platform } from "@/components/platform"
import { Features } from "@/components/features"
import { Scanner } from "@/components/scanner"
import { Quote } from "@/components/quote"
import { Faq } from "@/components/faq"
import { AskAi } from "@/components/ask-ai"
import { Banner } from "@/components/banner"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-svh justify-center px-4">
      <div className="flex w-full max-w-7xl flex-col border border-border/40">
        <Header />
        <div className="flex h-[calc(100svh-4.5rem)] flex-col">
          <Hero />
        </div>
        <LogoCloud />
        <Platform />
        <Features />
        <Scanner />
        <Quote />
        <Faq />
        <AskAi />
        <Banner />
        <Footer />
      </div>
    </div>
  )
}
