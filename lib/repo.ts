export type RepoHost = "github" | "gitlab" | null

/**
 * Detect the VCS host from a repo input (full URL or owner/repo).
 * Plain `owner/repo` is treated as GitHub. Returns null when unknown.
 */
export function detectRepoHost(input: string): RepoHost {
  const clean = input.trim()
  if (!clean) return null

  if (/^(https?:\/\/)?(www\.)?gitlab\.com\b/i.test(clean)) {
    return "gitlab"
  }
  if (/^(https?:\/\/)?(www\.)?github\.com\b/i.test(clean)) {
    return "github"
  }
  if (/^(https?:\/\/)?(www\.)?bitbucket\.org\b/i.test(clean)) {
    return null
  }
  if (/^(https?:\/\/)?(www\.)?codeberg\.org\b/i.test(clean)) {
    return null
  }

  if (clean.includes("://")) {
    return null
  }

  const parts = clean.split("/").filter(Boolean)
  if (parts.length >= 2) {
    return "github"
  }
  return null
}

/**
 * Validate a repo input. Returns an error string, or null when valid.
 * Only GitHub and GitLab public repositories are supported.
 */
export function validateRepo(input: string): string | null {
  const clean = input.trim()
  if (!clean) return "Enter a repository to scan."

  const host = detectRepoHost(clean)
  if (host === null) {
    return "Only GitHub and GitLab public repositories are supported."
  }

  if (clean.includes("://") && !/^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)\b/i.test(clean)) {
    return "Only GitHub and GitLab public repositories are supported."
  }

  const path = clean
    .replace(/^https?:\/\/(www\.)?(github\.com|gitlab\.com)\//i, "")
    .replace(/\/$/, "")
    .replace(/\.git$/, "")

  const parts = path.split("/").filter(Boolean)
  if (parts.length < 2 || parts.length > 3) {
    return "Expected \"owner/repo\" or a GitHub / GitLab repository URL."
  }

  return null
}
