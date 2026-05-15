// PATH: lib/order-machine.ts
import type { OrderStatus } from '@/lib/types'
import { createServiceClient } from '@/lib/supabase/server'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['processing', 'cancelled'],
  processing:      ['shipped', 'cancelled'],
  shipped:         ['delivered', 'cancelled'],
  delivered:       ['refunded'],
  cancelled:       [],
  refunded:        [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

export async function transitionOrder(
  orderId: string,
  newStatus: OrderStatus,
  userId: string
): Promise<{ error: string | null }> {
  const supabase = await createServiceClient()

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) return { error: 'Order not found' }

  const currentStatus = order.status as OrderStatus
  if (!canTransition(currentStatus, newStatus)) {
    return { error: `Cannot transition from ${currentStatus} to ${newStatus}` }
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (updateError) return { error: updateError.message }
  return { error: null }
}
