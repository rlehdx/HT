// PATH: app/(admin)/layout.tsx
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-primary">HAE Admin</span>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-sm text-text-sub hover:text-text-main">Dashboard</a>
            <a href="/inventory" className="text-sm text-text-sub hover:text-text-main">Inventory</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12">{children}</main>
    </div>
  )
}
