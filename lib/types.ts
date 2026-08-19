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

export interface DependencyGraphNode {
  id: string
  type: "package" | "advisory" | "repository"
  label: string
  severity?: string
  ecosystem?: string
  version?: string
}

export interface DependencyGraphEdge {
  source: string
  target: string
  type: string
}

export interface DependencyGraph {
  root: string
  nodes: DependencyGraphNode[]
  edges: DependencyGraphEdge[]
}

export interface InvestigateAdvisory {
  id: string
  severity: string
  summary: string
  publishedAt: string
  modifiedAt: string
  references: string
  fixedVersions: Record<string, string>
  introducedVersions: Record<string, string>
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

export interface ExposureApp {
  repository: string
  lockfile: string
  kind: string
  name: string
  version: string
  ecosystem: string
  requestedVersion: string
  scannedAt: string
  conclusion: "EXPOSED" | "AT_RISK" | "NOT_AFFECTED"
}

export interface ExposureWindowResult {
  advisory: {
    id: string
    severity: string
    summary: string
    publishedAt: string
    modifiedAt: string
  }
  window: { start: string; end: string; live: boolean }
  conclusions: { exposed: string[]; atRisk: string[] }
  exposedWhileLive: ExposureApp[]
  currentlyAffected: ExposureApp[]
  affectedApps: string[]
}

export interface WatchStatus {
  lastRunAt: string | null
  lastChecked: number
  lastNew: number
  lastExisting: number
  lastError: string | null
}

export interface Incident {
  advisoryId: string
  severity: string
  summary: string
  package: string
  version: string
  ecosystem: string
  fixedVersion: string
  firstSeenAt: string
  repositories: string[]
  lockfiles: string[]
  exposurePath: string[]
}

export interface PropagationApp {
  repository: string
  lockfile: string
  kind: string
  depth: number
  direct: boolean
  chain: string[]
  exposedAt: string
}

export interface PropagationResult {
  package: { name: string; version: string; ecosystem: string }
  compromisedAt: string
  perHopMs: number
  directApps: number
  transitiveApps: number
  totalApps: number
  maxDepth: number
  firstExposedAt: string | null
  lastExposedAt: string | null
  medianExposedAt: string | null
  spanMs: number
  apps: PropagationApp[]
  timeline: Array<{ exposedAt: string; repository: string; depth: number }>
}
