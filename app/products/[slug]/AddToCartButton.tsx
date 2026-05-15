// PATH: app/(store)/products/[slug]/AddToCartButton.tsx
'use client'
import { PinkButton } from '@/components/ui/PinkButton'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/types'
import { useState } from 'react'

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <PinkButton fullWidth onClick={handleAdd} disabled={product.stock === 0}>
      {product.stock === 0 ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
    </PinkButton>
  )
}
