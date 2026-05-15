// PATH: app/(store)/layout.tsx
import type { ReactNode } from 'react'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold text-primary">
            HAE
          </a>
          <nav className="flex items-center gap-6">
            <a href="/products" className="text-sm text-text-sub hover:text-text-main">Products</a>
            <a href="/checkout" className="text-sm text-text-sub hover:text-text-main">Cart</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
