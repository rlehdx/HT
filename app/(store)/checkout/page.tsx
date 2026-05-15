// PATH: app/(store)/checkout/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckoutForm } from './CheckoutForm'
import type { Profile } from '@/lib/types'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text-main">Checkout</h1>
      <CheckoutForm role={(profile as Profile | null)?.role ?? 'b2c'} />
    </div>
  )
}
