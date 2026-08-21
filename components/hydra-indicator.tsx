"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { TextCursor, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PHRASE = "hail hydra"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

export function HydraIndicator({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const close = React.useCallback(() => {
    setValue("")
    setOpen(false)
  }, [])

  const openAndType = React.useCallback((char: string) => {
    setOpen(true)
    setValue((prev) => {
      const next = (prev + char).toLowerCase()
      if (next === PHRASE) {
        return ""
      }
      if (PHRASE.startsWith(next)) {
        return next
      }
      return ""
    })
  }, [])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) {
        return
      }
      if (isTypingTarget(event.target)) {
        return
      }
      if (event.key === "Escape") {
        close()
        return
      }
      if (event.key.length !== 1) {
        return
      }

      const ch = event.key.toLowerCase()
      if (ch === "h") {
        event.preventDefault()
        openAndType(ch)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [openAndType, close])

  const submit = () => {
    if (value.toLowerCase() === PHRASE) {
      setTheme("hydra")
      close()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
        aria-label="Hail Hydra"
        title="Hail Hydra"
      >
        <TextCursor className="size-4" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 md:bottom-6">
            <div className="flex w-full max-w-xs items-center gap-2 rounded-md border border-border bg-background p-1.5 shadow-lg">
              <Input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    submit()
                  }
                  if (event.key === "Escape") {
                    close()
                  }
                  event.stopPropagation()
                }}
                placeholder="hail hydra"
                className="border-0 bg-transparent px-2.5 shadow-none focus-visible:ring-0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Hail Hydra"
              />
              <button
                type="button"
                onClick={close}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
