export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh justify-center px-4">
      <div className="flex w-full max-w-7xl flex-col border border-border/40">
        <main className="flex-1 px-6 py-12 lg:px-16">{children}</main>
      </div>
    </div>
  )
}
