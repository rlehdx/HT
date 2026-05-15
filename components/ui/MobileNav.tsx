'use client'
import { useState } from 'react'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-text-main hover:bg-soft/60 transition-colors"
        aria-label="Menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[57px] z-50 border-b border-border bg-white/97 backdrop-blur-md shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            <a
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
            >
              <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Products
            </a>
            <a
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
            >
              <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cart
            </a>
          </nav>
        </div>
      )}
    </div>
  )
}
