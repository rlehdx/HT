// PATH: app/(store)/products/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { StockBadge } from '@/components/ui/StockBadge'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AddToCartButton } from './AddToCartButton'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('sku', slug)
    .single()

  if (!data) notFound()
  const product = data as Product

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-soft">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-text-sub">No Image</div>
          )}
        </div>
        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="mb-1 text-sm text-text-sub">{product.category}</p>
            <h1 className="mb-2 text-3xl font-bold text-text-main">{product.name}</h1>
            <StockBadge stock={product.stock} />
            <p className="mt-4 text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="mt-4 text-sm text-text-sub">
              Unit: <span className="text-text-main">{product.unit}</span>
            </p>
            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-text-sub">{product.description}</p>
            )}
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
