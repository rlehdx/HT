// PATH: app/(store)/page.tsx
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { PinkButton } from '@/components/ui/PinkButton'
import { StockBadge } from '@/components/ui/StockBadge'
import { BentoGrid, BentoCell } from '@/components/ui/BentoGrid'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-soft via-surface to-white px-4 py-24 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-text-main md:text-6xl">
          Refined. Simple. <span className="text-primary">Beautiful.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-text-sub">
          Premium goods for discerning buyers — B2B and B2C, one seamless experience.
        </p>
        <Link href="/products">
          <PinkButton>Shop Now</PinkButton>
        </Link>
      </section>

      {/* Product Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-semibold text-text-main">Featured Products</h2>
        <BentoGrid>
          {items.map((product, index) => (
            <BentoCell key={product.id} span={index === 0 ? 2 : 1}>
              <Link href={`/products/${product.sku}`} className="block h-full">
                <GlassCard delay={index * 0.06} className="h-full hover:shadow-md transition-shadow">
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-soft">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-text-sub">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-text-main">{product.name}</p>
                      <p className="mt-1 text-sm text-text-sub">{product.category}</p>
                    </div>
                    <StockBadge stock={product.stock} />
                  </div>
                  <p className="mt-3 text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </GlassCard>
              </Link>
            </BentoCell>
          ))}
        </BentoGrid>
      </section>
    </div>
  )
}
