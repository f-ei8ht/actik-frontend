import type { GraphPackage, InvestigateResult, ScanResult } from "@/lib/types"

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
