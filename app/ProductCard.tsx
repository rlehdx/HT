// PATH: app/(store)/ProductCard.tsx
'use client'
import { GlassCard } from '@/components/ui/GlassCard'
import { StockBadge } from '@/components/ui/StockBadge'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
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
  )
}
