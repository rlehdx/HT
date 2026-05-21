// PATH: app/(store)/page.tsx
import { createClient } from '@/lib/supabase/server'
import { StockBadge } from '@/components/ui/StockBadge'
import { BentoGrid, BentoCell } from '@/components/ui/BentoGrid'
import { HeroSection } from './HeroSection'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)

  const items = (products ?? []) as Product[]

  return (
    <div>
      <HeroSection />

      {/* 333 섹션 구분선 */}
      <div className="border-t-2 border-b-2" style={{ borderColor: '#E8001A' }}>
        <img
          src="/333.png"
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 'none', display: 'block' }}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-text-main">Featured Products</h2>
        <BentoGrid>
          {items.map((product, index) => (
            <BentoCell key={product.id} span={index === 0 ? 2 : 1}>
              <ProductCard product={product} index={index} />
            </BentoCell>
          ))}
        </BentoGrid>
      </section>
    </div>
  )
}
