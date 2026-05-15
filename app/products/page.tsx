import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '../ProductCard'
import type { Product } from '@/lib/types'

export const metadata = {
  title: 'Products — HAE',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const items = (products ?? []) as Product[]

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text-main">All Products</h1>
      {items.length === 0 ? (
        <p className="text-text-sub">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
