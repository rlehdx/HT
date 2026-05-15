import { createClient } from '@/lib/supabase/server'
import { CheckoutForm } from './CheckoutForm'
import type { Profile } from '@/lib/types'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: Profile['role'] = 'b2c'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()
    role = (profile as Profile | null)?.role ?? 'b2c'
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Order</p>
        <h1 className="font-display text-3xl font-bold text-text-main">Checkout</h1>
      </div>
      <CheckoutForm role={role} requiresAuth={!user} />
    </div>
  )
}
