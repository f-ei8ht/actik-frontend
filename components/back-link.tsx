"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackLink({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "w-fit gap-2 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <ArrowLeft data-icon="inline-start" />
      Back
    </button>
  )
}