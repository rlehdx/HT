import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-xl font-bold tracking-tight text-primary">HaiTai</a>
            <span className="rounded-md bg-soft px-2 py-0.5 text-xs font-semibold text-primary">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all">Dashboard</a>
            <a href="/admin/inventory" className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all">Inventory</a>
            <a href="/" className="ml-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all">← Store</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
    </div>
  )
}
