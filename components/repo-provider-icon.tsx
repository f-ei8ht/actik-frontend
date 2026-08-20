import type { RepoHost } from "@/lib/repo"

export function RepoProviderIcon({ host, className }: { host: RepoHost; className?: string }) {
  if (host === "gitlab") {
    return (
      <img
        src="/gitlab-logo-500-rgb.svg"
        alt="GitLab"
        className={className}
      />
    )
  }
  if (host === "github") {
    return (
      <>
        <img
          src="/GitHub_Invertocat_Black_Clearspace.svg"
          alt="GitHub"
          className={`${className ?? ""} dark:hidden`}
        />
        <img
          src="/GitHub_Invertocat_White_Clearspace.svg"
          alt="GitHub"
          className={`hidden ${className ?? ""} dark:block`}
        />
      </>
    )
  }
  return null
}
