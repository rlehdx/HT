// PATH: hooks/useRealtimeStock.ts
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/types'

export function useRealtimeStock(
  onStockAdjusted: (productName: string) => void
) {
  const { items, updateQuantity } = useCartStore()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('products-stock')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'ht', table: 'products' },
        (payload) => {
          const updated = payload.new as Product
          const cartItem = items.find(i => i.product.id === updated.id)

          if (cartItem && updated.stock < cartItem.quantity) {
            updateQuantity(updated.id, updated.stock)
            onStockAdjusted(updated.name)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [items, updateQuantity, onStockAdjusted])
}
