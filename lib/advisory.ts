export function advisoryUrl(id: string): string | null {
  if (/^(GHSA|PYSEC|CVE)/i.test(id)) return `https://osv.dev/vulnerability/${id}`
  return null
}
