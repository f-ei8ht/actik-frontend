import { ArrowRight } from "lucide-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Quote() {
  return (
    <section className="border-t border-border/40">
      <div className="px-6 py-28 text-center lg:px-16">
        <blockquote className="mx-auto max-w-4xl">
          <p className="font-newsreader text-4xl font-normal leading-tight text-foreground sm:text-5xl">
            &ldquo;The moral is obvious. You can&apos;t trust code that you did
            not totally create yourself. No amount of source-level verification
            or scrutiny will protect you from using untrusted code.&rdquo;
          </p>
        </blockquote>

        <div className="mt-8 flex flex-col items-center">
          <a
            href="https://www.facesofopensource.com/ken-thompson/"
            target="_blank"
            rel="noreferrer"
          >
            <Avatar className="aspect-[4/5] h-28 w-auto rounded-lg bg-white after:rounded-lg">
              <AvatarImage
                src="/ken.jpg"
                alt="Ken Thompson"
                className="rounded-lg bg-white object-cover"
              />
              <AvatarFallback className="rounded-lg">KT</AvatarFallback>
            </Avatar>
          </a>
          <p className="mt-4 text-sm font-semibold text-foreground">
            Ken Thompson
          </p>
          <p className="text-sm text-muted-foreground">
            B, Unix, UTF-8, Go and Turing Award 1983
          </p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          <a
            href="https://www.andrew.cmu.edu/course/18-330/2019/reading/Thompson_1984_Reflections%20on%20Trusting%20Trust.pdf"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Reflections on Trusting Trust, 1984 Turing Award Lecture
          </a>
        </p>

        <p className="mt-12 font-newsreader text-xl text-foreground">
          Sounds relatable?
        </p>
        <Link
          href="/scan"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 gap-2")}
        >
          Scan a repository
          <ArrowRight data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}
