import { create } from "zustand"

import { scanRepository } from "@/lib/api"
import type { ScanResult } from "@/lib/types"

interface ScanState {
  byRepo: Record<string, ScanResult>
  pending: Record<string, boolean>
  errors: Record<string, string | null>
  getScan: (repo: string) => ScanResult | null
  getPending: (repo: string) => boolean
  getError: (repo: string) => string | null
  scan: (repo: string) => Promise<ScanResult>
  clear: () => void
}

export const useScanStore = create<ScanState>((set, get) => ({
  byRepo: {},
  pending: {},
  errors: {},
  getScan: (repo) => get().byRepo[repo] ?? null,
  getPending: (repo) => get().pending[repo] ?? false,
  getError: (repo) => get().errors[repo] ?? null,
  scan: async (repo) => {
    const cached = get().byRepo[repo]
    if (cached) return cached
    if (get().pending[repo]) {
      // Wait for the in-flight request to finish.
      while (get().pending[repo]) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      const finished = get().byRepo[repo]
      if (finished) return finished
    }
    set((state) => ({ pending: { ...state.pending, [repo]: true }, errors: { ...state.errors, [repo]: null } }))
    try {
      const result = await scanRepository(repo)
      set((state) => ({
        byRepo: { ...state.byRepo, [repo]: result },
        pending: { ...state.pending, [repo]: false },
      }))
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      set((state) => ({
        pending: { ...state.pending, [repo]: false },
        errors: { ...state.errors, [repo]: message },
      }))
      throw err
    }
  },
  clear: () => set({ byRepo: {}, pending: {}, errors: {} }),
}))
