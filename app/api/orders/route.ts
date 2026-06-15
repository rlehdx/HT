// PATH: app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const CartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity:  z.number().int().positive(),
  version:   z.number().int().nonnegative(),
  unitPrice: z.number().positive(),
})

const B2COrderSchema = z.object({
  type:            z.literal('b2c'),
  shippingName:    z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingPhone:   z.string().min(1),
  items:           z.array(CartItemSchema).min(1),
})

const B2BOrderSchema = z.object({
  type:             z.literal('b2b'),
  shippingName:     z.string().min(1),
  shippingAddress:  z.string().min(1),
  shippingPhone:    z.string().min(1),
  businessNumber:   z.string().min(1),
  companyName:      z.string().min(1),
  taxInvoiceEmail:  z.string().email(),
  items:            z.array(CartItemSchema).min(1),
})

const OrderSchema = z.discriminatedUnion('type', [B2COrderSchema, B2BOrderSchema])

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = OrderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const totalAmount = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const serviceClient = await createServiceClient()

  for (const item of data.items) {
    const { error: stockError } = await serviceClient.rpc('decrement_stock', {
      p_product_id: item.productId,
      p_qty:        item.quantity,
      p_version:    item.version,
    })

    if (stockError) {
      if (
        stockError.message.includes('VERSION_MISMATCH') ||
        stockError.message.includes('INSUFFICIENT_STOCK')
      ) {
        return NextResponse.json(
          { error: 'Stock has been updated. Please review your cart.' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'Failed to reserve stock.' }, { status: 500 })
    }
  }

  const orderInsert: Record<string, unknown> = {
    user_id:          user.id,
    type:             data.type,
    status:           'pending_payment',
    total_amount:     totalAmount,
    shipping_name:    data.shippingName,
    shipping_address: data.shippingAddress,
    shipping_phone:   data.shippingPhone,
  }

  if (data.type === 'b2b') {
    orderInsert.business_number   = data.businessNumber
    orderInsert.company_name      = data.companyName
    orderInsert.tax_invoice_email = data.taxInvoiceEmail
  }

  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .insert(orderInsert)
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
  }

  const orderItems = data.items.map(i => ({
    order_id:   order.id,
    product_id: i.productId,
    quantity:   i.quantity,
    unit_price: i.unitPrice,
  }))

  const { error: itemsError } = await serviceClient
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    return NextResponse.json({ error: 'Failed to save order items.' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 })
}
