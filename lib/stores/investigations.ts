import { create } from "zustand"

import { investigate } from "@/lib/api"
import type { InvestigateResult } from "@/lib/types"

interface InvestigationState {
  byKey: Record<string, InvestigateResult>
  pending: Record<string, boolean>
  errors: Record<string, string | null>
  get: (key: string) => InvestigateResult | null
  isPending: (key: string) => boolean
  getError: (key: string) => string | null
  load: (key: string, ecosystem: string, name: string, version: string) => Promise<InvestigateResult>
  clear: () => void
}

export function investigationKey(ecosystem: string, name: string, version: string) {
  return `${ecosystem}:${name}:${version}`
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  byKey: {},
  pending: {},
  errors: {},
  get: (key) => get().byKey[key] ?? null,
  isPending: (key) => get().pending[key] ?? false,
  getError: (key) => get().errors[key] ?? null,
  load: async (key, ecosystem, name, version) => {
    const cached = get().byKey[key]
    if (cached) return cached
    if (get().pending[key]) {
      while (get().pending[key]) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      const finished = get().byKey[key]
      if (finished) return finished
    }
    set((state) => ({ pending: { ...state.pending, [key]: true }, errors: { ...state.errors, [key]: null } }))
    try {
      const result = await investigate(ecosystem, name, version)
      set((state) => ({
        byKey: { ...state.byKey, [key]: result },
        pending: { ...state.pending, [key]: false },
      }))
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      set((state) => ({
        pending: { ...state.pending, [key]: false },
        errors: { ...state.errors, [key]: message },
      }))
      throw err
    }
  },
  clear: () => set({ byKey: {}, pending: {}, errors: {} }),
}))
