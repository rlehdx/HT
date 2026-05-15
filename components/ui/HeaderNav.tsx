'use client'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { CartBadge } from './CartBadge'
import Link from 'next/link'

export function HeaderNav() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <nav className="hidden md:flex items-center gap-1">
      <Link
        href="/products"
        className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all"
      >
        Products
      </Link>

      {/* 로그인 상태 */}
      {isLoaded && isSignedIn ? (
        <div className="flex items-center gap-2 ml-1">
          <span className="text-xs text-text-sub font-medium">
            {user.firstName ?? user.emailAddresses[0]?.emailAddress}
          </span>
          <SignOutButton>
            <button className="rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      ) : isLoaded ? (
        <SignInButton mode="modal">
          <button className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-text-sub hover:bg-soft/60 hover:text-text-main transition-all">
            Sign In
          </button>
        </SignInButton>
      ) : null}

      <CartBadge />
    </nav>
  )
}
