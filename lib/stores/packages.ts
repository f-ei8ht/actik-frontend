import { create } from "zustand"

import { listPackages } from "@/lib/api"
import type { GraphPackage } from "@/lib/types"

interface PackagesState {
  packages: GraphPackage[]
  loading: boolean
  error: string | null
  loaded: boolean
  fetch: () => Promise<void>
}

export const usePackagesStore = create<PackagesState>((set, get) => ({
  packages: [],
  loading: false,
  error: null,
  loaded: false,
  fetch: async () => {
    if (get().loaded || get().loading) return
    set({ loading: true, error: null })
    try {
      const packages = await listPackages()
      set({ packages, loading: false, loaded: true })
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : String(err) })
    }
  },
}))
