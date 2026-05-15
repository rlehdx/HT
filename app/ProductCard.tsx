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
        className="h-full rounded-xl border border-border bg-white overflow-hidden transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
        style={{
          animationDelay: `${index * 40}ms`,
        }}
      >
        {/* 이미지 영역 */}
        <div className="relative aspect-square w-full overflow-hidden bg-soft/40">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-text-sub/50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No Image</span>
            </div>
          )}
          {/* 재고 배지 */}
          <div className="absolute top-2 right-2">
            <StockBadge stock={product.stock} compact />
          </div>
        </div>

        {/* 정보 영역 */}
        <div className="p-3">
          {product.category && (
            <p className="mb-0.5 text-xs font-medium text-primary truncate">{product.category}</p>
          )}
          <p className="text-sm font-semibold text-text-main leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </p>
          {product.unit && (
            <p className="mt-0.5 text-xs text-text-sub truncate">{product.unit}</p>
          )}
          <div className="mt-2 flex items-center justify-between gap-1">
            <p className="text-base font-bold text-text-main">
              {product.price > 0 ? `$${product.price.toFixed(2)}` : '가격 문의'}
            </p>
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
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
