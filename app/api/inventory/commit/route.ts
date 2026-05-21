// PATH: app/api/inventory/commit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { parseExcelBuffer, validateRows } from '@/lib/excel-pipeline'
import { createServiceClient } from '@/lib/supabase/server'

export const config = {
  api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  const parsed = parseExcelBuffer(buffer)

  if ('headerError' in parsed) {
    return NextResponse.json({ error: parsed.headerError }, { status: 422 })
  }

  const { valid, errors } = validateRows(parsed)

  if (valid.length === 0) {
    return NextResponse.json({ error: 'No valid rows to commit', errors }, { status: 422 })
  }

  const supabase = await createServiceClient()

  const upsertRows = valid.map(row => ({
    sku:         row.SKU,
    name:        row.ProductName,
    category:    row.Category,
    price:       row.Price as number,
    stock:       row.Stock as number,
    unit:        row.Unit,
    description: row.Description || null,
    image_url:   row.ImageURL || null,
  }))

  const { error: upsertError } = await supabase
    .from('products')
    .upsert(upsertRows, { onConflict: 'sku' })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ committed: valid.length, errors }, { status: 200 })
}
