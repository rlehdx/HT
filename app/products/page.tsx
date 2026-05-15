import { createClient } from '@/lib/supabase/server'
import { CategoryFilter } from '@/components/ui/CategoryFilter'
import type { Product } from '@/lib/types'

export const metadata = {
  title: 'Products — HAETAE',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })

  const items = (products ?? []) as Product[]

  return (
    <div>
      <div className="border-b border-border bg-white px-4 py-7 md:py-9">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Catalog</p>
          <h1 className="font-display text-3xl font-bold text-text-main md:text-4xl">All Products</h1>
          <p className="mt-1.5 text-sm text-text-sub">
            Fresh and frozen seafood — browse by category or search below.
          </p>
        </div>
      </div>
      <CategoryFilter products={items} />
    </div>
  )
}
