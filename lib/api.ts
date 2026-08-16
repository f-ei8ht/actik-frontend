import type {
  DependencyGraph,
  ExposureWindowResult,
  GraphPackage,
  Incident,
  InvestigateResult,
  PropagationResult,
  ScanResult,
  WatchStatus,
} from "@/lib/types"

export class ApiError extends Error {}

interface ListPackagesResponse {
  count: number
  packages: GraphPackage[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    })
  } catch {
    throw new ApiError("Request timed out or failed. Backend reachable?")
  } finally {
    clearTimeout(timeout)
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      body?.error?.message ?? `Request failed (${response.status})`
    throw new ApiError(message)
  }
  return body as T
}

export async function scanRepository(repo: string): Promise<ScanResult> {
  const body = await request<{ scan: ScanResult }>("/api/scan", {
    method: "POST",
    body: JSON.stringify({ repo }),
  })
  return body.scan
}

export function investigate(
  ecosystem: string,
  name: string,
  version: string
): Promise<InvestigateResult> {
  const eco = ecosystem ? `/${encodeURIComponent(ecosystem)}` : ""
  const ver = version ? `/${encodeURIComponent(version)}` : ""
  return request<InvestigateResult>(
    `/api/investigate${eco}/${encodeURIComponent(name)}${ver}`
  )
}

export async function listPackages(ecosystem?: string): Promise<GraphPackage[]> {
  const query = ecosystem ? `?ecosystem=${encodeURIComponent(ecosystem)}` : ""
  const body = await request<ListPackagesResponse>(`/api/packages${query}`)
  return body.packages
}

export function getDependencyGraph(
  ecosystem: string,
  name: string,
  version: string
): Promise<DependencyGraph> {
  const eco = ecosystem ? `?ecosystem=${encodeURIComponent(ecosystem)}` : ""
  return request<DependencyGraph>(
    `/api/packages/${encodeURIComponent(name)}/${encodeURIComponent(version)}/graph${eco}`
  )
}

export function getExposureWindow(
  advisoryId: string,
  asOf?: string
): Promise<ExposureWindowResult> {
  const query = asOf ? `?asOf=${encodeURIComponent(asOf)}` : ""
  return request<ExposureWindowResult>(
    `/api/advisories/${encodeURIComponent(advisoryId)}/exposure-window${query}`
  )
}

export function getWatchStatus(): Promise<WatchStatus> {
  return request<{ watch: WatchStatus }>("/api/watch/status").then((body) => body.watch)
}

export async function runLiveWatch(): Promise<WatchStatus> {
  const body = await request<{ watch: WatchStatus }>("/api/watch/run", {
    method: "POST",
  })
  return body.watch
}

export function getRecentIncidents(limit = 20): Promise<Incident[]> {
  return request<{ incidents: Incident[] }>(
    `/api/watch/incidents?limit=${limit}`
  ).then((body) => body.incidents)
}

export interface SimulateOptions {
  compromisedAt?: string
  perHopMs?: number
  maxDepth?: number
}

export function simulatePropagation(
  name: string,
  version: string,
  ecosystem?: string,
  options: SimulateOptions = {}
): Promise<PropagationResult> {
  const params = new URLSearchParams()
  if (ecosystem) params.set("ecosystem", ecosystem)
  if (options.compromisedAt) params.set("compromisedAt", options.compromisedAt)
  if (options.perHopMs) params.set("perHopMs", String(options.perHopMs))
  if (options.maxDepth) params.set("maxDepth", String(options.maxDepth))
  const query = params.size ? `?${params.toString()}` : ""
  return request<PropagationResult>(
    `/api/simulate/propagation/${encodeURIComponent(name)}/${encodeURIComponent(version)}${query}`
  )
}
