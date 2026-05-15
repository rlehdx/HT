'use client'
import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { useRealtimeStock } from '@/hooks/useRealtimeStock'
import { ToastWarning, useToast } from '@/components/ui/ToastWarning'
import { GlassCard } from '@/components/ui/GlassCard'
import { PinkButton } from '@/components/ui/PinkButton'
import type { UserRole } from '@/lib/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CheckoutFormProps {
  role: UserRole
  requiresAuth?: boolean
}

export function CheckoutForm({ role, requiresAuth = false }: CheckoutFormProps) {
  const { items, totalAmount, clearCart, removeItem, updateQuantity } = useCartStore()
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fields, setFields] = useState({
    shippingName:    '',
    shippingAddress: '',
    shippingPhone:   '',
    businessNumber:  '',
    companyName:     '',
    taxInvoiceEmail: '',
  })

  const onStockAdjusted = useCallback((name: string) => {
    addToast(`Stock for "${name}" has been updated. Your cart quantity was adjusted.`)
  }, [addToast])

  useRealtimeStock(onStockAdjusted)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: Record<string, unknown> = {
      type:            role,
      shippingName:    fields.shippingName,
      shippingAddress: fields.shippingAddress,
      shippingPhone:   fields.shippingPhone,
      items: items.map(i => ({
        productId: i.product.id,
        quantity:  i.quantity,
        version:   i.product.version,
        unitPrice: i.product.price,
      })),
    }

    if (role === 'b2b') {
      payload.businessNumber  = fields.businessNumber
      payload.companyName     = fields.companyName
      payload.taxInvoiceEmail = fields.taxInvoiceEmail
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Something went wrong.')
      setSubmitting(false)
      return
    }

    clearCart()
    router.push(`/orders/${json.orderId}`)
  }

  const inputClass = 'w-full min-h-[44px] rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-primary'
  const labelClass = 'mb-1 block text-xs font-medium text-text-sub'

  // 빈 카트
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-soft">
          <svg className="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="font-semibold text-text-main">Your cart is empty</p>
        <p className="mt-1 text-sm text-text-sub">Add products before checking out.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Order Summary — 상단에 배치 */}
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-main">Cart Summary</h2>
          <ul className="divide-y divide-border">
            {items.map(i => (
              <li key={i.product.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-main">{i.product.name}</p>
                  <p className="text-xs text-text-sub">{i.product.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(i.product.id, i.quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-sub hover:border-primary hover:text-primary transition-colors text-sm"
                  >−</button>
                  <span className="w-6 text-center text-sm font-medium">{i.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(i.product.id, i.quantity + 1)}
                    disabled={i.quantity >= i.product.stock}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-text-sub hover:border-primary hover:text-primary transition-colors text-sm disabled:opacity-30"
                  >+</button>
                </div>
                <span className="w-20 text-right text-sm font-semibold text-text-main">
                  ${(i.product.price * i.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i.product.id)}
                  className="text-text-sub hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold">
            <span className="text-text-main">Total</span>
            <span className="text-lg text-primary">${totalAmount().toFixed(2)}</span>
          </div>
        </GlassCard>

        {/* 미로그인 안내 */}
        {requiresAuth && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            You need to <a href="/login" className="font-semibold underline">sign in</a> to place an order.
          </div>
        )}

        {!requiresAuth && (
          <>
            <GlassCard>
              <h2 className="mb-4 text-lg font-semibold text-text-main">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="shippingName" value={fields.shippingName} onChange={handleChange} required className={inputClass} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input name="shippingAddress" value={fields.shippingAddress} onChange={handleChange} required className={inputClass} placeholder="123 Main St" />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input name="shippingPhone" value={fields.shippingPhone} onChange={handleChange} required className={inputClass} placeholder="+1 000 000 0000" />
                </div>
              </div>
            </GlassCard>

            {role === 'b2b' && (
              <GlassCard>
                <h2 className="mb-4 text-lg font-semibold text-text-main">Tax Invoice (B2B)</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Business Registration Number</label>
                    <input name="businessNumber" value={fields.businessNumber} onChange={handleChange} required className={inputClass} placeholder="000-00-00000" />
                  </div>
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <input name="companyName" value={fields.companyName} onChange={handleChange} required className={inputClass} placeholder="ACME Corp." />
                  </div>
                  <div>
                    <label className={labelClass}>Tax Invoice Email</label>
                    <input name="taxInvoiceEmail" type="email" value={fields.taxInvoiceEmail} onChange={handleChange} required className={inputClass} placeholder="billing@acme.com" />
                  </div>
                </div>
              </GlassCard>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <PinkButton type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </PinkButton>
          </>
        )}
      </form>

      <AnimatePresence>
        {toasts.map(t => (
          <ToastWarning key={t.id} message={t.message} onDismiss={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </>
  )
}
