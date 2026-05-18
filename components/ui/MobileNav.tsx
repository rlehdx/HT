'use client'
import { useState } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useCartStore } from '@/store/cart'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const count = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* 모바일 카트 아이콘 */}
      <a
        href="/checkout"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-text-main hover:bg-soft/60 transition-colors"
        aria-label="Cart"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </a>

      {/* 햄버거 */}
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
        <div className="absolute inset-x-0 top-full z-50 border-b border-border bg-white/97 backdrop-blur-md shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {/* 탭 메뉴 */}
            <div className="mb-1">
              <p className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-sub">Menu</p>
              <a
                href="/order-guide"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
              >
                <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Guide
              </a>
              <a
                href="/products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
              >
                <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All Items
              </a>
              <a
                href="/products?tab=new"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  New Items
                </span>
                <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-bold text-primary">NEW</span>
              </a>
              <a
                href="/products?tab=half"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-primary hover:bg-soft/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M17 17h.01M7 7L17 17M7 17L17 7" />
                  </svg>
                  Sale
                </span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">50%</span>
              </a>
            </div>

            {/* 카트 */}
            <div className="border-t border-border pt-1">
              <a
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Cart
                </span>
                {count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </a>
            </div>

            {/* 인증 */}
            <div className="border-t border-border pt-1">
              {isLoaded && isSignedIn ? (
                <>
                  <div className="px-4 py-2 text-xs text-text-sub">
                    Signed in as <span className="font-medium text-text-main">{user.firstName ?? user.emailAddresses[0]?.emailAddress}</span>
                  </div>
                  <SignOutButton>
                    <button
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : isLoaded ? (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-text-main hover:bg-soft/50 transition-colors"
                  >
                    <svg className="w-4 h-4 text-text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </button>
                </SignInButton>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
