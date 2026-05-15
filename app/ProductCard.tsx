'use client'
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
    <Link href={`/products/${product.sku}`} className="block h-full group">
      <div
        className="h-full rounded-xl border border-border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/25 hover:-translate-y-0.5 active:scale-[0.98] animate-fade-up"
        style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-soft/30">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div className="text-3xl opacity-30">{getCategoryEmoji(product.category)}</div>
              <span className="text-xs text-text-sub/40 font-medium">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StockBadge stock={product.stock} compact />
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {product.category && (
            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80 truncate">
              {product.category}
            </p>
          )}
          <p className="text-sm font-semibold text-text-main leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </p>
          {product.unit && (
            <p className="mt-0.5 text-xs text-text-sub/70 truncate">{product.unit}</p>
          )}
          <div className="mt-2.5 flex items-center justify-between gap-1">
            <p className="text-base font-bold text-text-main">
              {product.price > 0 ? (
                <span>${product.price.toFixed(2)}</span>
              ) : (
                <span className="text-xs font-medium text-text-sub">Contact for price</span>
              )}
            </p>
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function getCategoryEmoji(category?: string): string {
  if (!category) return '📦'
  const c = category.toLowerCase()
  if (c.includes('frozen')) return '❄️'
  if (c.includes('seafood') || c.includes('fish')) return '🐟'
  if (c.includes('meat')) return '🥩'
  if (c.includes('vegeta')) return '🥦'
  if (c.includes('fruit')) return '🍎'
  if (c.includes('grain') || c.includes('rice')) return '🌾'
  if (c.includes('dairy')) return '🧀'
  if (c.includes('dried')) return '☀️'
  return '📦'
}
