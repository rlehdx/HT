import { auth } from '@clerk/nextjs/server'
import { CheckoutForm } from './CheckoutForm'

export default async function CheckoutPage() {
  const { userId } = await auth()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Order</p>
        <h1 className="font-display text-3xl font-bold text-text-main">Checkout</h1>
      </div>
      <CheckoutForm role="b2c" requiresAuth={!userId} />
    </div>
  )
}
