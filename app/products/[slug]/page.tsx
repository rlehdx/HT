import { createClient } from '@/lib/supabase/server'
import { StockBadge } from '@/components/ui/StockBadge'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
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
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-sub">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-text-main font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-soft/30">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-text-sub/30">
              <span className="text-6xl">📦</span>
              <span className="text-sm font-medium">No Image Available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{product.category}</p>
          )}
          <h1 className="font-display text-2xl font-bold leading-snug text-text-main md:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StockBadge stock={product.stock} />
            {product.sku && (
              <span className="text-xs text-text-sub font-mono">SKU: {product.sku}</span>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-soft/20 px-4 py-4">
            <p className="text-3xl font-bold text-text-main">
              {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Contact for price'}
            </p>
            {product.unit && (
              <p className="mt-1 text-sm text-text-sub">per {product.unit}</p>
            )}
          </div>

          {product.description && (
            <div className="mt-5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-text-sub">Description</p>
              <p className="text-sm leading-relaxed text-text-sub">{product.description}</p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <AddToCartButton product={product} />
            <Link
              href="/products"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-border px-5 py-3 text-sm font-medium text-text-sub hover:border-primary hover:text-primary transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
