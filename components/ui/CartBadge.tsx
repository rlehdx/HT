'use client'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'

export function CartBadge() {
  const items = useCartStore(s => s.items)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link
      href="/checkout"
      className="relative ml-2 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      Cart
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
