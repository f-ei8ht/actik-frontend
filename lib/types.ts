export type Severity =
  | "CRITICAL"
  | "HIGH"
  | "MODERATE"
  | "LOW"
  | "UNKNOWN"
  | "CLEAN"

export interface ScanFinding {
  package: string
  ecosystem: "npm" | "PyPI"
  resolvedVersion: string
  requestedVersion?: string
  severity: string
  advisory: {
    id: string
    summary: string
    publishedAt: string
    modifiedAt: string
    references?: string
  }
  fix: string | null
  fixedVersion?: string
  source: "graph" | "osv"
  paths: string[][]
  depth: number
}

export interface ExposureScore {
  total: number
  severity: Severity
  breakdown: Record<string, number>
}

export interface ExposureResult {
  findings: ScanFinding[]
  score: ExposureScore
  vulnerable: number
  clean: number
  linked: number
  unlinked: Array<{ ecosystem: string; name: string; version: string }>
}

export interface LockfileSummary {
  path: string
  ecosystem?: "npm" | "PyPI"
  status: "ok" | "unsupported" | "error"
  resolved?: number
  linked?: number
  message?: string
}

export interface FixUpgrade {
  package: string
  ecosystem: string
  from: string
  to: string
  findingCount: number
  command: string
  verified: boolean
}

export interface FixSetResult {
  upgrades: FixUpgrade[]
  verified: number
  total: number
  commands: string[]
}

export interface ScanResult {
  repo: {
    owner: string
    name: string
    label: string
    scannedAt: string
  }
  lockfiles: LockfileSummary[]
  exposure: ExposureResult
  fixSet: FixSetResult
  latencyMs: number
}

export interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

export interface GraphPackage {
  name: string
  ecosystem: string
  versions: number
}

export interface InvestigateAdvisory {
  id: string
  severity: string
  summary: string
  publishedAt: string
  modifiedAt: string
  references: string
  fixedVersions: Record<string, string>
  affectedVersions: Array<{ name: string; version: string; ecosystem: string }>
}

export interface BlastRadiusResult {
  ecosystem: string
  directDependents: Array<{ name: string; version: string }>
  transitiveDependents: Array<{ name: string; version: string }>
  maxDepth: number
  count: number
  paths: Array<{ path: string[]; depth: number }>
  affectedRepositories: string[]
  applications: string[]
  resolutions: Array<{
    repository: string
    lockfile: string
    commitSha: string
    requestedVersion: string
    resolvedVersion: string
    internalPath: string
  }>
  repositoryPaths: Array<{
    repository: string
    lockfile: string
    internalPath: string
    path: string[]
    depth: number
  }>
  latencyMs: number
}

export interface TyposquatCandidate {
  name: string
  version: string
  description: string
  popularity: number
  similarity: number
  editDistance: number
  factors: string[]
  risk: number
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  reason: string
}

export interface MaintainerRiskPackage {
  package: string
  ecosystem: string
  maintainers: string[]
  repositories: string[]
  versions: string[]
}

export interface InvestigateResult {
  package: string
  version: string
  ecosystem: string
  versionDetails: { name: string; version: string; ecosystem: string }
  advisories: InvestigateAdvisory[]
  blastRadius: BlastRadiusResult | null
  maintainerRisk: {
    package: string
    ecosystem: string
    maintainers: string[]
    controlledPackages: MaintainerRiskPackage[]
    totalPackages: number
    presentInRepositories: number
  }
  sharedMaintainers: Array<{ maintainer: string; packages: string[] }>
  typosquats: TyposquatCandidate[]
  recommendations: string[]
}
