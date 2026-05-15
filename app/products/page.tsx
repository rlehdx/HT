import { createClient } from '@/lib/supabase/server'
import { CategoryFilter } from '@/components/ui/CategoryFilter'
import type { Product } from '@/lib/types'

export const metadata = {
  title: 'Products — HAE',
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
      <div className="bg-gradient-to-b from-soft/30 to-surface border-b border-border px-4 py-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-text-main md:text-3xl">전체 상품</h1>
          <p className="mt-1 text-sm text-text-sub">신선한 해산물 및 냉동식품을 카테고리별로 찾아보세요</p>
        </div>
      </div>
      <CategoryFilter products={items} />
    </div>
  )
}
