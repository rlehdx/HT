'use client'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { CartBadge } from './CartBadge'
import Link from 'next/link'

export function HeaderNav() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <nav className="hidden md:flex items-center gap-2">
      <Link
        href="/products"
        className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all"
      >
        Products
      </Link>

      {/* Clerk 로딩 전에도 버튼 보임 */}
      {!isLoaded || !isSignedIn ? (
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign In
          </button>
        </SignInButton>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-soft/60 px-3 py-2">
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
              {(user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress?.[0] ?? '?').toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-main max-w-[120px] truncate">
              {user.firstName ?? user.emailAddresses[0]?.emailAddress}
            </span>
          </div>
          <SignOutButton>
            <button className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}

      <CartBadge />
    </nav>
  )
}
