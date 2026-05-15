// PATH: app/(store)/checkout/CheckoutForm.tsx
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

interface CheckoutFormProps {
  role: UserRole
}

export function CheckoutForm({ role }: CheckoutFormProps) {
  const { items, totalAmount, clearCart } = useCartStore()
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

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-main">Shipping</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input name="shippingName" value={fields.shippingName} onChange={handleChange} required className={inputClass} placeholder="Jane Doe" />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input name="shippingAddress" value={fields.shippingAddress} onChange={handleChange} required className={inputClass} placeholder="123 Main St, Seoul" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="shippingPhone" value={fields.shippingPhone} onChange={handleChange} required className={inputClass} placeholder="+82 10 0000 0000" />
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

        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-main">Order Summary</h2>
          <ul className="space-y-2">
            {items.map(i => (
              <li key={i.product.id} className="flex items-center justify-between text-sm">
                <span className="text-text-main">{i.product.name} × {i.quantity}</span>
                <span className="font-medium text-primary">${(i.product.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-text-main">Total</span>
              <span className="text-primary">${totalAmount().toFixed(2)}</span>
            </div>
          </div>
        </GlassCard>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <PinkButton type="submit" fullWidth disabled={submitting || items.length === 0}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </PinkButton>
      </form>

      <AnimatePresence>
        {toasts.map(t => (
          <ToastWarning key={t.id} message={t.message} onDismiss={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </>
  )
}
